package handlers

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"strings"
	"net/http"
	"os"
	"time"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"exams-resultspro-backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PaymentHandler struct{}

func (h *PaymentHandler) GetCoinPacks(c *gin.Context) {
	var packs []models.CoinPack
	if err := database.DB.Where("is_active = ?", true).Order("price asc").Find(&packs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch coin packs"})
		return
	}

	c.JSON(http.StatusOK, packs)
}

func calculateFinalTotal(targetPriceNgn float64) int {
	vat := targetPriceNgn * 0.075
	basePlusVat := targetPriceNgn + vat

	percentageFee := 0.015
	flatFee := 0.0
	if basePlusVat >= 2500 {
		flatFee = 100.0
	}

	total := (basePlusVat + flatFee) / (1 - percentageFee)
	totalFee := total - basePlusVat

	finalTotal := 0.0
	if totalFee > 2000 {
		finalTotal = basePlusVat + 2000
	} else {
		finalTotal = math.Ceil(total)
	}

	return int(finalTotal)
}

func (h *PaymentHandler) InitializePayment(c *gin.Context) {
	fmt.Println("DEBUG: REAL PAYSTACK INITIALIZE HANDLER CALLED")
	userID, _ := c.Get("userId")

	var input struct {
		PackID      string `json:"packId" binding:"required"`
		CallbackURL string `json:"callbackUrl"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Pack ID is required"})
		return
	}

	var pack models.CoinPack
	var plan models.SubscriptionPlan
	var itemName, itemType, itemAccessLevel string
	var itemPrice, itemCoins int

	if err := database.DB.Where("id = ?", input.PackID).First(&pack).Error; err == nil {
		itemName = pack.Name
		itemType = pack.Type // 'COIN' or 'PREMIUM'
		itemPrice = pack.Price
		itemCoins = pack.Coins
		if itemType == "PREMIUM" {
			itemAccessLevel = "PREMIUM"
		}
	} else if err := database.DB.Where("id = ?", input.PackID).First(&plan).Error; err == nil {
		itemName = plan.Name
		itemType = "PLAN"
		itemPrice = plan.Price
		itemCoins = 0
		itemAccessLevel = plan.AccessLevel
	} else {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	finalAmount := calculateFinalTotal(float64(itemPrice))
	amountKobo := finalAmount * 100

	url := "https://api.paystack.co/transaction/initialize"
	
	// Prioritize frontend-provided callback, then env, then hardcoded fallback
	callbackURL := input.CallbackURL
	if callbackURL == "" {
		callbackURL = os.Getenv("PAYSTACK_CALLBACK_URL")
		if callbackURL == "" {
			callbackURL = "https://resultspro.ng/shop/verify"
		}
	}

	body := map[string]interface{}{
		"email":        user.Email,
		"amount":       amountKobo,
		"callback_url": callbackURL,
		"metadata": map[string]interface{}{
			"pack_id": input.PackID,
			"user_id": user.ID,
			"coins":   itemCoins,
			"type":    itemType,
			"access":  itemAccessLevel,
		},
	}

	jsonBody, _ := json.Marshal(body)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	req.Header.Set("Authorization", "Bearer "+os.Getenv("PAYSTACK_SECRET_KEY"))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to payment gateway"})
		return
	}
	defer resp.Body.Close()

	var result struct {
		Status  bool   `json:"status"`
		Message string `json:"message"`
		Data    struct {
			AuthorizationURL string `json:"authorization_url"`
			AccessCode       string `json:"access_code"`
			Reference        string `json:"reference"`
		} `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse payment gateway response"})
		return
	}

	if !result.Status {
		fmt.Printf("PAYSTACK ERROR: %s\n", result.Message); c.JSON(http.StatusBadRequest, gin.H{"error": result.Message})
		return
	}

	// Create pending purchase record
	purchase := models.Purchase{
		ID:               uuid.New().String(),
		UserID:           user.ID,
		PackName:         itemName,
		ItemType:         itemType,
		CoinsGranted:     itemCoins,
		AmountNgn:        finalAmount,
		PaymentReference: &result.Data.Reference,
		Status:           "pending",
	}
	database.DB.Create(&purchase)

	c.JSON(http.StatusOK, result.Data)
}

func (h *PaymentHandler) VerifyPayment(c *gin.Context) {
	fmt.Println("CRITICAL_DEBUG: VerifyPayment ENTRY")
	reference := c.Query("reference")
	fmt.Printf("CRITICAL_DEBUG: reference is '%s'\n", reference)
	if reference == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Reference is required"})
		return
	}

	// Mock success for testing
	if reference == "MOCK_REF" {
		userIDVal, _ := c.Get("userId")
		userID := userIDVal.(string)

		err := database.DB.Transaction(func(tx *gorm.DB) error {
			// Record purchase
			purchase := models.Purchase{
				ID:               uuid.New().String(),
				UserID:           userID,
				PaymentReference: &reference,
				AmountNgn:        1000,
				Status:           "success",
				PackName:         "Mock Pack",
				CoinsGranted:     100,
			}
			if err := tx.Create(&purchase).Error; err != nil {
				return err
			}

			// Grant coins
			if err := tx.Model(&models.User{}).Where("id = ?", userID).
				Update("coin_balance", gorm.Expr("coin_balance + ?", 100)).Error; err != nil {
				return err
			}

			// Record transaction
			tx.Create(&models.CoinTransaction{
				ID:          uuid.New().String(),
				UserID:      userID,
				Amount:      100,
				Type:        "SHOP_PURCHASE",
				Description: utils.StringPtr("Purchased 100 Coins"),
				ReferenceID: &reference,
			})
			// Notify User
			utils.SendNotification(userID, "Purchase Successful!", "You've successfully purchased 100 coins.", models.NotificationTypeSuccess, models.NotificationRouteBoth)
			return nil
		})
		
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusOK, gin.H{"message": "Payment verified and coins granted", "coins": 100})
		return
	}

	url := fmt.Sprintf("https://api.paystack.co/transaction/verify/%s", reference)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+os.Getenv("PAYSTACK_SECRET_KEY"))

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("ERROR: Failed to connect to Paystack: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify transaction"})
		return
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		log.Printf("ERROR: Paystack returned non-200 status: %d Body: %s", resp.StatusCode, string(bodyBytes))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Payment gateway error during verification"})
		return
	}

	var result struct {
		Status  bool   `json:"status"`
		Message string `json:"message"`
		Data    struct {
			Status   string `json:"status"`
			Metadata json.RawMessage `json:"metadata"`
		} `json:"data"`
	}

	if err := json.Unmarshal(bodyBytes, &result); err != nil {
		log.Printf("ERROR: Failed to parse Paystack JSON: %v. Body: %s", err, string(bodyBytes))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse verification response"})
		return
	}

	if !result.Status || result.Data.Status != "success" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Transaction not successful"})
		return
	}

	// Parse metadata manually to be safer
	var metadata struct {
		PackID string `json:"pack_id"`
		UserID string `json:"user_id"`
		Coins  int    `json:"coins"`
		Type   string `json:"type"`
		Access string `json:"access"`
	}
	// Try to unmarshal metadata, but don't fail hard if it's empty/null
	_ = json.Unmarshal(result.Data.Metadata, &metadata)

	purchase, err := processSuccessfulPayment(reference, metadata)
	if err != nil {
		if err.Error() == "Purchase record not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Purchase record not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to finalize purchase"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Payment verified successfully",
		"packName": purchase.PackName,
		"coins": purchase.CoinsGranted,
	})
}


func processSuccessfulPayment(reference string, metadata struct {
	PackID string `json:"pack_id"`
	UserID string `json:"user_id"`
	Coins  int    `json:"coins"`
	Type   string `json:"type"`
	Access string `json:"access"`
}) (*models.Purchase, error) {
	var purchase models.Purchase
	if err := database.DB.Where("payment_reference = ?", reference).First(&purchase).Error; err != nil {
		return nil, fmt.Errorf("Purchase record not found")
	}

	if purchase.Status == "success" {
		return &purchase, nil // Already processed
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&purchase).Update("status", "success").Error; err != nil {
			return err
		}

		isPlan := metadata.Type == "PLAN" || metadata.Type == "PREMIUM"
		isPremium := isPlan && (metadata.Access == "PREMIUM" || (!strings.Contains(strings.ToLower(purchase.PackName), "ican")))
		isIcan := isPlan && (metadata.Access == "ICAN_FULL" || metadata.Access == "ICAN_SINGLE" || strings.Contains(strings.ToLower(purchase.PackName), "ican"))
		
		var txType string
		var txDesc string

		if isPlan && isPremium {
			expiry := time.Now().AddDate(0, 1, 0)
			if err := tx.Model(&models.User{}).Where("id = ?", purchase.UserID).
				Updates(map[string]interface{}{
					"is_premium":       true,
					"premium_expires_at": &expiry,
				}).Error; err != nil {
				return err
			}
			txType = "PLAN_PURCHASE"
			txDesc = "Upgraded to Premium Access"
		} else if isIcan {
			expiry := time.Now().AddDate(0, 6, 0)
			
			planType := "Full Access"
			if purchase.PackName != "" {
				planType = purchase.PackName
			}

			if err := tx.Model(&models.User{}).Where("id = ?", purchase.UserID).
				Updates(map[string]interface{}{
					"has_ican":       true,
					"ican_expires_at": &expiry,
					"ican_plan":      &planType,
				}).Error; err != nil {
				return err
			}
			txType = "PLAN_PURCHASE"
			txDesc = "Purchased ICAN " + planType
		} else {
			if err := tx.Model(&models.User{}).Where("id = ?", purchase.UserID).
				Update("coin_balance", gorm.Expr("coin_balance + ?", purchase.CoinsGranted)).Error; err != nil {
				return err
			}
			txType = "COIN_PURCHASE"
			txDesc = "Purchased " + purchase.PackName
		}

		coinTrans := models.CoinTransaction{
			ID:          uuid.New().String(),
			UserID:      purchase.UserID,
			Amount:      purchase.CoinsGranted,
			Type:        txType,
			Description: &txDesc,
			ReferenceID: &purchase.ID,
		}
		if err := tx.Create(&coinTrans).Error; err != nil {
			return err
		}

		// Handle Referral Conversion
		if txType == "PLAN_PURCHASE" {
			var referral models.Referral
			// If this user was referred, and the referral is still 'pending'
			if err := tx.Where("referee_id = ? AND status = ?", purchase.UserID, "pending").First(&referral).Error; err == nil {
			
				// Fetch Referral Settings
				var coinRewardSetting models.SystemSetting
				var fiatPercentSetting models.SystemSetting
				rewardCoins := 50
				fiatPercent := 10
				if tx.Where("id = ?", "referral_coin_reward").First(&coinRewardSetting).Error == nil {
					fmt.Sscanf(coinRewardSetting.Value, "%d", &rewardCoins)
				}
				if tx.Where("id = ?", "referral_fiat_percent").First(&fiatPercentSetting).Error == nil {
					fmt.Sscanf(fiatPercentSetting.Value, "%d", &fiatPercent)
				}
				rewardFiat := (purchase.AmountNgn * fiatPercent) / 100

				// 1. Update the referral status, coins_awarded and fiat_awarded
				if err := tx.Model(&referral).Updates(map[string]interface{}{
					"status":        "converted",
					"coins_awarded": rewardCoins,
					"fiat_awarded":  rewardFiat,
				}).Error; err != nil {
					log.Printf("Failed to update referral: %v", err)
				}

				// 2. Award coins to the referrer
				if rewardCoins > 0 {
					if err := tx.Model(&models.User{}).Where("id = ?", referral.ReferrerID).
						Update("coin_balance", gorm.Expr("coin_balance + ?", rewardCoins)).Error; err == nil {
					
						// 3. Create a coin transaction for the referrer
						desc := "Referral Bonus"
						refTx := models.CoinTransaction{
							ID:          uuid.New().String(),
							UserID:      referral.ReferrerID,
							Amount:      rewardCoins,
							Type:        "REFERRAL_BONUS",
							Description: &desc,
							ReferenceID: &referral.ID,
						}
						tx.Create(&refTx)
					}
				}
			
				// 3. (Fiat/discount is added to their 'wallet' virtually via sum(fiat_awarded), handled at payout time)
			}

		}

		return nil
	})
	if err != nil {
		return nil, err
	}
	return &purchase, nil
}


func (h *PaymentHandler) PaystackWebhook(c *gin.Context) {
	// Read body securely for HMAC validation
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read body"})
		return
	}

	// Validate Paystack HMAC signature
	paystackSignature := c.GetHeader("x-paystack-signature")
	secret := os.Getenv("PAYSTACK_SECRET_KEY")
	
	mac := hmac.New(sha512.New, []byte(secret))
	mac.Write(body)
	expectedSignature := hex.EncodeToString(mac.Sum(nil))

	if paystackSignature != expectedSignature {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid signature"})
		return
	}

	// Parse payload
	var payload struct {
		Event string `json:"event"`
		Data  struct {
			Reference string          `json:"reference"`
			Status    string          `json:"status"`
			Metadata  json.RawMessage `json:"metadata"`
		} `json:"data"`
	}

	if err := json.Unmarshal(body, &payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// We only care about charge.success
	if payload.Event == "charge.success" && payload.Data.Status == "success" {
		var metadata struct {
			PackID string `json:"pack_id"`
			UserID string `json:"user_id"`
			Coins  int    `json:"coins"`
			Type   string `json:"type"`
			Access string `json:"access"`
		}
		_ = json.Unmarshal(payload.Data.Metadata, &metadata)
		
		// Process the payment
		if _, err := processSuccessfulPayment(payload.Data.Reference, metadata); err != nil {
			log.Printf("Webhook processing failed for reference %s: %v", payload.Data.Reference, err)
			// Return 200 anyway so Paystack doesn't retry infinitely on a DB constraint or non-existent record
		}
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *PaymentHandler) RequestPayout(c *gin.Context) {
	userID, _ := c.Get("userId")
	uid := userID.(string)

	var req struct {
		BankName      string `json:"bankName"`
		AccountNumber string `json:"accountNumber"`
		AccountName   string `json:"accountName"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Calculate Available Balance
	var totalFiat int64
	database.DB.Model(&models.Referral{}).Where("referrer_id = ? AND status = ?", uid, "converted").Select("COALESCE(SUM(fiat_awarded), 0)").Row().Scan(&totalFiat)

	var withdrawnFiat int64
	database.DB.Model(&models.Withdrawal{}).Where("user_id = ? AND status IN ?", uid, []string{"pending", "approved", "completed"}).Select("COALESCE(SUM(amount_ngn), 0)").Row().Scan(&withdrawnFiat)

	available := int(totalFiat - withdrawnFiat)
	if available <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No available fiat balance to withdraw"})
		return
	}

	// Create withdrawal request
	withdrawal := models.Withdrawal{
		ID:            uuid.New().String(),
		UserID:        uid,
		CoinAmount:    0,
		AmountNgn:     available,
		BankName:      req.BankName,
		AccountNumber: req.AccountNumber,
		AccountName:   req.AccountName,
		Status:        "pending",
	}

	if err := database.DB.Create(&withdrawal).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to request payout"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payout requested successfully", "amount": available})
}

func (h *PaymentHandler) GetPlans(c *gin.Context) {
	var plans []models.SubscriptionPlan
	if err := database.DB.Where("is_active = ?", true).Order("price asc").Find(&plans).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch plans"})
		return
	}
	c.JSON(http.StatusOK, plans)
}

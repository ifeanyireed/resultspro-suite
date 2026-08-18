package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
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
		PackID string `json:"packId" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Pack ID is required"})
		return
	}

	var pack models.CoinPack
	if err := database.DB.Where("id = ?", input.PackID).First(&pack).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Coin pack not found"})
		return
	}

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	finalAmount := calculateFinalTotal(float64(pack.Price))
	amountKobo := finalAmount * 100

	url := "https://api.paystack.co/transaction/initialize"
	
	// Default callback if not provided in env
	callbackURL := os.Getenv("PAYSTACK_CALLBACK_URL")
	if callbackURL == "" {
		callbackURL = "http://localhost:3000/shop/verify"
	}

	body := map[string]interface{}{
		"email":        user.Email,
		"amount":       amountKobo,
		"callback_url": callbackURL,
		"metadata": map[string]interface{}{
			"pack_id": pack.ID,
			"user_id": user.ID,
			"coins":   pack.Coins,
			"type":    pack.Type,
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
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Message})
		return
	}

	// Create pending purchase record
	purchase := models.Purchase{
		ID:               uuid.New().String(),
		UserID:           user.ID,
		PackName:         pack.Name,
		CoinsGranted:     pack.Coins,
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
	}
	// Try to unmarshal metadata, but don't fail hard if it's empty/null
	_ = json.Unmarshal(result.Data.Metadata, &metadata)

	// Find the purchase
	var purchase models.Purchase
	if err := database.DB.Where("payment_reference = ?", reference).First(&purchase).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Purchase record not found"})
		return
	}

	if purchase.Status == "success" {
		c.JSON(http.StatusOK, gin.H{"message": "Payment already processed", "packName": purchase.PackName})
		return
	}

	// Atomically update user balance and purchase status
	err = database.DB.Transaction(func(tx *gorm.DB) error {
		// Update purchase
		if err := tx.Model(&purchase).Update("status", "success").Error; err != nil {
			return err
		}

		// Grant coins if type is COIN
		// Fallback: If metadata is missing, check or default based on pack name
		isPremium := (metadata.Type == "PREMIUM") || (purchase.PackName == "Pro Plan")
		
		if !isPremium {
			if err := tx.Model(&models.User{}).Where("id = ?", purchase.UserID).
				Update("coin_balance", gorm.Expr("coin_balance + ?", purchase.CoinsGranted)).Error; err != nil {
				return err
			}
		} else {
			// Update user premium status
			expiry := time.Now().AddDate(0, 1, 0)
			if err := tx.Model(&models.User{}).Where("id = ?", purchase.UserID).
				Updates(map[string]interface{}{
					"is_premium":       true,
					"premium_expires_at": &expiry,
				}).Error; err != nil {
				return err
			}
		}

		// Record coin transaction
		coinTrans := models.CoinTransaction{
			ID:          uuid.New().String(),
			UserID:      purchase.UserID,
			Amount:      purchase.CoinsGranted,
			Type:        "purchase",
			ReferenceID: &purchase.ID,
		}
		if err := tx.Create(&coinTrans).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to finalize purchase"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Payment successful",
		"packName": purchase.PackName,
		"coins": purchase.CoinsGranted,
	})
}

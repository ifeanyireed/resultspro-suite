package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"exams-resultspro-backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthHandler struct{}

func (h *AuthHandler) RequestOTP(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	otp, err := utils.GenerateOTP()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate OTP"})
		return
	}

	expiresAt := time.Now().Add(10 * time.Minute)
	user.OTPCode = &otp
	user.OTPExpiresAt = &expiresAt

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user OTP"})
		return
	}

	// Send Email
	emailBody := fmt.Sprintf(`
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #00C853;">Security Verification</h2>
          <p>Hello %s,</p>
          <p>Your 2FA verification code for <strong>ResultPRO Exam Guide</strong> is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #00C853; border-radius: 10px;">
            %s
          </div>
          <p>This code will expire in 10 minutes. If you did not request this, please secure your account immediately.</p>
          <hr style="border: none; border-top: 1 solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">ResultPRO Exam Guide Admin Control Center</p>
        </div>
        `, *user.Name, otp)

	err = utils.SendEmail(user.Email, "Your 2FA Verification Code - ResultPRO Exam Guide", emailBody)
	if err != nil {
		log.Printf("Email send error: %v", err)
		// We proceed as OTP is saved in DB, but client will get error in real app.
		// For now let's just log it.
	}

	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

func (h *AuthHandler) VerifyOTP(c *gin.Context) {
	var input struct {
		Email string `json:"email" binding:"required"`
		OTP   string `json:"otp" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No active OTP request found"})
		return
	}

	if user.OTPCode == nil || *user.OTPCode != input.OTP || user.OTPExpiresAt == nil || time.Now().After(*user.OTPExpiresAt) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired verification code"})
		return
	}

	// Clear OTP after success
	user.OTPCode = nil
	user.OTPExpiresAt = nil
	database.DB.Save(&user)

	token, err := generateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user, "token": token})
}

func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var input struct {
		Email string `json:"email" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		// As in Node.js version, don't reveal if user doesn't exist.
		c.JSON(http.StatusOK, gin.H{"message": "If an account exists with this email, a reset link has been sent."})
		return
	}

	otp, _ := utils.GenerateOTP()
	expiresAt := time.Now().Add(30 * time.Minute)
	user.OTPCode = &otp
	user.OTPExpiresAt = &expiresAt
	database.DB.Save(&user)

	emailBody := fmt.Sprintf(`
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your ResultPRO Exam Guide account.</p>
          <p>Use the following code to reset your password:</p>
          <h1 style="color: #00C853;">%s</h1>
          <p>This code is valid for 30 minutes.</p>
        </div>
        `, otp)

	utils.SendEmail(user.Email, "Reset Your Password - ResultPRO Exam Guide", emailBody)

	c.JSON(http.StatusOK, gin.H{"message": "Reset code sent"})
}

func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var input struct {
		Email       string `json:"email" binding:"required"`
		Code        string `json:"code" binding:"required"`
		NewPassword string `json:"newPassword" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired reset code"})
		return
	}

	if user.OTPCode == nil || *user.OTPCode != input.Code || user.OTPExpiresAt == nil || time.Now().After(*user.OTPExpiresAt) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired reset code"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.NewPassword), 10)
	user.Password = string(hashedPassword)
	user.OTPCode = nil
	user.OTPExpiresAt = nil
	database.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}

func (h *AuthHandler) Signup(c *gin.Context) {
	var input struct {
		Email        string `json:"email" binding:"required"`
		Password     string `json:"password" binding:"required"`
		Name         string `json:"name"`
		Phone        string `json:"phone"`
		ReferralCode string `json:"referralCode"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existingUser models.User
	if err := database.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// For MVP, we use simplified signup without complex referral/notification logic
	user := models.User{
		ID:           uuid.New().String(),
		Email:        input.Email,
		Password:     string(hashedPassword),
		Name:         &input.Name,
		Phone:        &input.Phone,
		CoinBalance:  50,
		Role:         models.RoleStudent,
		ReferralCode: "REF-" + uuid.New().String()[:5],
	}

	err = database.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Check for referral
		if input.ReferralCode != "" {
			var referrer models.User
			if err := tx.Where("referral_code = ?", input.ReferralCode).First(&referrer).Error; err == nil {
				// Valid referral found! Grant 25 coins to referrer
				if err := tx.Model(&referrer).Update("coin_balance", gorm.Expr("coin_balance + ?", 25)).Error; err != nil {
					return err
				}
				// Record for referrer
				tx.Create(&models.CoinTransaction{
					ID:          uuid.New().String(),
					UserID:      referrer.ID,
					Amount:      25,
					Type:        "REFERRAL_BONUS",
					Description: utils.StringPtr("Bonus for referring " + input.Email),
				})
				// Notify referrer
				utils.SendNotification(referrer.ID, "Referral Bonus!", "You earned 25 coins for referring a new student.", models.NotificationTypeReward, models.NotificationRouteBoth)

				// Log for referee (the new user)
				user.ReferredBy = &referrer.ID
			}
		}

		// 2. Create the new user
		if err := tx.Create(&user).Error; err != nil {
			return err
		}

		// 3. Record Welcome Bonus transaction
		return tx.Create(&models.CoinTransaction{
			ID:          uuid.New().String(),
			UserID:      user.ID,
			Amount:      50,
			Type:        "WELCOME_BONUS",
			Description: utils.StringPtr("Initial signup coins"),
		}).Error
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create account: " + err.Error()})
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"user": user, "token": token})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user, "token": token})
}

func generateToken(userID string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "super-secret-key-123"
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": userID,
		"exp":    time.Now().Add(time.Hour * 24 * 7).Unix(),
	})

	return token.SignedString([]byte(secret))
}

func (h *AuthHandler) GoogleLogin(c *gin.Context) {
	var input struct {
		IDToken string `json:"idToken" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		log.Printf("[GoogleLogin] JSON bind error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Call Google's userinfo endpoint with the access token
	req, _ := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v3/userinfo", nil)
	req.Header.Set("Authorization", "Bearer "+input.IDToken)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[GoogleLogin] Request to Google failed: %v", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to verify with Google"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("[GoogleLogin] Google returned non-OK status: %d", resp.StatusCode)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Google token or expired session"})
		return
	}

	var googleUser struct {
		Email         string `json:"email"`
		Name          string `json:"name"`
		Picture       string `json:"picture"`
		EmailVerified bool   `json:"email_verified"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		log.Printf("[GoogleLogin] Decode error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse Google response"})
		return
	}

	if googleUser.Email == "" {
		log.Printf("[GoogleLogin] Google response missing email: %+v", googleUser)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email not shared by Google"})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", googleUser.Email).First(&user).Error; err != nil {
		log.Printf("[GoogleLogin] Creating new user for: %s", googleUser.Email)
		
		// Create new user
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(uuid.New().String()), 10)
		
		name := googleUser.Name
		referralPart := googleUser.Email
		if len(referralPart) > 4 {
			referralPart = referralPart[:4]
		}
		
		user = models.User{
			ID:           uuid.New().String(),
			Email:        googleUser.Email,
			Password:     string(hashedPassword),
			Name:         &name,
			CoinBalance:  50,
			Role:         models.RoleStudent,
			ReferralCode: "REF-" + referralPart,
		}
		if err := database.DB.Create(&user).Error; err != nil {
			log.Printf("[GoogleLogin] DB user creation failed: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create account"})
			return
		}
	} else {
		log.Printf("[GoogleLogin] Found existing user: %s (ID: %s)", user.Email, user.ID)
	}

	// Generate our JWT
	token, err := generateToken(user.ID)
	if err != nil {
		log.Printf("[GoogleLogin] JWT generation failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user, "token": token})
}

package services

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const PaystackBaseURL = "https://api.paystack.co"

type PaystackClient struct {
	SecretKey  string
	HTTPClient *http.Client
}

func NewPaystackClient(secretKey string) *PaystackClient {
	return &PaystackClient{
		SecretKey: secretKey,
		HTTPClient: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

func (c *PaystackClient) doRequest(method, endpoint string, payload interface{}) (map[string]interface{}, error) {
	var bodyReader io.Reader
	if payload != nil {
		jsonBytes, err := json.Marshal(payload)
		if err != nil {
			return nil, err
		}
		bodyReader = bytes.NewBuffer(jsonBytes)
	}

	req, err := http.NewRequest(method, PaystackBaseURL+endpoint, bodyReader)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+c.SecretKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Cache-Control", "no-cache")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	// Paystack usually returns { "status": true/false, "message": "...", "data": ... }
	status, ok := result["status"].(bool)
	if !ok || !status {
		msg := "Unknown error from Paystack"
		if message, ok := result["message"].(string); ok {
			msg = message
		}
		return nil, fmt.Errorf("paystack API error: %s", msg)
	}

	return result, nil
}

// CreateSubaccount creates a subaccount for a tenant for payment splits
func (c *PaystackClient) CreateSubaccount(businessName, bankCode, accountNumber string, percentageCharge float64) (string, error) {
	payload := map[string]interface{}{
		"business_name":     businessName,
		"settlement_bank":   bankCode,
		"account_number":    accountNumber,
		"percentage_charge": percentageCharge,
	}

	result, err := c.doRequest("POST", "/subaccount", payload)
	if err != nil {
		return "", err
	}

	data, ok := result["data"].(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("invalid response format")
	}

	subaccountCode, ok := data["subaccount_code"].(string)
	if !ok {
		return "", fmt.Errorf("subaccount_code not found in response")
	}

	return subaccountCode, nil
}

// CreateCustomer creates a customer record for DVA generation
func (c *PaystackClient) CreateCustomer(email, firstName, lastName, phone string) (string, error) {
	payload := map[string]interface{}{
		"email":      email,
		"first_name": firstName,
		"last_name":  lastName,
		"phone":      phone,
	}

	result, err := c.doRequest("POST", "/customer", payload)
	if err != nil {
		return "", err
	}

	data, ok := result["data"].(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("invalid response format")
	}

	customerCode, ok := data["customer_code"].(string)
	if !ok {
		return "", fmt.Errorf("customer_code not found in response")
	}

	return customerCode, nil
}

// DVAResponse holds Dedicated Virtual Account info
type DVAResponse struct {
	AccountNumber string
	BankName      string
	AccountName   string
}

// CreateDedicatedVirtualAccount provisions a bank account for a customer
func (c *PaystackClient) CreateDedicatedVirtualAccount(customerCode, subaccountCode, preferredBank string) (*DVAResponse, error) {
	if preferredBank == "" {
		preferredBank = "titan-paystack"
	}

	payload := map[string]interface{}{
		"customer":       customerCode,
		"preferred_bank": preferredBank,
	}
	
	if subaccountCode != "" {
		payload["subaccount"] = subaccountCode
	}

	result, err := c.doRequest("POST", "/dedicated_account", payload)
	if err != nil {
		return nil, err
	}

	data, ok := result["data"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid response format")
	}

	accountName, _ := data["account_name"].(string)
	accountNumber, _ := data["account_number"].(string)
	
	bankName := ""
	if bankInfo, ok := data["bank"].(map[string]interface{}); ok {
		bankName, _ = bankInfo["name"].(string)
	}

	return &DVAResponse{
		AccountNumber: accountNumber,
		BankName:      bankName,
		AccountName:   accountName,
	}, nil
}

// VerifyTransaction verifies a transaction by reference
func (c *PaystackClient) VerifyTransaction(reference string) (map[string]interface{}, error) {
	result, err := c.doRequest("GET", "/transaction/verify/"+reference, nil)
	if err != nil {
		return nil, err
	}

	data, ok := result["data"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid response format")
	}

	return data, nil
}

// VerifyWebhookSignature verifies the payload signature from Paystack
func (c *PaystackClient) VerifyWebhookSignature(payload []byte, signature string) bool {
	// Webhook signature verification implementation
	// Usually HMAC SHA512 using the secret key
	mac := hmac.New(sha512.New, []byte(c.SecretKey))
	mac.Write(payload)
	expectedMAC := hex.EncodeToString(mac.Sum(nil))
	
	return hmac.Equal([]byte(expectedMAC), []byte(signature))
}

package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"
)

var puzzleEmbedSecretKey = []byte("PUZZLEPRO_EMBED_TOKEN_HMAC_SECRET_2026")

type PuzzleEmbedTokenPayload struct {
	OrgID      string `json:"org_id"`
	Expiration int64  `json:"exp"`
}

func GenerateSignedEmbedToken(orgID string, duration time.Duration) (string, error) {
	if duration <= 0 {
		duration = 365 * 24 * time.Hour
	}
	exp := time.Now().Add(duration).Unix()

	payload := PuzzleEmbedTokenPayload{
		OrgID:      orgID,
		Expiration: exp,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	payloadB64 := base64.RawURLEncoding.EncodeToString(payloadBytes)

	h := hmac.New(sha256.New, puzzleEmbedSecretKey)
	h.Write([]byte(payloadB64))
	sig := base64.RawURLEncoding.EncodeToString(h.Sum(nil))

	return fmt.Sprintf("EMB.%s.%s", payloadB64, sig), nil
}

func VerifySignedEmbedToken(tokenStr string) (*PuzzleEmbedTokenPayload, error) {
	tokenStr = strings.TrimSpace(tokenStr)
	parts := strings.Split(tokenStr, ".")
	if len(parts) != 3 || parts[0] != "EMB" {
		return nil, errors.New("invalid token format: must be a signed EMB token")
	}

	payloadB64 := parts[1]
	sig := parts[2]

	h := hmac.New(sha256.New, puzzleEmbedSecretKey)
	h.Write([]byte(payloadB64))
	expectedSig := base64.RawURLEncoding.EncodeToString(h.Sum(nil))

	if !hmac.Equal([]byte(sig), []byte(expectedSig)) {
		return nil, errors.New("invalid embed token signature")
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(payloadB64)
	if err != nil {
		return nil, errors.New("invalid token payload encoding")
	}

	var payload PuzzleEmbedTokenPayload
	if err := json.Unmarshal(payloadBytes, &payload); err != nil {
		return nil, errors.New("invalid token payload structure")
	}

	if payload.Expiration > 0 && time.Now().Unix() > payload.Expiration {
		return nil, errors.New("embed token has expired")
	}

	return &payload, nil
}

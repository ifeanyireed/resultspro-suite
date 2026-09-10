curl -X POST "http://localhost:7001/api/v1/auth/signup" \
-H "Content-Type: application/json" \
-d '{
  "email": "testref1@example.com",
  "password": "Password123!",
  "full_name": "Test Ref User",
  "referral_code": "REF-3A444F"
}'

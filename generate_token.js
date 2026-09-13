const jwt = require('jsonwebtoken');

const payload = {
  sub: "test-user-id",
  userId: "test-user-id",
  has_ican: false,
  coin_balance: 100
};

const secret = "super-secret-key-123";
const token = jwt.sign(payload, secret);
console.log(token);

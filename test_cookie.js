const tough = require('tough-cookie');
const cookie = new tough.Cookie({
  key: 'token',
  value: '123',
  domain: 'localhost'
});
console.log(cookie.validate());

const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:3001/api/exams', {
      headers: {
        'Origin': 'http://localhost:3000',
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json, text/plain, */*'
      }
    });
    console.log('Success:', typeof res.data, res.data.length);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
test();

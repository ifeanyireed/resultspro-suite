const axios = require('axios');
axios.get('http://localhost:8080/api/exams/2/subjects/2').then(res => console.log(res.data)).catch(err => console.log(err.message));

const axios = require('axios');

(async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'newpassword123'
    }, { maxRedirects: 0 });
    console.log('OK', res.status, res.data);
  } catch (e) {
    console.error('ERR', e.message);
    if (e.response) console.error('RESP', e.response.status, e.response.data);
    if (e.request) console.error('REQUEST MADE');
  }
})();

const https = require('https');

exports.handler = async function(event, context) {
  const API_USER = 'h9ki8rg6';
  const API_PASS = 'f2rpbfw0x3p13nflmdfmrif4fe3f0r3oo23lgxrgtm';
  const auth     = Buffer.from(API_USER + ':' + API_PASS).toString('base64');

  try {
    const data = await fetchJSON('agendapro.com', '/api/public/v1/locations', auth);
    
    const list = Array.isArray(data) ? data
               : (data.locations || data.data || data.results || []);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        branches: list,
        total: list.length,
        raw_full: data
      })
    };
  } catch(e) {
    return {
      statusCode: 502,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};

function fetchJSON(host, path, auth) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: host, path, method: 'GET',
        headers: { 'Authorization': 'Basic ' + auth, 'Accept': 'application/json' } },
      res => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
          if (res.statusCode >= 400) reject(new Error('HTTP ' + res.statusCode));
          else { try { resolve(JSON.parse(body)); } catch(e) { reject(new Error('JSON inválido')); } }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

const https = require('https');

exports.handler = async function(event, context) {
  const API_USER = 'h9ki8rg6';
  const API_PASS = 'f2rpbfw0x3p13nflmdfmrif4fe3f0r3oo23lgxrgtm';
  const auth     = Buffer.from(API_USER + ':' + API_PASS).toString('base64');

  const endpoints = [
    '/api/public/v1/locations',
    '/api/public/v1/service_providers',
  ];

  for (const path of endpoints) {
    try {
      let all = [];
      let page = 1;

      while (true) {
        const data = await fetchJSON('agendapro.com', path + '?page=' + page + '&per_page=50', auth);
        const list = Array.isArray(data) ? data
                   : (data.locations || data.service_providers || data.data || data.results || []);
        if (!list || list.length === 0) break;
        all = all.concat(list);
        if (list.length < 50) break;
        if (++page > 10) break;
      }

      if (all.length > 0) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ branches: all, raw_sample: all[0] })
        };
      }
    } catch(e) { /* siguiente */ }
  }

  return {
    statusCode: 502,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: 'Sin resultados' })
  };
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

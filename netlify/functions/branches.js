const https = require('https');

const SUCURSALES = [
  { nombre: 'La Dehesa',   user: '7kqmjjngo',   pass: '41m7ggdejb0813u1g03w6itz27dr278jxzuu1tirk61umd9' },
  { nombre: 'Las Condes',  user: 'h9ki8rg6',     pass: 'f2rpbfw0x3p13nflmdfmrif4fe3f0r3oo23lgxrgtm' },
  { nombre: 'El Golf',     user: '3er0brdmo',    pass: 'gjdyvlew2iljhrsqg3z3x5afk1rpxu3gdxx1ws6wkh' },
  { nombre: 'San Miguel',  user: '2ddclkg60',    pass: 'z4r41vrksjrsj53ueinu8i8ygcw4qmoz8ydwbrn700mizksx' },
  { nombre: 'Antofagasta', user: '73dr15iec',    pass: '1vmwlx5jfl8pmfbu24i1aqne4sm1lbpc3i0ej13lbc998ov44k' },
];

exports.handler = async function(event, context) {
  const results = await Promise.allSettled(
    SUCURSALES.map(async s => {
      const auth = Buffer.from(s.user + ':' + s.pass).toString('base64');
      const data = await fetchJSON('agendapro.com', '/api/public/v1/locations', auth);
      const list = Array.isArray(data) ? data : (data.locations || data.data || []);
      const loc  = list[0] || {};
      return {
        nombre:   s.nombre,
        address:  loc.address || '',
        second_address: loc.second_address || '',
        district: loc.district || '',
        city:     loc.city || '',
        phone:    loc.phone || '',
        booking_url: 'https://sculptbody.agendapro.com/cl'
      };
    })
  );

  const branches = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ branches })
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
          else { try { resolve(JSON.parse(body)); } catch(e) { reject(new Error('JSON')); } }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

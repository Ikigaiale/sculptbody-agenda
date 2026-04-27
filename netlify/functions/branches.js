exports.handler = async function() {
  const branches = [
    {
      nombre: 'La Dehesa',
      address: 'La Dehesa', city: 'Santiago',
      phone: '',
      booking_url: 'https://sculptbodyladehesa.site.agendapro.com/cl/sucursal/392853'
    },
    {
      nombre: 'Las Condes',
      address: 'Avenida las Condes 9460', city: 'Santiago',
      phone: '+56 941 444 094',
      booking_url: 'https://sculptbody.site.agendapro.com/cl/sucursal/25115'
    },
    {
      nombre: 'El Golf',
      address: 'El Golf', city: 'Santiago',
      phone: '',
      booking_url: 'https://sculptbodyelgolf.site.agendapro.com/cl/sucursal/170206'
    },
    {
      nombre: 'San Miguel',
      address: 'San Miguel', city: 'Santiago',
      phone: '',
      booking_url: 'https://sculptbodysanmiguel.site.agendapro.com/cl/sucursal/115068'
    },
    {
      nombre: 'Antofagasta',
      address: 'Antofagasta', city: 'Antofagasta',
      phone: '',
      booking_url: 'https://sculptbodyantofagasta.site.agendapro.com/cl/sucursal/361946'
    },
  ];

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ branches })
  };
};

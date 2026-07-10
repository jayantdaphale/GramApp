const { env } = require('process');

const target = env.GRAMAPP_API_URL || 'http://localhost:5099';

console.log(`Proxying /api requests to ${target}`);

const PROXY_CONFIG = [
  {
    context: [
      '/api',
      '/weatherforecast',
    ],
    target,
    secure: false,
    changeOrigin: true
  }
];

module.exports = PROXY_CONFIG;

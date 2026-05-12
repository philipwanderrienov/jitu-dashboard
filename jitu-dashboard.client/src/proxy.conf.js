const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : (env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://127.0.0.1:5000');

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/Payment",
      "/PaymentHistory"
    ],
    target,
    secure: false
  }
]

module.exports = PROXY_CONFIG;

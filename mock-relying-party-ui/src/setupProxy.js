const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/fetchUserInfo',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      followRedirects: true // This will likely fix the redirect issue
    })
  );
};
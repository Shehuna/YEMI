// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://localhost:7204',
      target: 'https://www.yamiconapi.somee.com',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '' 
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy failed' });
      }
    })
  );
};

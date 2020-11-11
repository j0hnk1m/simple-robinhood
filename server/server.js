// PROXY SERVER

const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 5000;
const HOST = 'localhost';
const SIMDAQ_API = 'http://localhost:8000'

app.use(morgan('dev'));

app.use('/api', createProxyMiddleware({
  target: SIMDAQ_API,
  changeOrigin: true,
}));

app.listen(port, () => console.log(`Listening on port ${port}`));
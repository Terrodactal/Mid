const express = require('express');
const app = express()

//USE PROXY SERVER TO REDIRECT THE INCOMMING REQUEST
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer();

const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRETE = process.env.JWT_SECRETE;

function authToken(req, res, next) {
    const header = req?.headers.authorization;
    const token = header && header.split(' ')[1];

    if (token == null) return res.status(401).json("Please send token");

    jwt.verify(token, JWT_SECRETE, (err, user) => {
        if (err) return res.status(403).json("Invalid token", err);
        req.user = user;
        next()
    })
}

// Role-based auth middleware accepting an array of allowed roles
function authRole(roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json("Unauthorized");
        }
        next();
    }
}

// TARGET URLS FOR MICROSERVICES (Using env vars with fallbacks)
const REGISTRATION_URL = process.env.REGISTRATION_URL || 'http://localhost:5001';
const LOGIN_URL = process.env.LOGIN_URL || 'http://localhost:5002';
const ORDER_URL = process.env.ORDER_URL || 'http://localhost:5005';
const TRACKING_URL = process.env.TRACKING_URL || 'http://localhost:5004';
const PRODUCT_URL = process.env.PRODUCT_URL || 'http://localhost:5003';
const INBOUND_URL = process.env.INBOUND_URL || 'http://localhost:5006';

// 2. Registration Service
app.post('/register', (req, res) => proxy.web(req, res, { target: REGISTRATION_URL }));

// 3. Login Service
app.post('/login', (req, res) => proxy.web(req, res, { target: LOGIN_URL }));
app.post('/logout', (req, res) => proxy.web(req, res, { target: LOGIN_URL }));

// 4. Product Catalog Service
app.post('/products', authToken, authRole(['Manager']), (req, res) => proxy.web(req, res, { target: PRODUCT_URL }));
app.get('/products/:id', authToken, authRole(['Manager', 'Worker']), (req, res) => proxy.web(req, res, { target: PRODUCT_URL }));
app.put('/products/:id', authToken, authRole(['Manager']), (req, res) => proxy.web(req, res, { target: PRODUCT_URL }));

// 5. Inventory Tracking Service
app.get('/inventory/:sku', authToken, authRole(['Manager', 'Worker']), (req, res) => proxy.web(req, res, { target: TRACKING_URL }));
app.put('/inventory/:sku/adjust', authToken, authRole(['Worker']), (req, res) => proxy.web(req, res, { target: TRACKING_URL }));

// 6. Order Fulfillment Service
app.post('/orders', authToken, authRole(['Manager']), (req, res) => proxy.web(req, res, { target: ORDER_URL }));
app.get('/orders/pending', authToken, authRole(['Worker']), (req, res) => proxy.web(req, res, { target: ORDER_URL }));
app.put('/orders/:id/status', authToken, authRole(['Worker']), (req, res) => proxy.web(req, res, { target: ORDER_URL }));

// 7. Inbound Receiving Service
app.post('/shipments', authToken, authRole(['Manager']), (req, res) => proxy.web(req, res, { target: INBOUND_URL }));
app.put('/shipments/:id/verify', authToken, authRole(['Worker']), (req, res) => proxy.web(req, res, { target: INBOUND_URL }));

// Error handling for proxy
proxy.on('error', function (err, req, res) {
  console.error("Proxy Error:", err.message);
  res.status(500).send('Proxy Error');
});

app.listen(4000, () => {
    console.log("API Gateway Service is running on PORT NO : 4000")
})
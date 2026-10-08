# Postman Test Payloads

Here are the raw JSON payloads you can use in Postman for all 7 microservices. 

> [!IMPORTANT]
> - Make sure you are sending requests to **`http://localhost:8080`** (or your EC2 IP) which is your Load Balancer port.
> - Ensure you set the `Content-Type` header to `application/json` in Postman for all `POST` and `PUT` requests.
> - For endpoints that require authorization, add an `Authorization` header with the value `Bearer <YOUR_JWT_TOKEN>` (which you get from the `/login` API).

---

## 1. Registration (`POST /register`)
**No Auth Required**
```json
{
  "name": "Admin Joe",
  "email": "joe@gmail.com",
  "password": "secretpassword",
  "mobile": 12345678,
  "role": "Manager"
}
```

## 2. Login (`POST /login`)
**No Auth Required**
```json
{
  "emailid": "joe@gmail.com",
  "password": "secretpassword",
  "role": "Manager"
}
```
*(Copy the `token` from the response and use it for the APIs below)*

## 3. Product Catalog

### Create Product (`POST /products`)
**Requires 'Manager' Token**
```json
{
  "sku": "SKU-1001",
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "price": 29.99,
  "category": "Electronics"
}
```
*(Note the `_id` returned in the response for the PUT/GET calls below)*

### Get Product (`GET /products/<PRODUCT_ID>`)
**Requires 'Manager' or 'Worker' Token**
- **URL Example**: `http://localhost:8080/products/653f8a9b2c1d3e4f5a6b7c8d` (replace `<PRODUCT_ID>` with the actual `_id` from the creation step)
- **Body**: None

### Update Product (`PUT /products/<PRODUCT_ID>`)
**Requires 'Manager' Token**
```json
{
  "price": 35.99,
  "description": "Updated ergonomic wireless mouse (v2)"
}
```

## 4. Inventory Tracking

### Adjust Stock (`PUT /inventory/SKU-1001/adjust`)
**Requires 'Worker' Token**
```json
{
  "quantity": 150
}
```
*(You will need to create a Worker account via `/register` and `/login` to use this API)*

### View Stock (`GET /inventory/SKU-1001`)
**Requires 'Manager' or 'Worker' Token**
- **Body**: None

## 5. Order Fulfillment (`POST /orders`)
**Requires 'Manager' Token**
```json
{
  "customerName": "Alice Walker",
  "itemSku": "SKU-1001",
  "quantity": 10
}
```
*(Assuming your `Order_microservice` expects these fields. Adjust based on your schema)*

## 6. Inbound Receiving (`POST /shipments`)
**Requires 'Manager' Token**
```json
{
  "supplierName": "TechCorp",
  "itemSku": "SKU-1001",
  "quantity": 500
}
```

## 7. User Profile Tracking

### View Profile (`GET /viewprofile`)
**Requires Any Valid Token**
- **Body** (raw JSON):
```json
{
  "emailid": "joe@gmail.com"
}
```

### Update Profile (`PUT /updateprofile`)
**Requires Any Valid Token**
```json
{
  "emailid": "joe@gmail.com",
  "name": "Admin Joe Updated",
  "mobile": 87654321
}
```

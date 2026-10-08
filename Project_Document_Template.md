# Title of the Project
**Microservices based Logistics & Inventory Management System**

## 1. Architecture
| Microservice Name | Internal Port | Exposed URL (via Load Balancer) | API Names / Routes |
|-------------------|---------------|---------------------------------|--------------------|
| **API Gateway**   | 4000 (Internal) | `http://<EC2-IP>/...` | Routes all traffic & Auth |
| **Registration**  | 5001 | `http://<EC2-IP>/register` | `POST /register` |
| **Login**         | 5002 | `http://<EC2-IP>/login` | `POST /login` |
| **Catalog**       | 5003 | `http://<EC2-IP>/products` | `POST /products`<br>`GET /products/:id`<br>`PUT /products/:id` |
| **Inventory**     | 5004 | `http://<EC2-IP>/inventory/:sku` | `GET /inventory/:sku`<br>`PUT /inventory/:sku/adjust` |
| **Order**         | 5005 | `http://<EC2-IP>/orders` | `POST /orders`<br>`GET /orders/pending`<br>`PUT /orders/:id/status` |
| **Inbound**       | 5006 | `http://<EC2-IP>/shipments` | `POST /shipments`<br>`PUT /shipments/:id/verify` |
| **User Profile**  | 5007 | `http://<EC2-IP>/viewprofile` | `GET /viewprofile`<br>`PUT /updateprofile` |

*Note: Nginx Load Balancer is exposed on Port 80. All traffic enters via Port 80 and is balanced across API Gateway instances.*

---

## 2. Screenshots

### A. Collection Name and Schema Code
*(Insert screenshots of your code showing the Mongoose Schemas (e.g. `person_schema.js`, `catalog_schema.js`) and your MongoDB Atlas dashboard showing the collections created)*

### B. All API Calls using Postman (EC2 Public IP) + MongoDB Database
*(Insert screenshots of successful Postman requests for every API listed in the architecture table above. Make sure the URL in Postman uses your EC2 Public IP. Also include screenshots of MongoDB showing the data inserted/updated)*

### C. Load Balancer Configuration
*(Insert a screenshot of the `Nginx_LoadBalancer/nginx.conf` and `docker-compose.yml` where Nginx and replicas are configured. You can also show `docker ps` indicating multiple instances running)*

### D. Testing Authentication & Authorization (Negative Scenarios)
- **Wrong UID or Password**: *(Screenshot of Postman attempting login with bad credentials returning 400 Bad Request)*
- **Invalid Token**: *(Screenshot of an API Gateway protected route (e.g., `/products`) with a fake or missing Bearer token returning 401/403)*
- **Unauthorized (Role Based)**: *(Screenshot of a "Worker" attempting to access a "Manager"-only route (e.g., `POST /products`) returning 403 Unauthorized)*

---

## 3. Source
**GitHub Link**: *(Paste your repository link here)*

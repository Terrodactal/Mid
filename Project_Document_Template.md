# Title of the Project
**Microservices based Logistics & Inventory Management System**

## 1. Architecture
| Microservice Name | Internal Port | Exposed URL (via Load Balancer) | API Names / Routes |
|-------------------|---------------|---------------------------------|--------------------|
| **API Gateway**   | 4000-4002 | `http://<EC2-IP>:4000/...` | Routes all traffic & Auth |
| **Registration**  | 5001 | `http://<EC2-IP>:8080/register` | `POST /register` |
| **Login**         | 5002 | `http://<EC2-IP>:8080/login` | `POST /login` |
| **Catalog**       | 5003 | `http://<EC2-IP>:8080/products` | `POST /products`<br>`GET /products/:id`<br>`PUT /products/:id` |
| **Inventory**     | 5004 | `http://<EC2-IP>:8080/inventory/:sku` | `GET /inventory/:sku`<br>`PUT /inventory/:sku/adjust` |
| **Order**         | 5005 | `http://<EC2-IP>:8080/orders` | `POST /orders`<br>`GET /orders/pending`<br>`PUT /orders/:id/status` |
| **Inbound**       | 5006 | `http://<EC2-IP>:8080/shipments` | `POST /shipments`<br>`PUT /shipments/:id/verify` |

*Note: Nginx Load Balancer is exposed on Port 8080. All traffic enters via Port 8080 and is balanced across API Gateway instances (which run on Ports 4000-4002).*

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

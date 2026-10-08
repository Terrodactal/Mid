# Microservices Project

## Changes Made
1. **API Gateway Syntax Errors**: Fixed missing `||` operators in fallback logic and `authRole` middleware.
2. **Model Typo**: Renamed `Memebers` typo to `Members` in Login Service.
3. **API Routing**: Updated `Registration` to listen on `/register` rather than `/reg` to match the API Gateway.
4. **Port Alignments**: Fixed port conflicts. The `Tracking_microservice` (which handles user profiles) was sharing port 5004 with `Inventory_microservice`. Moved User Tracking to 5007 and registered it in API Gateway. Matched `PRODUCT_URL` to 5003 and `ORDER_URL` to 5005.
5. **NPM Start Scripts**: Added missing `"start": "node index.js"` (and similar) to all `package.json` files.
6. **Docker Environment**: Generated missing `Dockerfile` configurations and expanded `docker-compose.yml` so that all 8 microservices start gracefully.

## How to Run Locally

### Using Docker Compose (Recommended)
Make sure you have Docker Desktop installed, then run:
```bash
docker-compose up --build
```
This will start all microservices (API Gateway on port 4000) and link them seamlessly.

### Using Node directly
If you prefer running them without Docker, install dependencies and start them:
```bash
cd <Microservice_Directory>
npm install
npm start
```
*Note*: Ensure that all services are provided the `.env` variables (e.g. `MONGO_URI` and `JWT_SECRETE`).

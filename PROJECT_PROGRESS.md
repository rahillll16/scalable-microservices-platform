# Microservices Platform Progress

## Every feature follow
- Build
-   ↓
- Test
-    ↓
- Verify
-    ↓
- Commit
-    ↓
- Next Feature

## Day 1

✅ Environment Setup Complete

✅ Git Initialized

✅ Project Structure Created

Next:
- User Service Setup
- Product Service Setup
- API Gateway Setup

✅ User Service Running

✅ Product Service Running

✅ API Gateway Running

✅ Request Routing Through Gateway Working

# Microservices Platform Progress

# Day 1 Completed

### Services Created

* User Service (Port 3001)
* Product Service (Port 3002)
* API Gateway (Port 3000)

### Features Completed

* Express setup
* Nodemon setup
* Health endpoints
* Gateway setup
* Proxy middleware setup
* Request routing through gateway

### Tested

* GET /health on Gateway
* GET /health on User Service
* GET /health on Product Service
* GET /users/health through Gateway
* GET /products/health through Gateway

### Current Architecture

Client
→ API Gateway (3000)
→ User Service (3001)
→ Product Service (3002)

### Next Day Goals

* MongoDB setup
* User model
* Register API
* Login API
* Password hashing
* API testing with Postman


# Day 2 Complete

## Features Implemented

### User Service
- MongoDB Integration
- User Model using Mongoose
- User Registration API
- Password Hashing using bcrypt
- Login API
- JWT Token Generation
- Authentication Middleware
- Protected Profile Route

---

## Testing Completed

### Registration
- Successful Registration
- Duplicate Email Validation
- Missing Fields Validation

### Login
- Successful Login
- Invalid Credentials
- User Not Found

### Authentication
- JWT Token Generation
- JWT Verification
- Protected Route Access
- No Token Validation
- Invalid Token Validation

---

## Challenges Faced & Solutions


### 1. Incorrect Bearer Token Format

**Problem:**
Protected route always returned:

```text
Invalid token
```

**Cause:**
Token was sent as:

```text
Bearer BEARER <token>
```

instead of:

```text
Bearer <token>
```

**Solution:**
Configured Postman Authorization tab correctly using Bearer Token authentication.

---



### 2. Middleware Chain Debugging

**Problem:**
JWT verification succeeded but the request was not reaching the profile controller.

**Cause:**
Authentication middleware initially had implementation issues while forwarding requests.

**Solution:**
Added logging at each stage of the request lifecycle:

```javascript
console.log("AUTH HEADER");
console.log("DECODED");
console.log("BEFORE NEXT");
```

Used step-by-step debugging to verify request flow through middleware and controller.

---

## Key Learnings

- JWT Authentication Flow
- Password Security using bcrypt
- Middleware Execution Flow
- Request Lifecycle in Express
- MongoDB + Mongoose Integration
- API Testing using Postman
- Backend Debugging Techniques
- Environment Variable Management

---

## Current Status

```text
User Service: Complete ✅
Gateway Integration: Pending
Product Service: Pending
Redis Integration: Pending
Dockerization: Pending
Frontend: Pending
```


# Day 3 Progress

## Product Service

### Features Implemented

* MongoDB Integration
* Product Schema
* Create Product API
* Get All Products API
* Get Product By ID API
* Update Product API
* Delete Product API

### Edge Cases Handled

* Missing Fields Validation
* Price = 0 Handling
* Negative Price Validation
* Empty Product Collection Handling
* Invalid MongoDB ObjectId Handling
* Product Not Found Handling
* Delete Non-Existent Product Handling

### Key Learnings

* MongoDB automatically creates an `_id` field for each document.
* `findById()` internally queries the `_id` field.
* Difference between HTTP 400 (Bad Request) and HTTP 404 (Not Found).
* Returning an empty array with HTTP 200 is preferred over returning 404 for empty collections.
* Validating ObjectIds(size expected is 24) before database queries prevents Mongoose cast errors.
* Using `findByIdAndUpdate()` with `{ new: true }` returns the updated document.



# Day 4 Complete

## Order Service

### Features Implemented

* MongoDB Integration
* Order Schema
* Create Order API
* Get All Orders API
* Get Order By ID API
* Get Orders By User ID API

---

## Service-to-Service Communication

Implemented communication between microservices using Axios.

### Order Service Validation Flow

Before creating an order:

* Verify User exists via User Service
* Verify Product exists via Product Service

Flow:

Order Service
→ User Service Verification
→ Product Service Verification
→ Create Order

---

## API Gateway Integration

Added Order Service routing through API Gateway.

### Gateway Routes

* /users → User Service
* /products → Product Service
* /orders → Order Service

Implemented path rewriting to map gateway routes to internal service routes.

---

## Testing Completed

### Create Order

* Successful Order Creation
* Missing Fields Validation
* Quantity Validation
* Invalid User Validation
* Invalid Product Validation

### Get Orders

* Get All Orders
* Get Order By ID
* Get Orders By User ID

### Edge Cases Handled

* Invalid MongoDB ObjectId
* Order Not Found
* Empty Orders Collection
* User With No Orders

### Gateway Testing

* GET requests through Gateway
* POST requests through Gateway
* Order Service Routing Verification

---

## Challenges Faced & Solutions

### 1. Service Communication Failure

Problem:

Axios requests failed with:

ECONNREFUSED

Cause:

Target service was not running.

Solution:

Verified service health and confirmed correct ports before testing.

---

### 2. API Gateway Route Mapping

Problem:

Gateway returned:

Cannot GET /

Cause:

Gateway route paths and service route prefixes were not aligned.

Solution:

Implemented proper path rewriting for service routes.

---

### 3. POST Requests Hanging Through Gateway

Problem:

POST requests buffered indefinitely through the gateway.

Cause:

Gateway was using express.json() while acting purely as a reverse proxy.

Solution:

Removed express.json() from the API Gateway and allowed downstream services to parse request bodies.

---

## Key Learnings

* Service-to-Service Communication using Axios
* HTTP Communication Between Microservices
* Error Propagation Across Services
* API Gateway Routing
* Path Rewriting
* Reverse Proxy Architecture
* Debugging ECONNREFUSED Errors
* Request Flow Through Distributed Systems
* Validation Before Data Persistence

---

## Current Status

User Service: Complete ✅

Product Service: Complete ✅

Order Service: Complete ✅

API Gateway: Complete ✅

Redis Integration: Pending

Dockerization: Pending

Frontend: Pending


# Day 5 Complete

## Redis Caching

### Features Implemented

* Docker Desktop Setup
* Redis Container Setup
* Redis Connection using Node.js Redis Client
* Product By ID Caching
* All Products Caching
* TTL-Based Cache Expiration

---

## Cache Hit / Cache Miss Flow

### Product By ID

Request
→ Redis Check
→ Cache Hit → Return Cached Product

OR

→ Cache Miss
→ MongoDB Query
→ Store In Redis
→ Return Product

---

### All Products

Request
→ Redis Check
→ Cache Hit → Return Cached Products

OR

→ Cache Miss
→ MongoDB Query
→ Store In Redis
→ Return Products

---

## Cache Invalidation

Implemented cache invalidation for:

### Create Product

* Invalidates All Products Cache

### Update Product

* Invalidates Product Cache
* Invalidates All Products Cache

### Delete Product

* Invalidates Product Cache
* Invalidates All Products Cache

---

## Testing Completed

### Product Cache

* Cache Miss Verification
* Cache Hit Verification
* TTL Expiration Verification

### All Products Cache

* Cache Miss Verification
* Cache Hit Verification

### Cache Invalidation

* Create Product
* Update Product
* Delete Product

---

## Key Learnings

* Redis Fundamentals
* Docker Containers
* Redis Client Integration
* Cache Hit vs Cache Miss
* TTL (Time To Live)
* Cache Aside Pattern
* Cache Invalidation Strategies
* Performance Optimization using Redis

---

## Current Status

User Service: Complete ✅

Product Service: Complete ✅

Order Service: Complete ✅

API Gateway: Complete ✅

Redis Integration: Complete ✅

Rate Limiting: Pending

Dockerization: Pending

Frontend: Pending


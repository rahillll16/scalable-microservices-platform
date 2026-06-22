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


# Day 6

## API Gateway Enhancements

✅ Global Rate Limiting

* Implemented request throttling at API Gateway level
* Configured request limits per time window
* Protects platform from excessive traffic and abuse

✅ Login Rate Limiting

* Added dedicated limiter for authentication endpoints
* Protects against brute-force login attacks
* Separate limits from global traffic rules

## Health Monitoring

✅ Service Health Dashboard

* Implemented `/system-health` endpoint
* Aggregates health status of all microservices
* Returns gateway status, service status, and timestamp

✅ Health Validation

* Used `Promise.allSettled()` for partial failure handling
* Detects individual service failures without breaking monitoring endpoint
* Reports service-level availability

## Load Balancing

✅ Round Robin Load Balancing

* Implemented custom round-robin routing inside API Gateway
* Distributes requests across multiple service instances

### User Service Replicas

* Instance 1 → Port 3001
* Instance 2 → Port 3004

### Product Service Replicas

* Instance 1 → Port 3002
* Instance 2 → Port 3005

### Order Service Replicas

* Instance 1 → Port 3003
* Instance 2 → Port 3006

## Health-Aware Routing

✅ Dynamic Health Checks

* Gateway performs periodic health checks every 10 seconds
* Tracks availability of all service instances

✅ Intelligent Routing

* Routes traffic only to healthy instances
* Automatically removes unhealthy replicas from routing pool
* Automatically restores replicas once healthy again

## Concepts Covered

* API Gateway Pattern
* Reverse Proxy
* Rate Limiting
* Health Monitoring
* Service Discovery Basics
* Round Robin Load Balancing
* Health-Aware Load Balancing
* Fault Tolerance
* Multi-Instance Microservices



# Day 7 Complete

## Resilience Patterns

### Retry Mechanism

Implemented automatic retry logic for inter-service communication in Order Service.

### Features Implemented

* Axios Retry Integration
* Automatic Retries for Failed Service Calls
* Configurable Retry Count
* Retry Delay with Backoff Strategy
* Retry Logging for Observability

### Retry Conditions

Retries are triggered for:

* ECONNREFUSED
* ECONNABORTED
* HTTP 5xx Server Errors

### Testing Completed

#### User Service Down

* Retry Attempt 1
* Retry Attempt 2
* Retry Attempt 3
* Request Failure After Maximum Retries

#### Product Service Validation

* Successful Validation
* Retry Logic Verification

### Key Learnings

* Transient Failure Handling
* Retry Patterns in Distributed Systems
* Axios Interceptors and Middleware
* Exponential / Delayed Retry Strategies
* Service Resilience Concepts

---

## Circuit Breaker Pattern

Implemented custom Circuit Breakers for service dependencies.

### Architecture

Order Service now maintains independent circuit breakers for:

* User Service
* Product Service

This prevents failures in one dependency from affecting requests to another healthy dependency.

### Circuit States

#### CLOSED

* Normal operation
* Requests are allowed

#### OPEN

* Triggered after repeated failures
* Requests are blocked immediately
* Prevents unnecessary retries and network traffic

#### HALF_OPEN

* Activated after timeout period
* Allows limited requests to verify service recovery
* Automatically transitions to CLOSED on success
* Returns to OPEN on failure

### Features Implemented

* Failure Threshold Tracking
* Automatic State Transitions
* Recovery Timeout Window
* Fast Failure Responses
* Independent Breakers Per Dependency

### Testing Completed

#### Circuit Opening

* User Service Stopped
* Consecutive Failures Recorded
* Circuit Opened After Threshold Reached

#### Fast Failure

* Requests Blocked While Circuit Open
* No Axios Calls Executed
* No Retry Logic Triggered

#### Recovery Validation

* HALF_OPEN Transition
* Service Recovery Verification
* Automatic Circuit Closure

### Key Learnings

* Circuit Breaker Pattern
* Fault Isolation
* Failure Threshold Management
* State Machines
* Resilience Engineering
* Fail Fast Architecture
* Service Recovery Strategies

---

## Current Architecture

Client
→ API Gateway
→ Load Balancer
→ Health-Aware Routing
→ Order Service
→ Retry Mechanism
→ Circuit Breaker
→ User Service / Product Service

---

## Current Status

User Service: Complete ✅

Product Service: Complete ✅

Order Service: Complete ✅

API Gateway: Complete ✅

Redis Integration: Complete ✅

Rate Limiting: Complete ✅

Health Monitoring: Complete ✅

Load Balancing: Complete ✅

Retry Mechanism: Complete ✅

Circuit Breaker: Complete ✅

Dockerization: Pending

Message Queue: Pending

Frontend Dashboard: Pending

Deployment: Pending

---

## Concepts Covered So Far

* Microservices Architecture
* API Gateway Pattern
* JWT Authentication
* Password Hashing
* MongoDB + Mongoose
* Redis Caching
* Rate Limiting
* Reverse Proxy
* Service Discovery Basics
* Health Monitoring
* Round Robin Load Balancing
* Health-Aware Routing
* Retry Pattern
* Circuit Breaker Pattern
* Fault Tolerance
* Resilience Engineering
* Distributed System Communication

# Day 8

## Frontend Foundation

✅ React Dashboard Setup

* Initialized React frontend using Vite
* Configured project structure for monitoring dashboard
* Integrated Tailwind CSS for modern UI development

✅ Dashboard Layout

* Created dashboard page structure
* Implemented responsive layout
* Added reusable Status Cards and Metric Panels

## System Health Monitoring

✅ Live Health Dashboard

* Connected frontend to Gateway `/system-health` endpoint
* Displays real-time health status of all services
* Auto-refreshes every 5 seconds

✅ Service Status Visualization

* Gateway Status Monitoring
* User Service Status Monitoring
* Product Service Status Monitoring
* Order Service Status Monitoring

✅ Dynamic Health Rendering

* Service cards automatically update based on backend health state
* Handles healthy and unhealthy service scenarios
* Added safe frontend error handling

## Load Balancer Observability

✅ Load Balancer Status API

* Implemented `/load-balancer-status` endpoint
* Exposes replica health information
* Tracks currently routed service instance

✅ Replica Monitoring Dashboard

### User Service Replicas

* Port 3001
* Port 3004

### Product Service Replicas

* Port 3002
* Port 3005

### Order Service Replicas

* Port 3003
* Port 3006

✅ Live Replica Health Visualization

* Displays healthy replicas
* Displays failed replicas
* Real-time health updates

✅ Current Routing Visibility

* Shows last routed target instance
* Helps visualize round-robin load balancing behavior
* Demonstrates health-aware routing decisions

## Circuit Breaker Observability

✅ Circuit Breaker Status API

* Implemented `/orders/circuit-breakers` endpoint
* Exposes User Service circuit state
* Exposes Product Service circuit state

✅ Circuit Breaker Dashboard

* Connected frontend to circuit breaker API
* Displays live circuit states

### Supported States

* CLOSED
* OPEN
* HALF_OPEN

✅ Fault Tolerance Visualization

* Circuit status updates automatically
* Provides visibility into service failures
* Demonstrates recovery process through dashboard

## Frontend Reliability

✅ API Integration Layer

* Created dedicated frontend service modules
* Centralized API communication
* Improved maintainability

✅ Error Handling

* Safe optional chaining
* Null-state protection
* Graceful handling of unavailable services

## Concepts Covered

* Frontend Observability
* Monitoring Dashboards
* Distributed Systems Visualization
* Health Monitoring
* Health-Aware Load Balancing
* Circuit Breaker Pattern
* Fault Tolerance
* Service Replication
* Dashboard Architecture
* Real-Time System Monitoring
* React State Management
* API Integration



# Day 9

## Authentication System

✅ Register Page

- User registration form
- Form validation
- Backend integration
- Success/Error handling

✅ Login Page

- User login form
- JWT authentication
- Token storage in localStorage
- Login/Register navigation

✅ Security Features

- Show/Hide password functionality
- Authentication flow completed

---

## Product Management

✅ Product Service Integration

- Connected frontend to Product Service through API Gateway
- Product CRUD operations integrated

✅ Create Product

- Product creation form
- Validation handling
- Auto-refresh after creation

✅ View Products

- Fetch all products
- Responsive product grid layout
- Product cards UI

✅ Update Product

- Edit mode implementation
- Form auto-fill on edit
- Update product functionality
- Cancel edit option

✅ Delete Product

- Product deletion
- Automatic refresh after deletion

✅ Search Products

- Client-side product search
- Real-time filtering by product name

---

## Dashboard Improvements

✅ Load Balancer UI

- Service instance visualization
- Health status indicators
- Replica monitoring

✅ Service Monitoring

- Health checks
- Circuit breaker status
- Infrastructure visibility

---

## Concepts Covered

- JWT Authentication
- Protected Resource Preparation
- CRUD Operations
- React State Management
- API Integration
- Product Lifecycle Management
- Client-side Search
- Dashboard Design
- Microservice Communication


# Day 10

### Authentication & Authorization

✅ Implemented Protected Routes

* Created ProtectedRoute component
* Restricted Products and Orders pages to logged-in users
* Redirect unauthenticated users to Login page

✅ Implemented Role-Based UI

* Admin-only Product Management UI
* Regular users cannot see Create/Edit/Delete product actions
* Dynamic Sidebar based on authentication status and role

✅ Navbar Improvements

* Display logged-in user's name
* Added Logout functionality
* Clear token, role and user data from localStorage on logout

---

### Product Service

✅ Product Search

* Search products by name
* Real-time filtering on frontend

✅ Admin Protection

* Added authMiddleware
* Added adminMiddleware
* Protected Create Product API
* Protected Update Product API
* Protected Delete Product API

⚠️ Pending

* Debug Update Product issue after middleware integration

---

### Orders Service

✅ Create Order

* User can place orders from Products page
* Product details passed through navigation state

✅ Order Listing

* Fetch orders by logged-in user
* Decode JWT to identify current user

✅ Product Details Enrichment

* Fetch Product details using productId
* Display:

  * Product Name
  * Description
  * Price
  * Quantity

✅ Order Summary

* Calculate Total Price per Order
* Calculate Grand Total Order Value

✅ Delete Order

* Implemented Delete Order API
* Added frontend delete functionality

✅ Authorization

* Users can delete only their own orders
* Ownership verification added

---

### Frontend Improvements

✅ Responsive Product Grid

* 4 products per row on large screens
* Responsive breakpoints

✅ Responsive Orders Grid

* 3 orders per row on large screens

✅ Edit Product UX

* Dynamic button:

  * Add Product
  * Update Product
* Cancel Edit functionality

---

### Redis

✅ Redis Analytics Backend

Implemented metrics tracking:

* Cache Hits
* Cache Misses
* Hit Ratio

Added Redis Metrics Endpoint:

GET /products/redis/metrics

⚠️ Pending

* Connect Redis Analytics to Dashboard UI

---

### Security

✅ JWT Authentication

* Product Service JWT verification
* Order Service JWT verification

✅ Role-Based Authorization

* Admin-only product modification
* User ownership checks on orders

---

## Current Status

### Completed

* User Service
* Authentication
* Authorization
* Product CRUD
* Product Search
* Order Creation
* Order Listing
* Order Deletion
* Redis Product Cache
* Circuit Breaker
* Retry Logic
* Protected Routes
* Role-Based UI

### Pending

* Fix Product Update issue
* Connect Redis Analytics Dashboard
* Service Health Metrics
* Dockerization
* Docker Compose
* Multi-instance Services
* Enhanced Load Balancing

---

## Next Session Plan

1. Fix Product Update issue
2. Complete Redis Analytics Dashboard
3. Git Commit
4. Dockerize User Service
5. Dockerize Product Service
6. Dockerize Order Service
7. Docker Compose Setup


# Day 11 Complete

## Security Hardening

### Product Service Authorization

✅ Added JWT Authentication Middleware

* Protected Product Creation API
* Protected Product Update API
* Protected Product Delete API

✅ Added Role-Based Access Control (RBAC)

* Admin-only Product Management
* Users restricted from Product Modification APIs
* Verified 401 and 403 authorization scenarios

---

### Order Service Authorization

✅ Protected Order APIs

* Create Order
* Get Order By ID
* Get Orders By User
* Delete Order

✅ Ownership Validation

* Users can delete only their own orders
* Prevented unauthorized order deletion

✅ JWT-Based User Identification

* Order creation now uses `req.user.userId`
* Removed dependency on client-provided `userId`
* Prevented order spoofing attacks

---

### Service-to-Service Authentication

✅ Forwarded Authorization Header

* Order Service → User Service validation
* Protected internal service communication

---

## Security Testing

### Product Service

✅ Guest cannot create products

✅ Guest cannot update products

✅ Guest cannot delete products

✅ User cannot create products

✅ User cannot update products

✅ User cannot delete products

✅ Admin can perform CRUD operations

---

### Order Service

✅ Guest cannot create orders

✅ Guest cannot delete orders

✅ User can create orders

✅ User can delete own orders

✅ User cannot delete other users' orders

✅ Admin can manage all orders

---

## Redis Analytics Dashboard

### Metrics Integration

✅ Connected Redis Analytics to Dashboard

Implemented Metrics:

* Cache Hits
* Cache Misses
* Hit Ratio

---

### Testing Completed

✅ Cache Hit Verification

✅ Cache Miss Verification

✅ Cache Invalidation Verification

### Results

```text
Cache Hit Ratio Achieved: ~98%
```

Demonstrates successful Redis Cache implementation and cache invalidation strategy.

---

## Dashboard Improvements

### Infrastructure Architecture Visualization

✅ Replaced basic topology diagram with a complete architecture diagram

Included:

* API Gateway
* Health-Aware Routing
* Round Robin Load Balancer
* User Service Replicas
* Product Service Replicas
* Order Service Replicas
* Redis Cache Layer
* MongoDB Storage Layer
* JWT Authentication
* Rate Limiting
* Circuit Breakers
* Retry Mechanism
* Service Health Monitoring

---

### Architecture Viewer

✅ Added Full Screen Architecture View

Features:

* Zoom Button
* Full-Screen Modal
* Dashboard Integration

---

## Product Page UI Redesign

### Product Management UI

✅ Redesigned Admin Product Form

* Horizontal Layout
* Modern Dashboard Styling
* Improved UX
* Better Field Organization

---

### Product Cards

✅ New Product Card Design

* Gradient Background
* Improved Borders
* Hover Effects
* Cleaner Layout

---

### Responsive Layout

✅ Mobile Responsive

✅ Tablet Responsive

✅ Desktop Responsive

* 4 Products Per Row on Large Screens

---

## Bug Fixes

### Authentication

✅ Fixed JWT Secret Configuration Issues

✅ Fixed Service Authentication Failures

---

### Product Management

✅ Fixed Product Update Authorization Issues

✅ Fixed Product Creation Authentication Issues

---

### Order Management

✅ Fixed Order Creation Authentication Issues

✅ Fixed Ownership Validation Logic

---

## Current Status

### Completed

✅ User Service

✅ Product Service

✅ Order Service

✅ API Gateway

✅ JWT Authentication

✅ Role-Based Authorization

✅ Redis Caching

✅ Redis Analytics

✅ Health Monitoring

✅ Load Balancing

✅ Health-Aware Routing

✅ Retry Mechanism

✅ Circuit Breaker Pattern

✅ Frontend Dashboard

✅ Product Management UI

✅ Order Management UI

✅ Architecture Visualization

---

### Pending

🔲 Dockerize User Service

🔲 Dockerize Product Service

🔲 Dockerize Order Service

🔲 Dockerize API Gateway

🔲 Docker Compose Setup

🔲 Multi-Container Deployment

🔲 Final Production Testing

---

## Project Completion Estimate

```text
Backend Services           ✅ 100%
Authentication             ✅ 100%
Authorization              ✅ 100%
Redis Caching              ✅ 100%
Resilience Patterns        ✅ 100%
Monitoring Dashboard       ✅ 100%
Frontend UI                ✅ 95%
Dockerization              ⏳ 0%

Overall Progress: ~90%
```

---

## Next Session Plan

1. Dockerize User Service
2. Dockerize Product Service
3. Dockerize Order Service
4. Dockerize API Gateway
5. Create Docker Compose Setup
6. Run Entire Platform Using One Command
7. Verify Redis + MongoDB Containers
8. Production Deployment Preparation


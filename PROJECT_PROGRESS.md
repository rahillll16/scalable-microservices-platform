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

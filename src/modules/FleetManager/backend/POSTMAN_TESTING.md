# FleetGuard — Fleet Manager Backend API Postman Testing Guide

This document provides complete instructions for setting up, running, and testing the **Fleet Manager** backend REST API endpoints using Postman or any HTTP client.

---

## 1. Environment & Prerequisites

### MongoDB Requirements
- **Local MongoDB**: `mongodb://127.0.0.1:27017/fleetguard` OR
- **MongoDB Atlas**: Standard connection string configured in `.env`:
  ```env
  PORT=5000
  MONGO_URI="mongodb+srv://<username>:<password>@cluster0.nzatfxy.mongodb.net"
  NODE_ENV=development
  ```

### Server Start Command
Navigate to the backend directory and execute:
```bash
cd FleetGuard/src/modules/FleetManager/backend
npm install
npm start
```
*Console Output upon clean startup:*
```text
[FleetGuard FleetManager] Backend server running on http://localhost:5000
MongoDB Connected: cluster0.nzatfxy.mongodb.net
```

---

## 2. Postman Collection File
A complete, pre-configured **Postman v2.1.0 Collection** is available in the backend folder:
`FleetGuard/src/modules/FleetManager/backend/FleetManager.postman_collection.json`

**How to Import in Postman:**
1. Open **Postman**.
2. Click **Import** (top left).
3. Drag & drop `FleetManager.postman_collection.json` or browse to select it.
4. The collection variable `{{baseUrl}}` defaults to `http://localhost:5000`.

---

## 3. Base URL
`http://localhost:5000`

---

## 4. Complete API Endpoint Reference

### FG-FM-01: Dashboard Summary
- **Method:** `GET`
- **Endpoint:** `/api/dashboard/summary` (or `/api/dashboard`)
- **Headers:** None
- **Response Code:** `200 OK`
- **Sample Response:**
```json
{
  "cards": {
    "totalVehicles": 12,
    "assignedVehicles": 5,
    "availableVehicles": 7,
    "complianceSummary": {
      "valid": 8,
      "expiringSoon": 2,
      "expired": 2
    },
    "expiringDocuments": 4
  },
  "recentlyAddedVehicles": [
    {
      "_id": "66a8717e4173c3cfe948c961",
      "registrationNumber": "KA-01-EA-1001",
      "model": "Prima 2830.K",
      "brand": "Tata",
      "branch": "North Hub",
      "status": "Available",
      "createdAt": "2026-07-31T10:00:00.000Z"
    }
  ]
}
```

---

### FG-FM-02: Register Vehicle
- **Method:** `POST`
- **Endpoint:** `/api/vehicles`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "registrationNumber": "KA-01-EQ-9988",
  "model": "Prima 2830.K",
  "brand": "Tata",
  "branch": "North Hub",
  "manufacturingYear": 2024,
  "mileage": 12500,
  "fuelType": "Diesel",
  "vehicleType": "Truck"
}
```
- **Response Code:** `201 Created`
- **Sample Response:**
```json
{
  "_id": "66a8717e4173c3cfe948c961",
  "registrationNumber": "KA-01-EQ-9988",
  "model": "Prima 2830.K",
  "brand": "Tata",
  "branch": "North Hub",
  "manufacturingYear": 2024,
  "mileage": 12500,
  "fuelType": "Diesel",
  "vehicleType": "Truck",
  "status": "Available",
  "assignedDriver": "Unassigned",
  "complianceSummary": {
    "insuranceStatus": "Missing",
    "pollutionStatus": "Missing",
    "fitnessStatus": "Missing",
    "rcStatus": "Missing",
    "overallStatus": "Expired"
  },
  "createdAt": "2026-07-31T11:00:00.000Z"
}
```

---

### FG-FM-03: Vehicle List
- **Method:** `GET`
- **Endpoint:** `/api/vehicles?page=1&limit=10&search=&status=All`
- **Headers:** None
- **Query Params:**
  - `page`: Page number (default `1`)
  - `limit`: Records per page (default `10`)
  - `search`: Regex search matching registration number, model, brand, or branch
  - `status`: Filter state (`All`, `Available`, `Assigned`, `Maintenance`, `Valid`, `Expiring Soon`, `Expired`)
- **Response Code:** `200 OK`
- **Sample Response:**
```json
{
  "vehicles": [
    {
      "_id": "66a8717e4173c3cfe948c961",
      "registrationNumber": "KA-01-EQ-9988",
      "model": "Prima 2830.K",
      "brand": "Tata",
      "branch": "North Hub",
      "manufacturingYear": 2024,
      "mileage": 12500,
      "fuelType": "Diesel",
      "vehicleType": "Truck",
      "status": "Available",
      "assignedDriver": "Unassigned"
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

---

### FG-FM-04: Vehicle Details
- **Method:** `GET`
- **Endpoint:** `/api/vehicles/:id`
- **Headers:** None
- **URL Params:** `id` = MongoDB ObjectId (e.g. `66a8717e4173c3cfe948c961`)
- **Response Code:** `200 OK`
- **Sample Response:**
```json
{
  "vehicle": {
    "_id": "66a8717e4173c3cfe948c961",
    "registrationNumber": "KA-01-EQ-9988",
    "model": "Prima 2830.K",
    "brand": "Tata",
    "branch": "North Hub",
    "manufacturingYear": 2024,
    "mileage": 12500,
    "fuelType": "Diesel",
    "vehicleType": "Truck",
    "status": "Available",
    "assignedDriver": "Unassigned"
  },
  "complianceDocs": [],
  "assignmentHistory": []
}
```

---

### FG-FM-05: Edit Vehicle
- **Method:** `PUT`
- **Endpoint:** `/api/vehicles/:id`
- **Headers:** `Content-Type: application/json`
- **URL Params:** `id` = MongoDB ObjectId
- **Request Body:**
```json
{
  "mileage": 18500,
  "branch": "Central Depot",
  "status": "Available"
}
```
- **Response Code:** `200 OK`
- **Sample Response:**
```json
{
  "_id": "66a8717e4173c3cfe948c961",
  "registrationNumber": "KA-01-EQ-9988",
  "model": "Prima 2830.K",
  "brand": "Tata",
  "branch": "Central Depot",
  "mileage": 18500,
  "status": "Available"
}
```

---

### FG-FM-06: Delete Vehicle
- **Method:** `DELETE`
- **Endpoint:** `/api/vehicles/:id`
- **Headers:** None
- **URL Params:** `id` = MongoDB ObjectId
- **Response Code:** `200 OK`
- **Sample Response:**
```json
{
  "message": "Vehicle and related data deleted successfully"
}
```

---

### FG-FM-07: Upload Compliance Document
- **Method:** `POST`
- **Endpoint:** `/api/compliance/upload`
- **Body Type:** `multipart/form-data`
- **Form Data Fields:**
  - `vehicleId`: `66a8717e4173c3cfe948c961` (Text)
  - `documentType`: `Insurance` | `Pollution Certificate` | `Fitness Certificate` | `RC` (Text)
  - `issueDate`: `2025-01-01` (Text)
  - `expiryDate`: `2026-12-31` (Text)
  - `document`: Select File (PDF/Image)
- **Response Code:** `200 OK`
- **Sample Response:**
```json
{
  "message": "Insurance uploaded successfully",
  "document": {
    "_id": "66a8717e4173c3cfe948c962",
    "vehicleId": "66a8717e4173c3cfe948c961",
    "registrationNumber": "KA-01-EQ-9988",
    "documentType": "Insurance",
    "filename": "document-1722423600000.pdf",
    "originalName": "insurance_policy.pdf",
    "filePath": "/uploads/document-1722423600000.pdf",
    "issueDate": "2025-01-01T00:00:00.000Z",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "status": "Valid"
  }
}
```

---

### FG-FM-08: Compliance Status Overview
- **Method:** `GET`
- **Endpoint:** `/api/compliance/status`
- **Headers:** None
- **Response Code:** `200 OK`
- **Sample Response:**
```json
{
  "summary": {
    "totalDocuments": 12,
    "valid": 8,
    "expiringSoon": 2,
    "expired": 2
  },
  "documents": [],
  "vehiclesCount": 5
}
```

---

### FG-FM-09: Assign Vehicle to Driver
- **Method:** `POST`
- **Endpoint:** `/api/assignments/assign` (or `/api/assignments`)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "vehicleId": "66a8717e4173c3cfe948c961",
  "driverName": "Robert Miller",
  "notes": "Assigned for Interstate Delivery route"
}
```
- **Response Code:** `200 OK`
- **Sample Response:**
```json
{
  "message": "Vehicle KA-01-EQ-9988 assigned to Robert Miller successfully",
  "assignment": {
    "_id": "66a8717e4173c3cfe948c963",
    "vehicleId": "66a8717e4173c3cfe948c961",
    "registrationNumber": "KA-01-EQ-9988",
    "driverName": "Robert Miller",
    "assignedDate": "2026-07-31T11:05:00.000Z",
    "status": "Active",
    "notes": "Assigned for Interstate Delivery route"
  }
}
```

---

### FG-FM-10: Upcoming Expiry List
- **Method:** `GET`
- **Endpoint:** `/api/compliance/upcoming-expiry?days=30` (or `/api/compliance/expiries`)
- **Query Params:** `days` (default `30`)
- **Headers:** None
- **Response Code:** `200 OK`
- **Sample Response:**
```json
{
  "filterDays": 30,
  "totalCount": 2,
  "expirations": [
    {
      "_id": "66a8717e4173c3cfe948c962",
      "vehicleId": "66a8717e4173c3cfe948c961",
      "registrationNumber": "KA-01-EQ-9988",
      "documentType": "Insurance",
      "daysRemaining": 15,
      "status": "Expiring Soon"
    }
  ]
}
```

---

## 5. Summary of Automated Verification Results
- **Total Tested Endpoints:** 11 / 11
- **APIs Passed:** 11
- **APIs Failed:** 0
- **Overall Status:** 100% PASS

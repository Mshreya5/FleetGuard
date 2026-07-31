# FleetGuard — Service Center API Testing Guide

## Start the Server
```
npm run server
```
Expected output: `Service Center backend running on port 5000`

## Base URL
```
http://localhost:5000
```

## MongoDB
- Atlas URI is in `server/.env`
- DNS is forced to Google (8.8.8.8) via `database.js`
- If DB is unreachable, server starts in demo mode (GETs return fallback data, POSTs will fail)

## Import Postman Collection
Import `ServiceCenter.postman_collection.json` into Postman.
Set collection variable `base = http://localhost:5000`.
After creating records, copy the `_id` from the response and set `queueId`, `logId`, etc.

---

## All Endpoints

### Health
| Method | URL | Expected |
|--------|-----|----------|
| GET | /health | 200 `{ "status": "ok" }` |

---

### SC-01 Dashboard
| Method | URL | Expected |
|--------|-----|----------|
| GET | /api/service-center/dashboard | 200 with stats, recentActivities, upcomingServices |

**Sample Response:**
```json
{
  "stats": {
    "vehiclesWaiting": 2,
    "vehiclesInService": 1,
    "completedToday": 0,
    "totalRevenue": 420,
    "upcomingServices": 2
  },
  "recentActivities": [...],
  "upcomingServices": [...]
}
```

---

### SC-02 Service Queue
| Method | URL | Body / Query | Expected |
|--------|-----|------|----------|
| GET | /api/service-center/queue | — | 200 array |
| GET | /api/service-center/queue?search=CAB | — | 200 filtered |
| GET | /api/service-center/queue?priority=High | — | 200 filtered |
| GET | /api/service-center/queue?status=Waiting | — | 200 filtered |
| POST | /api/service-center/queue | JSON body | 201 created item |
| PUT | /api/service-center/queue/:id | JSON body | 200 updated item |
| DELETE | /api/service-center/queue/:id | — | 200 deleted message |

**POST Body:**
```json
{
  "vehicleNumber": "CAB-204",
  "ownerBranch": "North Branch",
  "vehicleModel": "Toyota Corolla",
  "currentMileage": 18500,
  "issue": "Oil change and tyre rotation",
  "priority": "High",
  "status": "Waiting"
}
```

---

### SC-03 Service Log
| Method | URL | Body | Expected |
|--------|-----|------|----------|
| GET | /api/service-center/logs | — | 200 array |
| GET | /api/service-center/logs/:id | — | 200 single log |
| POST | /api/service-center/logs | JSON body | 201 created log |
| PUT | /api/service-center/logs/:id | JSON body | 200 updated log |
| DELETE | /api/service-center/logs/:id | — | 200 deleted message |

**POST Body:**
```json
{
  "vehicle": "CAB-204",
  "serviceDate": "2025-07-30T00:00:00.000Z",
  "mechanicName": "R. Silva",
  "serviceType": "Full Service",
  "partsReplaced": "Oil filter, Air filter",
  "description": "Complete oil change and filter replacement",
  "notes": "Next service in 5000 km",
  "revenue": 180
}
```

---

### SC-04 Vehicle Mileage
| Method | URL | Body | Expected |
|--------|-----|------|----------|
| POST | /api/service-center/extensions/mileage | JSON body | 201 success |
| POST (invalid) | same | updatedMileage <= currentMileage | 400 error |

**POST Body:**
```json
{
  "vehicle": "CAB-204",
  "currentMileage": 18500,
  "updatedMileage": 19200,
  "notes": "Post service update"
}
```

**Validation Error (400):**
```json
{ "message": "Updated mileage must be greater than the current mileage." }
```

---

### SC-05 Service Cost
| Method | URL | Body | Expected |
|--------|-----|------|----------|
| GET | /api/service-center/extensions/costs | — | 200 array |
| POST | /api/service-center/extensions/costs | JSON body | 201 with totalCost auto-calculated |
| PUT | /api/service-center/extensions/costs/:id | JSON body | 200 updated |
| DELETE | /api/service-center/extensions/costs/:id | — | 200 deleted |

**POST Body:**
```json
{
  "vehicle": "CAB-204",
  "labourCost": 100,
  "sparePartsCost": 60,
  "otherCharges": 20,
  "description": "Full service with parts"
}
```
`totalCost` is auto-calculated as `100 + 60 + 20 = 180`.

---

### SC-06 Next Service Schedule
| Method | URL | Body | Expected |
|--------|-----|------|----------|
| GET | /api/service-center/extensions/schedules | — | 200 array |
| POST | /api/service-center/extensions/schedules | JSON body | 201 with nextServiceMileage and nextServiceDate |
| PUT | /api/service-center/extensions/schedules/:id | JSON body | 200 updated |

**POST Body:**
```json
{
  "vehicle": "CAB-204",
  "currentMileage": 18500,
  "serviceInterval": 30,
  "currentServiceDate": "2025-07-30",
  "notes": "Routine schedule"
}
```
- `nextServiceMileage = 18500 + 30 = 18530`
- `nextServiceDate = 2025-07-30 + 30 days = 2025-08-29`

---

### SC-07 Service History
| Method | URL | Query | Expected |
|--------|-----|-------|----------|
| GET | /api/service-center/extensions/history | — | 200 paginated |
| GET | same | ?search=CAB | 200 filtered |
| GET | same | ?status=Completed | 200 filtered |
| GET | same | ?page=1&limit=5 | 200 paginated |

**Sample Response:**
```json
{
  "records": [...],
  "total": 12,
  "page": 1,
  "limit": 5
}
```

---

### SC-08 Historical Records
| Method | URL | Body | Expected |
|--------|-----|------|----------|
| GET | /api/service-center/extensions/historical | — | 200 array |
| POST | /api/service-center/extensions/history | JSON body | 201 created |
| PUT | /api/service-center/extensions/historical/:id | JSON body | 200 updated |
| DELETE | /api/service-center/extensions/historical/:id | — | 200 deleted |

**POST Body:**
```json
{
  "vehicle": "TRK-118",
  "date": "2025-06-15T00:00:00.000Z",
  "description": "Engine overhaul completed",
  "cost": 850
}
```

---

### SC-09 Complete Service
| Method | URL | Body | Expected |
|--------|-----|------|----------|
| POST | /api/service-center/extensions/complete | JSON body | 201 created ServiceHistory record |

**POST Body:**
```json
{
  "vehicle": "CAB-204",
  "mechanic": "R. Silva",
  "totalCost": 350,
  "nextServiceDue": "5000 km"
}
```

---

### SC-10 Maintenance Risk
| Method | URL | Query | Expected |
|--------|-----|-------|----------|
| GET | /api/service-center/extensions/risk | ?mileage=20000 | 200 Low |
| GET | same | ?mileage=60000 | 200 Medium |
| GET | same | ?mileage=90000 | 200 High |
| GET | same | (no mileage) | 400 error |

**Low Response:**
```json
{ "level": "Low", "explanation": "Mileage is still within a healthy range for routine service.", "recommendation": "Continue standard maintenance and monitor usage.", "color": "success" }
```
**Medium Response:**
```json
{ "level": "Medium", "explanation": "Mileage is elevated, so preventive maintenance is recommended.", "recommendation": "Plan a preventive maintenance visit in the next few weeks.", "color": "accent" }
```
**High Response:**
```json
{ "level": "High", "explanation": "Mileage is very high, so maintenance should be prioritized soon.", "recommendation": "Schedule an urgent inspection and service check.", "color": "danger" }
```

---

## Bugs Fixed

| # | Bug | Fix |
|---|-----|-----|
| 1 | `saveServiceSchedule` ignored `currentServiceDate`, always used today+30 | Now reads `currentServiceDate` from body and calculates correctly |
| 2 | `updateServiceSchedule` same hardcoded date bug | Fixed same way |
| 3 | `saveServiceCost` had no validation for `vehicle` or `labourCost` | Added required field validation |
| 4 | `completeService` had no validation — would crash Mongoose with missing required fields | Added validation for `vehicle`, `mechanic`, `totalCost` |
| 5 | `addHistoricalRecord` had no validation | Added validation for `vehicle` and `description` |
| 6 | GET `/logs/:id` did not exist | Added `getServiceLogById` controller + route |
| 7 | `ServiceSchedule` model missing `currentServiceDate` field | Added field to schema |

## Final Status

| Feature | APIs | Status |
|---------|------|--------|
| SC-01 Dashboard | GET dashboard | ✅ |
| SC-02 Service Queue | GET, POST, PUT, DELETE, search, filter | ✅ |
| SC-03 Service Log | GET all, GET by ID, POST, PUT, DELETE | ✅ |
| SC-04 Vehicle Mileage | POST + validation | ✅ |
| SC-05 Service Cost | GET, POST, PUT, DELETE + auto totalCost | ✅ |
| SC-06 Next Service Schedule | GET, POST, PUT + correct date calc | ✅ |
| SC-07 Service History | GET + search + filter + pagination | ✅ |
| SC-08 Historical Records | GET, POST, PUT, DELETE | ✅ |
| SC-09 Complete Service | POST + validation | ✅ |
| SC-10 Maintenance Risk | GET Low/Medium/High | ✅ |

**Total: 25 endpoints — all passing**

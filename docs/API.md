# Studeo API Documentation

**Base URL**: `http://localhost:3001/api`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### POST /auth/register
Create a new account.

**Body:**
```json
{
  "email": "marie@student.be",
  "password": "min8chars",
  "firstName": "Marie",
  "lastName": "Dupont",
  "studentStatus": "JOBISTE",
  "region": "BRUSSELS"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### POST /auth/login
Login with email and password.

**Body:**
```json
{
  "email": "marie@student.be",
  "password": "min8chars"
}
```

### POST /auth/refresh
Refresh access token.

**Body:**
```json
{ "refreshToken": "..." }
```

### GET /auth/me
Get current user profile. Requires authentication.

---

## Hours

### GET /hours?year=2026
List hour entries for the given year.

### POST /hours
Create a new hour entry.

**Body:**
```json
{
  "date": "2026-04-07",
  "hours": 8,
  "employer": "Carrefour",
  "description": "Caisse du samedi"
}
```

### PUT /hours/:id
Update an hour entry.

### DELETE /hours/:id
Delete an hour entry.

### GET /hours/summary?year=2026
Get hours summary (total, remaining, by month).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalHours": 247,
    "remainingHours": 403,
    "maxHours": 650,
    "percentUsed": 38.0,
    "byMonth": [
      { "month": 1, "hours": 40 },
      { "month": 2, "hours": 56 }
    ]
  }
}
```

---

## Transactions

### GET /transactions?type=INCOME&year=2026&category=student_job
List transactions with optional filters.

### POST /transactions
```json
{
  "type": "INCOME",
  "amount": 450.00,
  "category": "student_job",
  "description": "Salaire mars Carrefour",
  "date": "2026-03-31"
}
```

### GET /transactions/summary?year=2026
Income/expense summary with category breakdown.

---

## Documents

### GET /documents?type=PAYSLIP
List uploaded documents.

### POST /documents/upload
Upload a document (multipart/form-data).
- Field `file`: the file
- Field `type`: RECEIPT | PAYSLIP | CONTRACT | INVOICE | TAX_DOCUMENT | OTHER

### DELETE /documents/:id
Delete a document.

---

## Obligations

### GET /obligations
Get personalized obligations for the current user.

### PUT /obligations/:obligationId/status
Update obligation status.

**Body:**
```json
{ "status": "DONE" }
```

---

## Tax Simulator

### GET /simulator/tax?year=2026
Get tax simulation based on current data.

**Response:**
```json
{
  "success": true,
  "data": {
    "grossIncome": 8500.00,
    "taxFreeAllowance": 10910,
    "taxableIncome": 5950.00,
    "estimatedTax": 0,
    "socialContributions": 230.35,
    "netIncome": 8269.65,
    "thresholdWarnings": [...]
  }
}
```

---

## Knowledge Base

### GET /knowledge?category=fiscal
List knowledge articles.

### GET /knowledge/:slug
Get a specific article by slug.

---

## Profile

### GET /profile
Get user profile.

### PUT /profile
Update user profile.

```json
{
  "firstName": "Marie",
  "lastName": "Dupont",
  "studentStatus": "INDEPENDENT",
  "region": "WALLONIA"
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Message d'erreur en français"
}
```

Validation errors include details:
```json
{
  "success": false,
  "error": "Données invalides",
  "details": ["email: Email invalide"]
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Invalid request |
| 401 | Authentication required |
| 404 | Not found |
| 409 | Conflict (e.g. duplicate email) |
| 500 | Server error |

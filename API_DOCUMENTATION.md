# API Documentation - Kurikulum

## Base URL
```
http://localhost:8000
```

---

## CPL (Capaian Profil Lulusan)

### Index
```
GET /cpl
```
**Response:**
```json
{
  "cpls": [
    {
      "id": 1,
      "kode": "CPL-01",
      "deskripsi": "Deskripsi CPL",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

### Store
```
POST /cpl
```
**Request Body:**
```json
{
  "deskripsi": "required|string|min:5"
}
```
**Response:** Redirect back with success message

### Update
```
PATCH /cpl/{cpl}
```
**Request Body:**
```json
{
  "deskripsi": "required|string|min:5"
}
```
**Response:** Redirect back with success message

### Destroy
```
DELETE /cpl/{cpl}
```
**Response:** Redirect back with success message

---

## PPM (Profesi & Peluang Magang)

### Index
```
GET /ppm
```
**Response:**
```json
{
  "ppms": [
    {
      "id": 1,
      "kode": "PPM-01",
      "deskripsi": "Deskripsi PPM",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

### Store
```
POST /ppm
```
**Request Body:**
```json
{
  "deskripsi": "required|string|min:5"
}
```
**Response:** Redirect back with success message

### Update
```
PATCH /ppm/{ppm}
```
**Request Body:**
```json
{
  "deskripsi": "required|string|min:5"
}
```
**Response:** Redirect back with success message

### Destroy
```
DELETE /ppm/{ppm}
```
**Response:** Redirect back with success message

---

## IEA (Indikator Elemen Able)

### Index
```
GET /iea
```
**Response:**
```json
{
  "ieas": [
    {
      "id": 1,
      "kode": "IEA_A",
      "deskripsi": "Deskripsi IEA",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

### Store
```
POST /iea
```
**Request Body:**
```json
{
  "deskripsi": "required|string|min:5"
}
```
**Note:** Kode auto-generate (IEA_A, IEA_B, ...)
**Response:** Redirect back with success message

### Update
```
PATCH /iea/{iea}
```
**Request Body:**
```json
{
  "deskripsi": "required|string|min:5"
}
```
**Response:** Redirect back with success message

### Destroy
```
DELETE /iea/{iea}
```
**Response:** Redirect back with success message

---

## Matrix

### Index
```
GET /matrix
```
**Response:**
```json
{
  "cpls": [...],
  "ieas": [...],
  "ppms": [...],
  "cplToPpmMatrix": {
    "cpl_id": {
      "ppm_id": true/false
    }
  }
}
```

### Sync CPL-IEA
```
POST /matrix/sync-cpl-iea
```
**Request Body:**
```json
{
  "cpl_id": 1,
  "iea_id": 1,
  "is_selected": true
}
```
**Response:** Redirect back

### Sync PPM-IEA
```
POST /matrix/sync-ppm-iea
```
**Request Body:**
```json
{
  "ppm_id": 1,
  "iea_id": 1,
  "is_selected": true
}
```
**Response:** Redirect back

---

## Pages (Inertia Routes)

| Route | Page Component |
|-------|---------------|
| GET / | Welcome |
| GET /dashboard | Dashboard |
| GET /profile | Profile |
| GET /matrix | Matrix |
| GET /cpl | Cpl |
| GET /ppm | Ppm |
| GET /iea | Iea |

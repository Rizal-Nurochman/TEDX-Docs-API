---
title: Login
description: Autentikasi user dan mendapat access + refresh token.
---

Memverifikasi kredensial user dan mengembalikan pasangan token untuk akses API.

## Request

**POST** `/api/v1/auth/login`

| Field      | Tipe    | Wajib |
|------------|---------|-------|
| `email`    | string  | ✓     |
| `password` | string  | ✓     |

### Body (JSON)

```json
{
  "email": "budi@example.com",
  "password": "rahasia123"
}
```

## Response

**Status 200 OK** — bila berhasil:

```json
{
  "status": true,
  "message": "success login",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "a3Bzb2ZrcG9za2dvc2tnb3Nrb2dvc2tvZ3NvZ2s=",
    "role": "user"
  }
}
```

### Field `data`

| Field           | Tipe    | Deskripsi                                    |
|-----------------|---------|----------------------------------------------|
| `access_token`  | string  | JWT untuk request yang butuh Bearer (15 menit)|
| `refresh_token` | string  | Token opaque untuk `/auth/refresh` (7 hari)  |
| `role`          | string  | Role user (`user` / `admin`)                 |

## Error umum

| Kondisi               | Status | `error`                |
|-----------------------|--------|------------------------|
| Email tidak ditemukan | 400    | `email not found`      |
| Password salah        | 400    | `invalid credentials`  |
| Body tidak valid      | 400    | pesan validasi binding |

Contoh (kredensial salah):

```json
{
  "status": false,
  "message": "failed login",
  "error": "invalid credentials"
}
```

## Penggunaan token

Setelah login, simpan token di sisi frontend (mis. `localStorage` / state) lalu:

```
Authorization: Bearer <access_token>
```

Lihat halaman [Autentikasi](/authentication/) untuk detail.

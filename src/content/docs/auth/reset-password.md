---
title: Reset Password
description: Mengirim token reset dan mengatur password baru.
---

Reset password terdiri dari dua langkah: **kirim token** ke email, lalu **set
password baru** menggunakan token tersebut.

## 1. Kirim token reset

**POST** `/api/v1/auth/send-password-reset`

| Field   | Tipe    | Wajib | Validasi      |
|---------|---------|-------|---------------|
| `email` | string  | ✓     | format email  |

### Body (JSON)

```json
{
  "email": "budi@example.com"
}
```

### Response

**Status 200 OK**:

```json
{
  "status": true,
  "message": "success send password reset",
  "data": null
}
```

> Token reset dikirim ke email user melalui SMTP (gomail).

## 2. Set password baru

**POST** `/api/v1/auth/reset-password`

| Field         | Tipe    | Wajib | Validasi          |
|---------------|---------|-------|-------------------|
| `token`       | string  | ✓     | token dari email  |
| `new_password`| string  | ✓     | minimal 8 karakter|

### Body (JSON)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "new_password": "passwordBaru123"
}
```

### Response

**Status 200 OK**:

```json
{
  "status": true,
  "message": "success reset password",
  "data": null
}
```

## Error umum

| Kondisi                          | Status | `error`                    |
|----------------------------------|--------|----------------------------|
| Email tidak ditemukan            | 400    | `email not found`          |
| Token reset tidak valid          | 400    | `password reset token invalid` |
| User tidak ditemukan             | 400    | `user not found`           |
| Body tidak valid / password pendek| 400   | pesan validasi binding     |

## Catatan untuk frontend

- Token reset dikirim sebagai teks di email. User menempelkannya ke form.
- Setelah berhasil, arahkan user ke halaman login.
---
title: Verifikasi Email
description: Mengirim OTP dan memverifikasi email user.
---

Verifikasi email terdiri dari dua langkah: **kirim OTP** lalu **verifikasi dengan
OTP**. OTP berupa 6 digit dan berlaku **15 menit**.

## 1. Kirim OTP

**POST** `/api/v1/auth/send-verification-email`

| Field   | Tipe    | Wajib |
|---------|---------|-------|
| `email` | string  | ✓     |

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
  "message": "success send verification email",
  "data": null
}
```

> OTP dikirim ke email user melalui SMTP (gomail). Jika SMTP belum dikonfigurasi,
> endpoint ini mengembalikan error.

## 2. Verifikasi

**POST** `/api/v1/auth/verify-email`

| Field      | Tipe    | Wajib | Validasi      |
|------------|---------|-------|---------------|
| `email`    | string  | ✓     | format email  |
| `code`     | string  | ✓     | tepat 6 digit |

### Body (JSON)

```json
{
  "email": "budi@example.com",
  "code": "123456"
}
```

### Response

**Status 200 OK**:

```json
{
  "status": true,
  "message": "success verify email",
  "data": {
    "email": "budi@example.com",
    "is_verified": true
  }
}
```

## Error umum

| Kondisi                          | Status | `error`                     |
|----------------------------------|--------|-----------------------------|
| Email tidak ditemukan            | 400    | `email not found`           |
| Akun sudah terverifikasi         | 400    | `account already verified`  |
| Kode salah                       | 400    | `token invalid`             |
| Kode kedaluwarsa (> 15 menit)    | 400    | `token expired`             |
| Body tidak valid                 | 400    | pesan validasi binding      |

## Catatan untuk frontend

- Tampilkan form OTP 6 digit setelah user meminta verifikasi.
- Jika user tidak menerima email, beri tombol "kirim ulang" yang memanggil
  `/send-verification-email` lagi.
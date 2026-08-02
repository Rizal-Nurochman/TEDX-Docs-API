---
title: Register
description: Mendaftarkan akun user baru.
---

Membuat akun user baru. Setelah register, sistem otomatis mengirim email
verifikasi secara **asinkron**.

## Request

**POST** `/api/v1/auth/register`

| Field        | Tipe    | Wajib | Validasi                  |
|--------------|---------|-------|---------------------------|
| `name`       | string  | ✓     | 2–100 karakter            |
| `email`      | string  | ✓     | format email, unik        |
| `password`   | string  | ✓     | minimal 8 karakter        |

### Body (JSON)

```json
{
  "name": "Budi",
  "email": "budi@example.com",
  "password": "rahasia123",
}
```

## Response

**Status 200 OK** — bila berhasil:

```json
{
  "status": true,
  "message": "success create user",
  "data": {
    "id": "6f4b6a5e-7f10-4c6a-9d0a-1f2e3d4c5b6a",
    "name": "Budi",
    "email": "budi@example.com",
    "telp_number": "",
    "role": "user",
    "image_url": "",
    "is_verified": false
  }
}
```

> Akun selalu dibuat dengan `is_verified: false` dan `role: "user"`.

## Error umum

| Kondisi                          | Status | `error`                            |
|----------------------------------|--------|------------------------------------|
| Body tidak valid / field kurang  | 400    | pesan validasi binding             |
| Email sudah terdaftar            | 400    | `email already exist`              |
| Gagal menyimpan / hash password  | 400    | pesan error terkait                |

Contoh (email sudah ada):

```json
{
  "status": false,
  "message": "failed create user",
  "error": "email already exist"
}
```

## Catatan

- Password disimpan sebagai hash bcrypt — tidak pernah dikirim balik.
- Email verifikasi dikirim lewat SMTP (gomail). Jika SMTP belum dikonfigurasi,
  register tetap sukses, tetapi email verifikasi gagal dikirim (dicatat di log server).

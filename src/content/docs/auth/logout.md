---
title: Logout
description: Mengakhiri sesi dan mencabut semua refresh token user.
---

Mencabut (revoke) **semua** refresh token milik user yang sedang login. Setelah
logout, refresh token lama tidak bisa dipakai lagi.

## Request

**POST** `/api/v1/auth/logout`

Wajib menyertakan access token:

```
Authorization: Bearer <access_token>
```

Tidak ada body yang diperlukan.

## Response

**Status 200 OK** — bila berhasil:

```json
{
  "status": true,
  "message": "success logout",
  "data": null
}
```

## Error umum

| Kondisi                     | Status | `error`                  |
|-----------------------------|--------|--------------------------|
| Token tidak ada / tidak valid | 401  | `token not found` / `token not valid` |
| Gagal revoke                | 400    | pesan error terkait      |

## Catatan untuk frontend

- Setelah logout, hapus token dari penyimpanan lokal di sisi frontend.
- Endpoint ini mencabut refresh token di server, sehingga sesi tidak bisa
  dilanjutkan lewat `/auth/refresh`.
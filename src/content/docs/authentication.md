---
title: Autentikasi
description: Cara autentikasi ke API menggunakan access token JWT.
---

Autentikasi memakai **JWT Bearer token**. Semua endpoint yang proteksi memerlukan
header `Authorization`.

## Alur singkat

1. **Login** → dapat `access_token` (JWT) dan `refresh_token` (opaque).

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "a3Bzb2ZrcG9za2dvc2tnb3Nrb2dvc2tvZ3NvZ2s=",
  "role": "user"
}
```

2. Kirim `access_token` di header untuk request yang butuh autentikasi.
3. Saat `access_token` kedaluwarsa, gunakan `refresh_token` pada `/auth/refresh`
   untuk mendapatkan pasangan token baru.

## Mengirim token

Tambahkan header berikut pada setiap request yang diproteksi:

```
Authorization: Bearer <access_token>
```

Contoh:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

:::caution[Format wajib]
Prefix `Bearer ` (dengan spasi) wajib ada. Tanpa prefix atau header kosong, API
mengembalikan `401 Unauthorized`.
:::

## Lifetime token

| Token        | Tipe   | Masa berlaku      | Keterangan                          |
|--------------|--------|-------------------|-------------------------------------|
| Access token | JWT    | 15 menit          | HS256, membawa `user_id` + `role`   |
| Refresh token| Opaque | 7 hari            | Disimpan di DB, dirotasi saat refresh |

## Kapan endpoint butuh Bearer

- **Auth `/logout`** — wajib Bearer.
- **Auth lainnya** (`/register`, `/login`, `/refresh`, verifikasi, reset password)
  — tidak butuh Bearer.

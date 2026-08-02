---
title: Refresh Token
description: Mendapat pasangan token baru menggunakan refresh token.
---

Ketika `access_token` kedaluwarsa, gunakan `refresh_token` untuk mendapatkan
pasangan token baru. Refresh token **dirotasi**: token lama dihapus dan diganti
token baru.

## Request

**POST** `/api/v1/auth/refresh`

| Field          | Tipe    | Wajib |
|----------------|---------|-------|
| `refresh_token`| string  | ✓     |

### Body (JSON)

```json
{
  "refresh_token": "a3Bzb2ZrcG9za2dvc2tnb3Nrb2dvc2tvZ3NvZ2s="
}
```

## Response

**Status 200 OK** — bila berhasil:

```json
{
  "status": true,
  "message": "success refresh token",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "MJlCbm5hZTJqbXBjaHZ2a3ZxdmJubHJzZHF3dm5kdmJucQ==",
    "role": "user"
  }
}
```

> `refresh_token` baru diberikan. Simpan yang baru ini untuk digunakan pada
> refresh berikutnya — token lama sudah tidak berlaku.

## Error umum

| Kondisi                        | Status | `error`                   |
|--------------------------------|--------|---------------------------|
| Refresh token tidak dikenal    | 401    | `refresh token not found` |
| Body tidak valid               | 400    | pesan validasi binding    |

## Catatan untuk frontend

- Selalu ganti simpanan `refresh_token` dengan yang baru dari respons ini.
- Jika refresh gagal (`401`), umumnya berarti sesi sudah berakhir — arahkan user
  untuk login ulang.

---
title: User
description: Manajemen user — khusus admin.
---

Manajemen akun user terdaftar. **Semua endpoint di grup ini khusus role `admin`**
(middleware `Authenticate` + `AuthorizeAdmin`). Token role `user` mendapat
`403 Forbidden`.

Base path: `/api/v1/users`

## Ringkasan

| Method | Path   | Auth          | Deskripsi |
|--------|--------|---------------|-----------|
| GET    | ``     | Bearer (admin)| Daftar user (paginasi + filter) |
| GET    | `/:id` | Bearer (admin)| Detail user |
| PATCH  | `/:id` | Bearer (admin)| Update user (termasuk role) |
| DELETE | `/:id` | Bearer (admin)| Hapus user |

## Daftar user

**GET** `/api/v1/users` — Bearer (admin)

Query parameter:

| Param     | Tipe  | Wajib | Deskripsi |
|-----------|-------|-------|-----------|
| `search`  | string| —     | Cari berdasarkan nama / email (parsial) |
| `role`    | string| —     | Filter role: `admin` atau `user` |
| `page`    | int   | —     | Halaman (default `1`) |
| `per_page`| int   | —     | Jumlah per halaman (default `10`) |

Response **200 OK** — `data` berisi array + `meta` paginasi:

```json
{
  "status": true,
  "message": "success get list user",
  "data": {
    "data": [
      {
        "id": "6f4b6a5e-7f10-4c6a-9d0a-1f2e3d4c5b6a",
        "name": "Budi",
        "email": "budi@example.com",
        "telp_number": "081234567890",
        "role": "user",
        "image_url": "",
        "is_verified": true
      }
    ],
    "meta": {
      "page": 1,
      "per_page": 10,
      "max_page": 1,
      "total": 1
    }
  }
}
```

## Detail user

**GET** `/api/v1/users/:id` — Bearer (admin)

Response **200 OK** — `data` berisi satu objek user (struktur sama dengan item di daftar).

Error: `400` bila user tidak ditemukan.

## Update user

**PATCH** `/api/v1/users/:id` — Bearer (admin)

Semua field opsional (partial update):

| Field         | Tipe    | Validasi |
|---------------|---------|----------|
| `name`        | string  | — |
| `email`       | string  | format email |
| `telp_number` | string  | — |
| `role`        | string  | `admin` atau `user` |

```json
{
  "role": "admin"
}
```

Response **200 OK** — `data` berisi user setelah update.

Error: `400` bila role tidak valid (`role must be admin or user`) atau user tidak ditemukan.

## Hapus user

**DELETE** `/api/v1/users/:id` — Bearer (admin)

Response **200 OK** — `data: null`. Refresh token milik user ikut dihapus.

Error: `400` bila user tidak ditemukan.

## Catatan

- Endpoint ini **tidak** bisa diakses oleh role `user` — hanya `admin`.
- `image_url` saat ini selalu kosong (fitur upload foto profil belum tersedia).
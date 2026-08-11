---
title: Bundle
description: Katalog bundle merchandise — baca publik, kelola khusus admin.
---

Katalog bundle (paket merchandise). Endpoint baca bersifat **publik**, sedangkan
endpoint tulis (create/update/delete + gambar) hanya untuk role **admin**.

Base path: `/api/v1/bundles`

## Ringkasan

| Method | Path                        | Auth          | Deskripsi |
|--------|-----------------------------|---------------|-----------|
| GET    | ``                          | —             | Daftar bundle |
| GET    | `/:id`                      | —             | Detail bundle + gambar |
| POST   | ``                          | Bearer (admin)| Buat bundle |
| PATCH  | `/:id`                      | Bearer (admin)| Update bundle |
| DELETE | `/:id`                      | Bearer (admin)| Hapus bundle |
| POST   | `/:id/images`               | Bearer (admin)| Tambah gambar |
| DELETE | `/:id/images/:imageId`      | Bearer (admin)| Hapus gambar |

## Daftar bundle

**GET** `/api/v1/bundles`

Query parameter:

| Param      | Tipe  | Wajib | Deskripsi |
|------------|-------|-------|-----------|
| `is_active`| bool  | —     | Filter status. **Default `true`** (hanya bundle aktif) |

> Tanpa parameter, endpoint publik ini hanya mengembalikan bundle **aktif**.
> Kirim `?is_active=false` untuk melihat bundle yang disembunyikan.

Response **200 OK** — `data` berupa **array polos** (tanpa `meta`):

```json
{
  "status": true,
  "message": "success get list bundle",
  "data": [
    {
      "id": "6f4b6a5e-7f10-4c6a-9d0a-1f2e3d4c5b6a",
      "name": "Bundle Starter",
      "description": "Tote bag + sticker",
      "price": "150000.00",
      "is_active": true,
      "created_at": "2026-07-01T10:00:00Z",
      "updated_at": "2026-07-01T10:00:00Z"
    }
  ]
}
```

## Detail bundle

**GET** `/api/v1/bundles/:id`

Response **200 OK** — sama seperti di atas, ditambah `images`:

```json
{
  "status": true,
  "message": "success get bundle",
  "data": {
    "id": "6f4b6a5e-7f10-4c6a-9d0a-1f2e3d4c5b6a",
    "name": "Bundle Starter",
    "description": "Tote bag + sticker",
    "price": "150000.00",
    "is_active": true,
    "created_at": "2026-07-01T10:00:00Z",
    "updated_at": "2026-07-01T10:00:00Z",
    "images": [
      { "id": "a1b2c3d4-...", "image_url": "https://cdn.example.com/bundle-1.jpg" }
    ]
  }
}
```

Error: `404 Not Found` bila id tidak ada / bukan UUID valid.

## Buat bundle

**POST** `/api/v1/bundles` — Bearer (admin)

| Field         | Tipe    | Wajib | Validasi |
|---------------|---------|-------|----------|
| `name`        | string  | ✓     | 1–255 karakter |
| `description` | string  | ✓     | minimal 1 karakter |
| `price`       | string  | ✓     | format desimal, 0 – 99999999.99 |

```json
{
  "name": "Bundle Starter",
  "description": "Tote bag + sticker",
  "price": "150000.00"
}
```

Response **201 Created** — `data` berisi bundle yang dibuat (`is_active` selalu `true`).

## Update bundle

**PATCH** `/api/v1/bundles/:id` — Bearer (admin)

Semua field opsional (partial update):

| Field         | Tipe    | Validasi |
|---------------|---------|----------|
| `name`        | string  | 1–255 karakter |
| `description` | string  | minimal 1 karakter |
| `price`       | string  | format desimal, 0 – 99999999.99 |
| `is_active`   | bool    | — |

Response **200 OK** — `data` berisi bundle setelah update.

## Hapus bundle

**DELETE** `/api/v1/bundles/:id` — Bearer (admin)

Response **200 OK** — `data: null`. Gambar bundle ikut terhapus (`ON DELETE CASCADE`).

## Gambar bundle

### Tambah gambar

**POST** `/api/v1/bundles/:id/images` — Bearer (admin)

| Field       | Tipe    | Wajib | Validasi |
|-------------|---------|-------|----------|
| `image_url` | string  | ✓     | URL valid, maks 255 karakter |

```json
{
  "image_url": "https://cdn.example.com/bundle-1.jpg"
}
```

Response **201 Created** — `data` berisi `{ "id": "...", "image_url": "..." }`.

### Hapus gambar

**DELETE** `/api/v1/bundles/:id/images/:imageId` — Bearer (admin)

Response **200 OK** — `data: null`. Error `400` bila gambar tidak ditemukan.

## Catatan

- `price` dikirim dan dikembalikan sebagai **string** (mis. `"150000.00"`) agar
  presisi uang terjaga di kedua sisi. Kolom DB: `numeric(10,2)`.
- Bundle selalu dibuat **aktif** — nonaktifkan lewat `PATCH` dengan `is_active: false`.
- Endpoint admin butuh role `admin` (middleware `AuthorizeAdmin` setelah
  `Authenticate`). Token role `user` mendapat `403 Forbidden`.
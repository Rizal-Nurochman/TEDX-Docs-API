---
title: Merchandise
description: Katalog merchandise — baca publik, kelola khusus admin.
---

Katalog merchandise (produk satuan). Endpoint baca bersifat **publik**, sedangkan
endpoint tulis (create/update/delete + gambar) hanya untuk role **admin**.

Base path: `/api/v1/merchandise`

## Ringkasan

| Method | Path                        | Auth          | Deskripsi |
|--------|-----------------------------|---------------|-----------|
| GET    | ``                          | —             | Daftar merchandise |
| GET    | `/:id`                      | —             | Detail merchandise + gambar |
| POST   | ``                          | Bearer (admin)| Buat merchandise |
| PATCH  | `/:id`                      | Bearer (admin)| Update merchandise |
| DELETE | `/:id`                      | Bearer (admin)| Hapus merchandise |
| POST   | `/:id/images`               | Bearer (admin)| Tambah gambar |
| DELETE | `/:id/images/:imageId`      | Bearer (admin)| Hapus gambar |

## Daftar merchandise

**GET** `/api/v1/merchandise`

Query parameter:

| Param      | Tipe  | Wajib | Deskripsi |
|------------|-------|-------|-----------|
| `is_active`| bool  | —     | Filter status. **Default `true`** (hanya item aktif) |
| `category` | string| —     | Filter kategori: `t-shirt`, `cap`, `sticker`, `other` |

> Tanpa parameter, endpoint publik ini hanya mengembalikan merchandise **aktif**.
> Kirim `?is_active=false` untuk melihat item yang disembunyikan.

Response **200 OK** — `data` berupa **array polos** (tanpa `meta`):

```json
{
  "status": true,
  "message": "success get list merchandise",
  "data": [
    {
      "id": "6f4b6a5e-7f10-4c6a-9d0a-1f2e3d4c5b6a",
      "name": "Tote Bag TEDx",
      "description": "Tote bag kanvas eksklusif",
      "price": "75000.00",
      "category": "other",
      "is_active": true,
      "created_at": "2026-07-01T10:00:00Z",
      "updated_at": "2026-07-01T10:00:00Z",
      "images": []
    }
  ]
}
```

## Detail merchandise

**GET** `/api/v1/merchandise/:id`

Response **200 OK** — struktur sama dengan item di daftar (termasuk `images`).

Error: `404 Not Found` bila id tidak ada; `400` bila id bukan UUID valid.

## Buat merchandise

**POST** `/api/v1/merchandise` — Bearer (admin)

| Field         | Tipe    | Wajib | Validasi |
|---------------|---------|-------|----------|
| `name`        | string  | ✓     | 1–255 karakter |
| `description` | string  | ✓     | minimal 1 karakter |
| `price`       | string  | ✓     | format desimal, 0 – 99999999.99 |
| `category`    | string  | ✓     | `t-shirt`, `cap`, `sticker`, atau `other` |

```json
{
  "name": "Tote Bag TEDx",
  "description": "Tote bag kanvas eksklusif",
  "price": "75000.00",
  "category": "other"
}
```

Response **201 Created** — `data` berisi merchandise yang dibuat (`is_active` selalu `true`).

Error: `400` bila kategori tidak valid (`category must be t-shirt, cap, sticker, or other`).

## Update merchandise

**PATCH** `/api/v1/merchandise/:id` — Bearer (admin)

Semua field opsional (partial update):

| Field         | Tipe    | Validasi |
|---------------|---------|----------|
| `name`        | string  | 1–255 karakter |
| `description` | string  | minimal 1 karakter |
| `price`       | string  | format desimal, 0 – 99999999.99 |
| `category`    | string  | `t-shirt`, `cap`, `sticker`, atau `other` |
| `is_active`   | bool    | — |

Response **200 OK** — `data` berisi merchandise setelah update.

## Hapus merchandise

**DELETE** `/api/v1/merchandise/:id` — Bearer (admin)

Response **200 OK** — `data: null`. Gambar item ikut terhapus (`ON DELETE CASCADE`).

## Gambar merchandise

### Tambah gambar

**POST** `/api/v1/merchandise/:id/images` — Bearer (admin)

| Field       | Tipe    | Wajib | Validasi |
|-------------|---------|-------|----------|
| `image_url` | string  | ✓     | URL valid |

```json
{
  "image_url": "https://cdn.example.com/tote-bag.jpg"
}
```

Response **201 Created** — `data: null`.

### Hapus gambar

**DELETE** `/api/v1/merchandise/:id/images/:imageId` — Bearer (admin)

Response **200 OK** — `data: null`. Error `400` bila gambar tidak ditemukan.

## Catatan

- `price` dikirim dan dikembalikan sebagai **string** (mis. `"75000.00"`) agar
  presisi uang terjaga di kedua sisi. Kolom DB: `numeric(10,2)`.
- Merchandise selalu dibuat **aktif** — nonaktifkan lewat `PATCH` dengan `is_active: false`.
- Endpoint admin butuh role `admin` (middleware `AuthorizeAdmin` setelah
  `Authenticate`). Token role `user` mendapat `403 Forbidden`.
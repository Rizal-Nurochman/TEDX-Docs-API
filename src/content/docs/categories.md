---
title: Categories
description: Kategori merchandise — baca publik, kelola khusus admin.
---

Kategori untuk merchandise. Satu kategori memiliki banyak merchandise
(`merchandise.category_id`). Endpoint baca bersifat **publik**, sedangkan
endpoint tulis (create/update/delete) hanya untuk role **admin**.

Base path: `/api/v1/categories`

## Ringkasan

| Method | Path   | Auth          | Deskripsi |
|--------|--------|---------------|-----------|
| GET    | ``     | —             | Daftar kategori (alfabetis) |
| GET    | `/:id` | —             | Detail kategori |
| POST   | ``     | Bearer (admin)| Buat kategori |
| PATCH  | `/:id` | Bearer (admin)| Update kategori |
| DELETE | `/:id` | Bearer (admin)| Hapus kategori |

## Daftar kategori

**GET** `/api/v1/categories`

Response **200 OK** — `data` berupa **array polos**:

```json
{
  "status": true,
  "message": "success get list categories",
  "data": [
    {
      "id": "4e78c4ae-6a98-4a11-9bba-240e2fdc7bbe",
      "name": "cap",
      "created_at": "2026-09-06T16:02:12.179712+07:00",
      "updated_at": "2026-09-06T16:02:12.179712+07:00"
    }
  ]
}
```

## Detail kategori

**GET** `/api/v1/categories/:id`

Response **200 OK** — `data` berisi satu objek kategori.

Error: `404 Not Found` bila id tidak ada; `400` bila id bukan UUID valid.

## Buat kategori

**POST** `/api/v1/categories` — Bearer (admin)

| Field  | Tipe   | Wajib | Validasi |
|--------|--------|-------|----------|
| `name` | string | ✓     | 1–50 karakter, unik |

```json
{
  "name": "hoodie"
}
```

Response **201 Created** — `data` berisi kategori yang dibuat.

Error: `400` bila nama sudah dipakai (`category already exists`).

## Update kategori

**PATCH** `/api/v1/categories/:id` — Bearer (admin)

| Field  | Tipe   | Validasi |
|--------|--------|----------|
| `name` | string | 1–50 karakter, unik |

Response **200 OK** — `data` berisi kategori setelah update.

Error: `404` bila kategori tidak ditemukan; `400` bila nama dipakai kategori lain.

## Hapus kategori

**DELETE** `/api/v1/categories/:id` — Bearer (admin)

Response **200 OK** — `data: null`.

Error: `400` bila kategori masih dipakai merchandise
(`category is still used by merchandise`) — pindahkan dulu merchandise ke
kategori lain; `404` bila kategori tidak ditemukan.

## Catatan

- Kategori hanya dipakai domain **merchandise**. Bundle tidak berkategori.
- Kategori bawaan (`t-shirt`, `cap`, `sticker`, `other`) dibuat otomatis saat
  server pertama boot.
- Endpoint admin butuh role `admin` (middleware `AuthorizeAdmin` setelah
  `Authenticate`). Token role `user` mendapat `403 Forbidden`.

---
title: Ticket
description: Tiket acara & tier harga — baca publik, kelola khusus admin.
---

Tiket merepresentasikan **acara** (mis. “TEDx Main Event”), sedangkan **tier** adalah varian harga/kuota (early-bird, regular). Satu tiket memiliki banyak tier. Endpoint baca bersifat **publik**, sedangkan endpoint tulis hanya untuk role **admin**.

Base path: `/api/v1/tickets`

## Ringkasan

| Method | Path                        | Auth          | Deskripsi |
|--------|-----------------------------|---------------|-----------|
| GET    | ``                          | —             | Daftar tiket (default hanya aktif) |
| GET    | `/:id`                      | —             | Detail tiket + tier |
| POST   | ``                          | Bearer (admin)| Buat tiket |
| PATCH  | `/:id`                      | Bearer (admin)| Update tiket |
| DELETE | `/:id`                      | Bearer (admin)| Hapus tiket |
| POST   | `/:id/tiers`                | Bearer (admin)| Buat tier |
| PATCH  | `/:id/tiers/:tierId`        | Bearer (admin)| Update tier |
| DELETE | `/:id/tiers/:tierId`        | Bearer (admin)| Hapus tier |

## Daftar tiket

**GET** `/api/v1/tickets`

Query:

| Param       | Tipe | Wajib | Deskripsi |
|-------------|------|-------|-----------|
| `is_active` | bool | —     | Filter. **Default `true`** bila tidak dikirim |

Response **200 OK** — `data` array:

```json
{
  "status": true,
  "message": "success get list ticket",
  "data": [
    {
      "id": "6f4b...",
      "name": "TEDx Main Event",
      "description": "Acara utama",
      "is_active": true,
      "created_at": "2026-09-20T10:00:00Z",
      "updated_at": "2026-09-20T10:00:00Z",
      "tiers": [
        {
          "id": "a1b2...",
          "ticket_id": "6f4b...",
          "tier": "early-bird",
          "price": "150000.00",
          "quota": 100,
          "quota_filled": 20,
          "quota_held": 5,
          "quota_left": 75,
          "sale_start": "2026-09-01T00:00:00Z",
          "sale_end": "2026-09-10T00:00:00Z",
          "is_active": true,
          "created_at": "...",
          "updated_at": "..."
        }
      ]
    }
  ]
}
```

> `quota_left = quota - quota_filled - quota_held`. `quota_held` = tiket di-hold 15 menit `awaiting_approval`. `quota_filled` = sudah `paid`.

## Detail tiket

**GET** `/api/v1/tickets/:id`

Response **200 OK** — satu objek tiket + `tiers`. Error `404` bila tidak ada.

## Buat tiket

**POST** `/api/v1/tickets` — Bearer (admin)

| Field         | Tipe   | Wajib | Validasi |
|---------------|--------|-------|----------|
| `name`        | string | ✓     | 1–255 |
| `description` | string | ✓     | min 1 |

```json
{"name":"TEDx Main Event","description":"Acara utama"}
```

Response **201** — `is_active` selalu `true`.

## Update tiket

**PATCH** `/api/v1/tickets/:id` — Bearer (admin)

| Field         | Tipe   | Validasi |
|---------------|--------|----------|
| `name`        | string | 1–255 |
| `description` | string | min 1 |
| `is_active`   | bool   | — |

## Hapus tiket

**DELETE** `/api/v1/tickets/:id` — Bearer (admin) → `200`, tier ikut terhapus (`CASCADE`).

## Tier

### Buat tier

**POST** `/api/v1/tickets/:id/tiers` — Bearer (admin)

| Field        | Tipe     | Wajib | Validasi |
|--------------|----------|-------|----------|
| `tier`       | string   | ✓     | 1–50 |
| `price`      | string   | ✓     | 0 – 99999999.99, string |
| `quota`      | int      | ✓     | >=1 |
| `sale_start` | datetime | —     | ISO8601, nullable |
| `sale_end`   | datetime | —     | harus setelah `sale_start` |

Response **201** — tier `is_active true`, `quota_held/quota_filled 0`.

### Update tier

**PATCH** `/api/v1/tickets/:id/tiers/:tierId` — Bearer (admin)

| Field        | Tipe   | Validasi |
|--------------|--------|----------|
| `tier`       | string | 1–50 |
| `price`      | string | 0 – 99999999.99 |
| `quota`      | int    | >= `quota_filled + quota_held` |
| `sale_start` | datetime | — |
| `sale_end`   | datetime | harus setelah `sale_start` |
| `is_active`  | bool   | — |

Error `400` bila `quota < filled+held` atau `sale_end ≤ sale_start`.

### Hapus tier

**DELETE** `/api/v1/tickets/:id/tiers/:tierId` — Bearer (admin) → `200`.

## Catatan

- `price` string (`"150000.00"`) — `numeric(10,2)` di DB, pakai `shopspring/decimal`.
- `GET /tickets` tanpa `is_active` hanya kembalikan `is_active true` — kirim `?is_active=false` untuk lihat hidden.
- `quota_left` sudah kurangi `held` 15 menit — jadi FE lihat sisa real saat war.

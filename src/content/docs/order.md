---
title: Order
description: Transaksi tiket — hold 15 menit, upload bukti, approve manual.
---

Transaksi **manual QRIS static**. Satu order = pembelian satu tier dengan `quantity 1..5`. Saat `POST` sistem **hold** `quota_held += qty` selama 15 menit (`awaiting_approval`). Admin approve → `held → filled` + kirim 1 email berisi N QR. Lewat 15 menit tanpa approve → `expired` otomatis via cron 1 menit.

Base path: `/api/v1/orders`

## Ringkasan

| Method | Path               | Auth          | Deskripsi |
|--------|--------------------|---------------|-----------|
| POST   | ``                 | Bearer (user) | Buat order (hold) |
| GET    | ``                 | Bearer (user) | List order milik user (paginasi) |
| GET    | `/:id`             | Bearer (user) | Detail order milik user |
| PATCH  | `/:id/proof`       | Bearer (user) | Upload bukti bayar (URL screenshot) |
| GET    | `/admin/all`       | Bearer (admin)| List semua order (filter `status`) |
| PATCH  | `/:id/approve`     | Bearer (admin)| Approve → `paid` + email 3 QR |
| PATCH  | `/:id/reject`      | Bearer (admin)| Reject + lepas hold |

## Buat order (hold)

**POST** `/api/v1/orders` — Bearer (user)

```json
{
  "ticket_tier_id": "a1b2c3d4-...",
  "quantity": 3
}
```

| Field            | Tipe  | Wajib | Validasi |
|------------------|-------|-------|----------|
| `ticket_tier_id` | UUID  | ✓     | tier ada, `is_active true`, dalam `sale window` |
| `quantity`       | int   | ✓     | 1–5 |
| `attendees`      | array | —     | opsional, jika diisi harus `len == quantity` (tiap `name/email/phone/audience_type`) |

> Jika `attendees` kosong, 3 tiket dibuat dengan data buyer (`users` table) — 1 buyer 1 email dapat 3 QR di 1 email.

Response **201 Created**:

```json
{
  "status": true,
  "message": "success create order",
  "data": {
    "id": "b2c3...",
    "user_id": "u1...",
    "ticket_tier_id": "a1b2...",
    "order_number": "ORD-20250920-a1b2",
    "quantity": 3,
    "unit_price": "150000.00",
    "total_amount": "450000.00",
    "status": "awaiting_approval",
    "expired_at": "2026-09-20T15:15:00Z",
    "payment_proof_url": null,
    "created_at": "...",
    "attendee_tickets": [
      {"id":"...","ticket_code":"8f3a...","attendee_name":"Budi","attendee_email":"budi@mail.com","audience_type":"umum","is_used":false}
    ]
  }
}
```

Error: `400` `quota exceeded` bila `quota - filled - held < quantity`; `400` `sale not started/ended`; `400` `tier inactive`.

> FE tampilkan **QRIS static** (1 image) + `total_amount` besar + countdown `expired_at - now` + `order_number` setelah ini.

## Upload bukti

**PATCH** `/api/v1/orders/:id/proof` — Bearer (user, owner)

```json
{"payment_proof_url":"https://cdn.example.com/bukti.jpg"}
```

| Field               | Tipe   | Wajib | Validasi |
|---------------------|--------|-------|----------|
| `payment_proof_url` | string | ✓     | URL valid, max 500 |

Error: `404` bila bukan milik user; `400` `order not awaiting approval` bila sudah `paid/rejected/expired`; `400` `order expired` bila lewat `expired_at`.

Response **200** — `data` order dengan `payment_proof_url` terisi.

## List order milik user

**GET** `/api/v1/orders?page=1&per_page=10` — Bearer (user)

Response **200** — `data` array + `meta {page,per_page,max_page,total}`.

## Detail order milik user

**GET** `/api/v1/orders/:id` — Bearer (user, owner) → `200` atau `404` bila bukan milik.

## List semua order (admin)

**GET** `/api/v1/orders/admin/all?status=awaiting_approval&page=1&per_page=10` — Bearer (admin)

| Query    | Tipe   | Deskripsi |
|----------|--------|-----------|
| `status` | string | filter `pending/awaiting_approval/paid/rejected/expired` |
| `page`   | int    | default 1 |
| `per_page`| int   | default 10 |

Response **200** — paginasi + tiap `payment_proof_url` terlihat untuk verifikasi mutasi.

## Approve

**PATCH** `/api/v1/orders/:id/approve` — Bearer (admin)

- Cek `status == awaiting_approval` & `now < expired_at` & `held` cukup → `held -= qty, filled += qty` atomik (`FOR UPDATE`) → `status paid`, `paid_at/approved_by/approved_at` → kirim **1 email** ke buyer berisi list N `ticket_code` + QR base64 (`go-qrcode`).
- Jika `paid` tetap, fallback `GET /orders/:id` bisa ambil QR.

Response **200** — `data` order `status paid` + 3 `ticket_code`.

Error: `400` `order not awaiting approval` (sudah di-approve 2 admin bareng → 1 sukses 1 gagal).

## Reject

**PATCH** `/api/v1/orders/:id/reject` — Bearer (admin)

```json
{"reason":"nominal tidak sesuai mutasi"}
```

→ `held -= qty` → `status rejected` + `rejected_reason`.

## Expiry

Cron 1 menit `ReleaseExpiredHolds()` → `status expired` + `held -= qty`. Tidak perlu trigger manual.

## Catatan

- `unit_price/total_amount` string fixed 2 desimal.
- QRIS static nominal di-input manual buyer — FE harus tampilkan `total_amount` besar, admin cocokkan mutasi `total_amount`.
- 1 akun boleh `1..5` per order, banyak order per tier — `available = quota - filled - held` real-time.
- `payment_proof_url` nullable — approve tetap bisa meski bukti belum upload (cek mutasi cukup), tapi bukti mempercepat verifikasi.

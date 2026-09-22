---
title: Overview
description: Pengenalan singkat REST API backend TEDx Universitas Airlangga.
---

Dokumen ini adalah referensi untuk tim **frontend** saat mengkonsumsi REST API
backend TEDx Universitas Airlangga. Berisi daftar route, kontrak request/response,
dan cara autentikasi.

> Dokumentasi ini hanya mencakup endpoint yang **sudah selesai dan berjalan** di
> backend. Fitur yang belum ada tidak didokumentasikan.

## Base URL

Semua endpoint berada di bawah base path:

```
/api/v1
```

Contoh URL lengkap (dev default):

```
http://localhost:8888/api/v1/auth/login
```

:::note[Port]
Default port server adalah `8888` (variabel `GOLANG_PORT`). Sesuaikan dengan
environment yang dipakai tim frontend.
:::

## Konten

Hampir semua request menggunakan JSON. Pastikan menyertakan header:

```
Content-Type: application/json
```

Response selalu dibungkus dalam satu format envelope yang konsisten — lihat
halaman [Format Respon & Error](/response-format/).

## Group Endpoint

| Group       | Base path              | Auth  |
|-------------|------------------------|-------|
| Auth        | `/api/v1/auth`         | Sebagian |
| Bundle      | `/api/v1/bundles`      | Baca publik, tulis admin |
| Merchandise | `/api/v1/merchandise`  | Baca publik, tulis admin |
| Categories  | `/api/v1/categories`   | Baca publik, tulis admin |
| Ticket      | `/api/v1/tickets`      | Baca publik, tulis admin |
| Order       | `/api/v1/orders`       | User & Admin |
| User        | `/api/v1/users`        | Admin |

## Ringkasan Route

### Auth — `/api/v1/auth`

| Method | Path                        | Auth    | Deskripsi |
|--------|-----------------------------|---------|-----------|
| POST   | `/register`                 | —       | Daftar akun baru |
| POST   | `/login`                    | —       | Login, dapat access + refresh token |
| POST   | `/refresh`                  | —       | Rotasi refresh token |
| POST   | `/logout`                   | Bearer  | Revoke semua refresh token user |
| POST   | `/send-verification-email`  | —       | Kirim OTP verifikasi (6 digit) |
| POST   | `/verify-email`             | —       | Verifikasi email dengan OTP |
| POST   | `/send-password-reset`      | —       | Kirim token reset password |
| POST   | `/reset-password`           | —       | Set password baru dengan token |

### Bundle — `/api/v1/bundles`

| Method | Path                        | Auth          | Deskripsi |
|--------|-----------------------------|---------------|-----------|
| GET    | ``                          | —             | Daftar bundle (filter `is_active`) |
| GET    | `/:id`                      | —             | Detail bundle + gambar |
| POST   | ``                          | Bearer (admin)| Buat bundle |
| PATCH  | `/:id`                      | Bearer (admin)| Update bundle |
| DELETE | `/:id`                      | Bearer (admin)| Hapus bundle |
| POST   | `/:id/images`               | Bearer (admin)| Tambah gambar |
| DELETE | `/:id/images/:imageId`      | Bearer (admin)| Hapus gambar |

### Merchandise — `/api/v1/merchandise`

| Method | Path                        | Auth          | Deskripsi |
|--------|-----------------------------|---------------|-----------|
| GET    | ``                          | —             | Daftar merchandise (filter `is_active`, `category_id`) |
| GET    | `/:id`                      | —             | Detail merchandise + gambar |
| POST   | ``                          | Bearer (admin)| Buat merchandise |
| PATCH  | `/:id`                      | Bearer (admin)| Update merchandise |
| DELETE | `/:id`                      | Bearer (admin)| Hapus merchandise |
| POST   | `/:id/images`               | Bearer (admin)| Tambah gambar |
| DELETE | `/:id/images/:imageId`      | Bearer (admin)| Hapus gambar |

### Categories — `/api/v1/categories`

| Method | Path   | Auth          | Deskripsi |
|--------|--------|---------------|-----------|
| GET    | ``     | —             | Daftar kategori |
| GET    | `/:id` | —             | Detail kategori |
| POST   | ``     | Bearer (admin)| Buat kategori |
| PATCH  | `/:id` | Bearer (admin)| Update kategori |
| DELETE | `/:id` | Bearer (admin)| Hapus kategori |

### Ticket — `/api/v1/tickets`

| Method | Path                        | Auth          | Deskripsi |
|--------|-----------------------------|---------------|-----------|
| GET    | ``                          | —             | Daftar tiket (default hanya aktif) |
| GET    | `/:id`                      | —             | Detail tiket + tier |
| POST   | ``                          | Bearer (admin)| Buat tiket |
| PATCH  | `/:id`                      | Bearer (admin)| Update tiket |
| DELETE | `/:id`                      | Bearer (admin)| Hapus tiket |
| POST   | `/:id/tiers`                | Bearer (admin)| Buat tier (harga/kuota) |
| PATCH  | `/:id/tiers/:tierId`        | Bearer (admin)| Update tier |
| DELETE | `/:id/tiers/:tierId`        | Bearer (admin)| Hapus tier |

### Order — `/api/v1/orders`

| Method | Path                        | Auth          | Deskripsi |
|--------|-----------------------------|---------------|-----------|
| POST   | ``                          | Bearer (user) | Buat order (hold 15 menit) |
| GET    | ``                          | Bearer (user) | Daftar order milik user |
| GET    | `/:id`                      | Bearer (user) | Detail order milik user |
| PATCH  | `/:id/proof`                | Bearer (user) | Upload bukti bayar (URL screenshot) |
| GET    | `/admin/all`                | Bearer (admin)| Daftar semua order (filter status) |
| PATCH  | `/:id/approve`              | Bearer (admin)| Approve → jadi paid + kirim email 3 QR |
| PATCH  | `/:id/reject`               | Bearer (admin)| Reject + lepas hold |

### User — `/api/v1/users`

| Method | Path   | Auth          | Deskripsi |
|--------|--------|---------------|-----------|
| GET    | ``     | Bearer (admin)| Daftar user (paginasi + filter) |
| GET    | `/:id` | Bearer (admin)| Detail user |
| PATCH  | `/:id` | Bearer (admin)| Update user (termasuk role) |
| DELETE | `/:id` | Bearer (admin)| Hapus user |

## Role

Setiap user punya role yang dibawa di dalam token:

- `user` — default untuk akun baru. Bisa mengakses endpoint publik dan endpoint
  yang butuh login biasa.
- `admin` — role untuk akses administratif. Endpoint tulis Bundle & Merchandise
  serta seluruh endpoint User **hanya** bisa diakses dengan role ini. Token role
  `user` yang memanggil endpoint admin mendapat `403 Forbidden`.

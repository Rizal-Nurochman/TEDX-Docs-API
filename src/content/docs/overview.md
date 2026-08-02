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

| Group  | Base path            | Auth  |
|--------|----------------------|-------|
| Auth   | `/api/v1/auth`       | Sebagian |

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

## Role

Setiap user punya role yang dibawa di dalam token:

- `user` — default untuk akun baru.
- `admin` — role untuk akses administratif (belum ada endpoint khusus yang memanfaatkannya).

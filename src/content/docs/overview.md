---
title: Overview
description: Pengenalan singkat REST API backend TEDx Universitas Airlangga.
hero:
  title: TEDx Unair API Docs
  tagline: Referensi REST API backend TEDx Universitas Airlangga untuk tim frontend. Daftar route, kontrak request/response, dan cara autentikasi dalam satu tempat.
  actions:
    - text: Mulai
      icon: rocket
      link: /authentication/
      variant: primary
    - text: Lihat Endpoint
      icon: list-format
      link: /auth/register/
---

Dokumen ini adalah referensi untuk tim **frontend** saat mengkonsumsi REST API
backend TEDx Universitas Airlangga.

:::note
Dokumentasi ini hanya mencakup endpoint yang **sudah selesai dan berjalan** di
backend. Fitur yang belum ada tidak didokumentasikan.
:::

## Explore by group

<div class="card-grid">

<a class="card" href="/auth/register/">
  <div class="card-icon">🔐</div>
  <div class="card-body">
    <h3>Auth</h3>
    <p>Register, login, refresh token, logout, verifikasi email, dan reset password.</p>
  </div>
</a>

<a class="card" href="/response-format/">
  <div class="card-icon">📦</div>
  <div class="card-body">
    <h3>Format Respon</h3>
    <p>Envelope respons standar dan konvensi status HTTP.</p>
  </div>
</a>

<a class="card" href="/authentication/">
  <div class="card-icon">🔑</div>
  <div class="card-body">
    <h3>Autentikasi</h3>
    <p>Cara memakai access token JWT dan refresh token.</p>
  </div>
</a>
</div>

## Key concepts

- **Base URL** — semua endpoint berada di bawah `/api/v1`.
- **Envelope** — setiap respons dibungkus `{ status, message, data, error, meta }`.
- **Access token** — JWT HS256, berlaku 15 menit, dikirim via header `Authorization: Bearer`.
- **Refresh token** — token opaque, berlaku 7 hari, dirotasi lewat `/auth/refresh`.
- **Scope per user** — `user_id` diambil dari token, bukan dari body request.

## Base URL

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
---
title: Format Respon & Error
description: Envelope respon standar dan konvensi status HTTP.
---

Semua endpoint mengembalikan **envelope respons yang sama**. Ini membantu tim
frontend membuat satu helper fetch yang seragam.

## Envelope

```json
{
  "status": true,
  "message": "success login",
  "data": {},
  "error": "",
  "meta": {}
}
```

| Field     | Tipe  | Deskripsi                                              |
|-----------|-------|--------------------------------------------------------|
| `status`  | bool  | `true` sukses, `false` gagal.                          |
| `message` | string| Pesan singkat hasil operasi.                           |
| `data`    | any   | Payload utama (objek / array).                         |
| `error`   | string| Pesan error, hanya ada saat gagal.                     |
| `meta`    | any   | Metadata tambahan (mis. paginasi).                     |

:::note
Field `error` dan `meta` hanya muncul saat relevan (bertanda `omitempty` dalam
implementasi). Saat sukses, `error` umumnya tidak ada; saat ber-paginasi, `meta`
muncul.
:::

## Status HTTP

Konvensi status HTTP yang dipakai:

| Kasus                    | Status                                  |
|--------------------------|-----------------------------------------|
| Create sukses            | `201 Created`                           |
| Baca/update/delete sukses| `200 OK`                                |
| Data tidak ditemukan     | `404 Not Found`                         |
| Input tidak valid        | `400 Bad Request` (body bind gagal)     |
| Error bisnis (mis. email sudah dipakai) | `400 Bad Request`        |
| Token tidak valid / login gagal | `401 Unauthorized`           |

## Contoh sukses

Daftar todo:

```json
{
  "status": true,
  "message": "success get list todo",
  "data": {
    "data": [
      {
        "id": "6f4b6a5e-...",
        "name": "Belajar Go",
        "category": "belajar",
        "is_done": false,
        "created_at": "2026-07-01T10:00:00Z",
        "updated_at": "2026-07-01T10:00:00Z"
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

## Contoh gagal

```json
{
  "status": false,
  "message": "failed login",
  "error": "invalid credentials",
  "data": null
}
```

:::tip[Saran untuk frontend]
Jadikan envelope ini dasar satu fungsi `Fetch` bawaan. Kontrol alur berdasarkan
`status`, bukan status HTTP saja, agar penanganan error konsisten di semua halaman.
:::

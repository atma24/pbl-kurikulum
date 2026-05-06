# [RESTRICTED] Developer API Secrets & Backdoor

Dokumen ini DIBLOKIR oleh `.gitignore` dan TIDAK BOLEH di-commit ke repositori utama. Dokumen ini memuat kunci bypass untuk pengujian sistem (Headless API).

## Endpoint: Spawn Admin (Bypass UI)
*   **Tujuan:** Membuat akun Kaprodi/Admin secara instan tanpa melewati otentikasi login.
*   **Method:** `POST`
*   **URL:** `http://[SERVER_IP]/api/v1/_debug/spawn-admin`

## Headers (Security Gate)
*   `X-DEV-TOKEN`: `POLMAN-TRIN-DEV-99`
*   `Accept`: `application/json`

## Payload JSON (Body)
```json
{
    "name": "Super Admin KPS",
    "email": "kps.admin@polman-bandung.ac.id",
    "nip": "19999999",
    "password": "sandi-rahasia"
}
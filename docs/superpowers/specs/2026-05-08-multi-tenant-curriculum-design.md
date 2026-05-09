# Multi-Tenant Curriculum Portal Design

## Goal
Turn existing single-database Laravel/Inertia curriculum app into multi-tenant app where each program study tenant has its own database, selected by subdomain.

## Tenant Access
Landing page shows four login buttons and removes public registration:

- TRIN -> `trin.localhost:8000/login`
- TRO -> `tro.localhost:8000/login`
- TRMO -> `trmo.localhost:8000/login`
- TRSA -> `trsa.localhost:8000/login`

URLs are generated from current protocol and port so local and hosted environments can share same component logic.

## Tenancy Architecture
Use `stancl/tenancy` with domain-based tenant identification. Central/landlord routes handle root landing page and landlord-only data. Tenant routes are served on tenant subdomains and initialize tenant database before auth and app routes run.

## Database Split
Landlord database stores only shared tenant metadata and shared lecturer biodata:

- `tenants`
- `domains`
- `prodis`
- `dosen_biodatas`

Tenant databases store auth, roles, permissions, curriculum, and RPS data:

- `users`
- `cache`
- `jobs`
- `permission_tables`
- `personal_access_tokens`
- user profile fields and `dosen_biodata_id`
- `cpls`, `ieas`, `ppms`, `mata_kuliahs`
- `cpl_iea`, `cpl_ppm`, `ppm_iea`, `mk_cpl`
- `cpmks`, `indikator_kinerjas`, `ik_cpmk`, `cpmk_indikator_kinerja`
- `rps` and related RPS update/detail/penilaian migrations
- `dosen_biodata_mata_kuliah`

`dosen_biodata_id` points to landlord `dosen_biodatas.id` without cross-database foreign key constraints. Laravel code validates and loads biodata from landlord connection.

## Auth Model
Each tenant has its own `users` table. Same email can exist in different tenant databases as separate accounts. Login happens inside tenant context, so accounts do not automatically work across tenants.

## Routing
Central routes:

- `/` landing page
- tenant metadata management later if needed

Tenant routes:

- `/login`
- `/dashboard`
- profile
- RPS
- matrix
- master data

Existing authenticated routes move into tenant route group.

## Seed Data
Create four tenants:

- `trin` / TRIN / database `kurikulum_trin`
- `tro` / TRO / database `kurikulum_tro`
- `trmo` / TRMO / database `kurikulum_trmo`
- `trsa` / TRSA / database `kurikulum_trsa`

Each tenant gets its own roles and accounts through tenant seeders.

## Testing
Verify:

- root landing page renders four tenant login buttons and no register button
- tenant URLs resolve from subdomains
- tenant auth tables migrate in tenant DB
- landlord `dosen_biodatas` remains central
- tenant user can reference landlord `dosen_biodata_id`

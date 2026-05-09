# Multi-Tenant Curriculum Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add subdomain-based multi-tenancy where each prodi has its own tenant database and shared lecturer biodata stays in landlord database.

**Architecture:** Use `stancl/tenancy` for domain identification and tenant database switching. Landlord keeps tenant/domain/prodi metadata and `dosen_biodatas`; tenant databases keep auth, permissions, curriculum, and RPS tables.

**Tech Stack:** Laravel 12, Inertia React, TypeScript, MySQL/MariaDB, `stancl/tenancy`, Spatie Permission, Sanctum.

---

## File Structure

- Modify `composer.json`: add `stancl/tenancy` through Composer.
- Create `config/tenancy.php`: tenancy bootstrappers, tenant model, migration paths.
- Modify `config/database.php`: add `central` connection alias and tenant connection template if published config needs it.
- Create `app/Models/Tenant.php`: tenant model extending Stancl tenant model.
- Create `app/Models/Domain.php` if needed by package conventions.
- Create `app/Models/Prodi.php`: landlord prodi metadata.
- Modify `app/Models/DosenBiodata.php`: force landlord connection.
- Modify `app/Models/User.php`: tenant user remains tenant connection; relation to landlord biodata uses manual relation method/query.
- Create `routes/tenant.php`: tenant route group for auth and app routes.
- Modify `routes/web.php`: keep only central landing route and central routes.
- Move tenant migrations into `database/migrations/tenant/`.
- Keep landlord migrations in `database/migrations/` only for landlord tables.
- Create landlord migrations for `prodis` and tenancy tables after package publish.
- Create tenant seeders for roles and starter accounts.
- Modify `resources/js/Pages/Welcome.tsx`: remove register button and add four tenant login buttons.
- Add/modify tests under `tests/Feature/` for landing buttons and tenancy routing.

## Tasks

### Task 1: Install tenancy package

**Files:**
- Modify: `composer.json`
- Modify: `composer.lock`

- [ ] Run package install

```powershell
composer require stancl/tenancy
```

Expected: Composer installs `stancl/tenancy` and updates lockfile.

- [ ] Publish package assets

```powershell
php artisan tenancy:install
```

Expected: tenancy config, migrations, and routes support files are generated.

- [ ] Commit

```powershell
git add composer.json composer.lock config/tenancy.php database/migrations routes/tenant.php
git commit -m "feat: install tenancy package"
```

### Task 2: Configure tenant model and central domains

**Files:**
- Create/Modify: `app/Models/Tenant.php`
- Modify: `config/tenancy.php`
- Modify: `.env.example`

- [ ] Set tenant model

```php
<?php

namespace App\Models;

use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains;
}
```

- [ ] Update `config/tenancy.php`

```php
'tenant_model' => App\Models\Tenant::class,
'id_generator' => Stancl\Tenancy\UUIDGenerator::class,
'central_domains' => [
    'localhost',
    '127.0.0.1',
],
```

- [ ] Add env example values

```dotenv
APP_URL=http://localhost:8000
SESSION_DOMAIN=.localhost
```

- [ ] Run config check

```powershell
php artisan config:clear
php artisan config:show tenancy
```

Expected: command prints tenancy config with `App\Models\Tenant`.

- [ ] Commit

```powershell
git add app/Models/Tenant.php config/tenancy.php .env.example
git commit -m "feat: configure tenant model"
```

### Task 3: Split central and tenant routes

**Files:**
- Modify: `routes/web.php`
- Create/Modify: `routes/tenant.php`
- Modify: `bootstrap/app.php` if route loading is not registered by package install.

- [ ] Keep central route in `routes/web.php`

```php
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => false,
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
```

- [ ] Put existing auth/app routes in `routes/tenant.php`

```php
<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    require __DIR__.'/auth.php';

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // Move existing role-protected curriculum routes here unchanged.
});
```

- [ ] Run route list

```powershell
php artisan route:list
```

Expected: root `/` exists in central routes; auth/dashboard routes load from tenant route file.

- [ ] Commit

```powershell
git add routes/web.php routes/tenant.php bootstrap/app.php
git commit -m "feat: split central and tenant routes"
```

### Task 4: Split migrations

**Files:**
- Move: tenant migrations into `database/migrations/tenant/`
- Keep: landlord migrations in `database/migrations/`
- Create: `database/migrations/*_create_prodis_table.php`

- [ ] Keep landlord migrations in `database/migrations/`

```text
0001_01_01_000001_create_cache_table.php
0001_01_01_000002_create_jobs_table.php
tenancy package tenant/domain migrations
2026_05_07_000001_create_dosen_biodatas_table.php
create_prodis_table.php
```

- [ ] Move tenant migrations to `database/migrations/tenant/`

```text
0001_01_01_000000_create_users_table.php
2026_05_05_120858_create_permission_tables.php
2026_05_05_134042_create_personal_access_tokens_table.php
2026_05_05_103945_add_profile_fields_to_users_table.php
2026_05_05_112749_rename_signature_path_to_nip_in_users_table.php
2026_05_07_000002_add_dosen_biodata_id_to_users_table.php
all CPL/IEA/PPM/MK/CPMK/IK/matrix/RPS migrations
2026_05_07_200000_create_dosen_biodata_mata_kuliah_table.php
```

- [ ] Create `prodis` migration

```php
Schema::create('prodis', function (Blueprint $table) {
    $table->id();
    $table->string('kode')->unique();
    $table->string('nama');
    $table->string('tenant_id')->nullable()->index();
    $table->timestamps();
});
```

- [ ] Remove FK constraints from tenant migrations that reference landlord `dosen_biodatas`

```php
$table->unsignedBigInteger('dosen_biodata_id')->nullable()->index();
```

- [ ] Run fresh migrations on empty local databases

```powershell
php artisan migrate:fresh
php artisan tenants:migrate
```

Expected: landlord has `tenants`, `domains`, `prodis`, `dosen_biodatas`; tenant DBs have auth, curriculum, RPS tables.

- [ ] Commit

```powershell
git add database/migrations
git commit -m "feat: split landlord and tenant migrations"
```

### Task 5: Seed tenants and domains

**Files:**
- Create: `database/seeders/TenantSeeder.php`
- Modify: `database/seeders/DatabaseSeeder.php`

- [ ] Create four tenants

```php
$tenants = [
    ['id' => 'trin', 'domain' => 'trin.localhost', 'kode' => 'TRIN', 'nama' => 'Teknik Rekayasa Informatika Industri'],
    ['id' => 'tro', 'domain' => 'tro.localhost', 'kode' => 'TRO', 'nama' => 'Teknik Rekayasa Otomasi'],
    ['id' => 'trmo', 'domain' => 'trmo.localhost', 'kode' => 'TRMO', 'nama' => 'Teknik Rekayasa Manufaktur Otomasi'],
    ['id' => 'trsa', 'domain' => 'trsa.localhost', 'kode' => 'TRSA', 'nama' => 'Teknik Rekayasa Sistem Agrikultur'],
];

foreach ($tenants as $item) {
    $tenant = \App\Models\Tenant::firstOrCreate(['id' => $item['id']]);
    $tenant->domains()->firstOrCreate(['domain' => $item['domain']]);
    \App\Models\Prodi::updateOrCreate(
        ['kode' => $item['kode']],
        ['nama' => $item['nama'], 'tenant_id' => $tenant->id]
    );
}
```

- [ ] Run seeder

```powershell
php artisan db:seed --class=TenantSeeder
```

Expected: four tenants and domains exist in landlord DB.

- [ ] Commit

```powershell
git add database/seeders
git commit -m "feat: seed prodi tenants"
```

### Task 6: Update models for landlord biodata

**Files:**
- Modify: `app/Models/DosenBiodata.php`
- Modify: `app/Models/User.php`

- [ ] Force landlord connection on biodata

```php
protected $connection = 'central';
```

- [ ] Replace cross-DB belongsTo usage in `User` with explicit lookup

```php
public function getDosenBiodataAttribute(): ?DosenBiodata
{
    if (! $this->dosen_biodata_id) {
        return null;
    }

    return DosenBiodata::query()->find($this->dosen_biodata_id);
}
```

- [ ] Run PHP tests

```powershell
php artisan test
```

Expected: tests pass or fail only where old cross-DB FK assumptions exist.

- [ ] Commit

```powershell
git add app/Models/DosenBiodata.php app/Models/User.php
git commit -m "feat: link tenant users to landlord biodata"
```

### Task 7: Update landing page tenant login buttons

**Files:**
- Modify: `resources/js/Pages/Welcome.tsx`

- [ ] Add tenant list and URL builder

```tsx
const tenants = ['TRIN', 'TRO', 'TRMO', 'TRSA'];

function tenantLoginUrl(code: string) {
    if (typeof window === 'undefined') {
        return '/login';
    }

    const tenant = code.toLowerCase();
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
    const hostname = window.location.hostname;
    const baseDomain = hostname.split('.').slice(-2).join('.') || hostname;
    const domain = hostname === 'localhost' || hostname === '127.0.0.1' ? 'localhost' : baseDomain;

    return `${protocol}//${tenant}.${domain}${port}/login`;
}
```

- [ ] Remove register link and replace login buttons

```tsx
{tenants.map((tenant) => (
    <a key={tenant} href={tenantLoginUrl(tenant)} className="inline-flex items-center gap-2 bg-aqua-200 text-aqua-800 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-aqua-300 transition-colors shadow-sm shadow-aqua-300/40 active:scale-95 border border-aqua-300/50">
        {tenant}
    </a>
))}
```

- [ ] Run frontend build

```powershell
npm run build
```

Expected: TypeScript and Vite build pass.

- [ ] Commit

```powershell
git add resources/js/Pages/Welcome.tsx
git commit -m "feat: add tenant login buttons"
```

### Task 8: Verify full flow

**Files:**
- No source changes unless failures found.

- [ ] Clear config and routes

```powershell
php artisan optimize:clear
```

Expected: caches clear successfully.

- [ ] Run backend tests

```powershell
php artisan test
```

Expected: passing test suite after tenancy adjustments.

- [ ] Run frontend build

```powershell
npm run build
```

Expected: build passes.

- [ ] Manual browser checks

```text
http://localhost:8000
http://trin.localhost:8000/login
http://tro.localhost:8000/login
http://trmo.localhost:8000/login
http://trsa.localhost:8000/login
```

Expected: root shows landing page; tenant subdomains show login page initialized in tenant context.

- [ ] Commit verification fixes

```powershell
git add .
git commit -m "fix: stabilize tenant setup"
```

## Self-Review

Spec coverage: plan covers subdomain tenant selection, `stancl/tenancy`, landlord/tenant migration split, tenant-local auth, landlord biodata, and landing page login buttons.

Placeholder scan: no TBD/TODO placeholders remain; implementation snippets are explicit.

Type consistency: tenant codes are uppercase in UI and lowercase in domains; `dosen_biodata_id` remains unsigned bigint without cross-database FK.

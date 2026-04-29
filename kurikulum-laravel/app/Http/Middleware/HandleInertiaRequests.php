<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                // Sihir RBAC: Mengirim gelar dan hak akses ke Frontend
                'roles' => $request->user() ? $request->user()->getRoleNames() : [],
                'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name') : [],
            ],
            // SIHIR MULTI-TENANT: Mengirim ID wilayah (trin, tro, trmo) atau null jika di pusat
            'tenant_id' => tenant('id'), 
        ];
    }
}
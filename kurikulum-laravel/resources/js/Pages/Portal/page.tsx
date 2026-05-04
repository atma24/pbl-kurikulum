import React from 'react';

// --- DEFINISI TIPE DATA ---
interface Domain {
    id: number;
    domain: string;
    tenant_id: string;
}

interface Tenant {
    id: string;
    domains: Domain[];
    // Jika nanti teman Anda menambahkan field 'nama_prodi' di database, tambahkan di sini.
}

interface PortalProps {
    tenants: Tenant[];
}

export default function Portal({ tenants }: PortalProps) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
                Portal Kurikulum IABEE
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {tenants.map((tenant) => {
                    // Ekstraksi domain. Asumsi 1 prodi memiliki 1 domain utama.
                    const domainStr = tenant.domains[0]?.domain;
                    
                    // Konstruksi URL absolut (wajib mengarah ke port 8000 dan halaman login)
                    const targetUrl = domainStr ? `http://${domainStr}:8000/login` : '#';

                    // Karena struktur data saat ini baru memiliki ID, kita manipulasi ID menjadi nama.
                    // Contoh: 'trin' menjadi 'TRIN'.
                    const namaProdi = tenant.id.toUpperCase();

                    return (
                        <a
                            key={tenant.id}
                            href={targetUrl}
                            className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600 flex flex-col items-center justify-center text-center group"
                        >
                            <span className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                Prodi {namaProdi}
                            </span>
                            <span className="text-sm text-gray-500 mt-3">
                                Akses Dashboard Manajemen
                            </span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
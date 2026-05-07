import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Shortcut {
    label: string;
    href: string;
    description?: string;
}

interface KaprodiItem {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
    semester: string;
    jenis: string;
    cpls_count: number;
    cpmks_count: number;
    dosen_pengampus_count: number;
    rps_count: number;
    dosen_pengampus: { id: number; nama: string }[];
}

interface DosenItem {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
    semester: string;
    jenis: string;
    cpls_count: number;
    cpmks_count: number;
    rps_status: string;
    rps_id: number | null;
}

interface DashboardProps {
    dashboardRole: 'kaprodi' | 'dosen' | 'default';
    stats: Record<string, number>;
    coverage?: Record<string, number>;
    items: any[];
    shortcuts: Shortcut[];
    warning?: string;
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function StatCard({ label, value, suffix, color = 'primary' }: {
    label: string; value: number | string; suffix?: string;
    color?: 'primary' | 'secondary' | 'teal' | 'amber';
}) {
    const bgMap = {
        primary: 'bg-polman-primary',
        secondary: 'bg-polman-secondary',
        teal: 'bg-teal-600',
        amber: 'bg-amber-500',
    };
    return (
        <div className={`relative overflow-hidden rounded-2xl h-36 p-6 flex flex-col justify-between shadow-lg ${bgMap[color]}`}>
            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">{label}</p>
            <div className="flex items-baseline gap-2">
                <h2 className="text-5xl font-black italic tracking-tighter text-white">{value}</h2>
                {suffix && <span className="text-white/60 text-sm font-bold">{suffix}</span>}
            </div>
        </div>
    );
}

function CoverageCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-36">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            <div>
                <div className="flex items-baseline gap-1">
                    <span className="font-headline text-4xl font-bold text-gray-900">{value}</span>
                    <span className="text-sm text-gray-500 font-bold">%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full mt-3">
                    <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                            width: `${value}%`,
                            background: value >= 80
                                ? 'linear-gradient(90deg, #008B8B, #2dce89)'
                                : value >= 50
                                    ? 'linear-gradient(90deg, #f59e0b, #eab308)'
                                    : 'linear-gradient(90deg, #ef4444, #f97316)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

function ShortcutGrid({ shortcuts }: { shortcuts: Shortcut[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shortcuts.map((s) => (
                <Link
                    key={s.href}
                    href={s.href}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-polman-primary hover:shadow-md transition-all group"
                >
                    <p className="text-sm font-bold text-gray-900 group-hover:text-polman-primary transition-colors">{s.label}</p>
                    {s.description && (
                        <p className="text-[11px] text-gray-400 mt-1 leading-snug">{s.description}</p>
                    )}
                </Link>
            ))}
        </div>
    );
}

function RpsStatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        'Lengkap': 'bg-green-50 text-green-700 border-green-200',
        'Perlu Dilengkapi': 'bg-amber-50 text-amber-700 border-amber-200',
        'Belum Ada': 'bg-gray-50 text-gray-500 border-gray-200',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${map[status] ?? map['Belum Ada']}`}>
            {status}
        </span>
    );
}

// ─── Kaprodi Dashboard ────────────────────────────────────────────────────────

function KaprodiDashboard({ stats, coverage, items, shortcuts }: {
    stats: Record<string, number>;
    coverage: Record<string, number>;
    items: KaprodiItem[];
    shortcuts: Shortcut[];
}) {
    const { user } = usePage().props.auth as any;
    const [search, setSearch] = useState('');

    const filtered = items.filter((mk) =>
        mk.kode_mk.toLowerCase().includes(search.toLowerCase()) ||
        mk.nama_mk.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight font-headline">
                    Dashboard <span className="text-polman-primary">Kaprodi</span>
                </h1>
                <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">
                    Selamat datang, {user?.name}
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatCard label="Total Mata Kuliah" value={stats.total_mk} color="primary" />
                <StatCard label="Total CPL" value={stats.total_cpl} color="secondary" />
                <StatCard label="Total CPMK" value={stats.total_cpmk} color="teal" />
                <StatCard label="Total RPS" value={stats.total_rps} color="primary" />
                <StatCard label="Total Dosen" value={stats.total_dosen} color="secondary" />
            </div>

            {/* Coverage Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CoverageCard label="OBE Coverage (MK-CPL)" value={coverage.obe ?? 0} />
                <CoverageCard label="RPS Coverage" value={coverage.rps ?? 0} />
                <CoverageCard label="Dosen Assignment" value={coverage.dosen_assignment ?? 0} />
            </div>

            {/* Shortcuts */}
            <div>
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Akses Cepat</h2>
                <ShortcutGrid shortcuts={shortcuts} />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="font-headline font-bold text-gray-900">Ringkasan Mata Kuliah</h2>
                    <div className="relative">
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari mata kuliah..."
                            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-gray-50 focus:outline-none focus:border-polman-primary w-56"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Kode</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Mata Kuliah</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">SKS</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Smt</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">CPL</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">CPMK</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Dosen</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">RPS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length > 0 ? filtered.map((mk) => (
                                <tr key={mk.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono font-bold text-polman-primary">{mk.kode_mk}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-900">{mk.nama_mk}</p>
                                        {mk.dosen_pengampus.length > 0 && (
                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                {mk.dosen_pengampus.map((d) => d.nama).join(', ')}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-700 text-center">{mk.sks}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500 text-center">{mk.semester}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${mk.cpls_count > 0 ? 'bg-polman-primary/10 text-polman-primary' : 'bg-gray-100 text-gray-400'}`}>
                                            {mk.cpls_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${mk.cpmks_count > 0 ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-400'}`}>
                                            {mk.cpmks_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${mk.dosen_pengampus_count > 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                                            {mk.dosen_pengampus_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <RpsStatusBadge status={mk.rps_count > 0 ? 'Lengkap' : 'Belum Ada'} />
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center text-gray-400 font-bold italic text-sm">
                                        {search ? 'Tidak ada mata kuliah yang cocok.' : 'Belum ada data mata kuliah.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ─── Dosen Dashboard ──────────────────────────────────────────────────────────

function DosenDashboard({ stats, items, shortcuts, warning }: {
    stats: Record<string, number>;
    items: DosenItem[];
    shortcuts: Shortcut[];
    warning?: string;
}) {
    const { user } = usePage().props.auth as any;
    const [search, setSearch] = useState('');

    const filtered = items.filter((mk) =>
        mk.kode_mk.toLowerCase().includes(search.toLowerCase()) ||
        mk.nama_mk.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight font-headline">
                    Dashboard <span className="text-polman-primary">Dosen</span>
                </h1>
                <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">
                    Selamat datang, {user?.name}
                </p>
            </div>

            {/* Warning */}
            {warning && (
                <div className="flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                        <p className="text-sm font-bold text-amber-800">Perhatian</p>
                        <p className="text-sm text-amber-700 mt-0.5">{warning}</p>
                    </div>
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Mata Kuliah Diampu" value={stats.mk_diampu} color="primary" />
                <StatCard label="RPS Saya" value={stats.rps_saya} color="teal" />
                <StatCard label="CPMK Terkait" value={stats.cpmk_terkait} color="secondary" />
                <StatCard
                    label="RPS Perlu Dilengkapi"
                    value={stats.rps_perlu_lengkap}
                    color={stats.rps_perlu_lengkap > 0 ? 'amber' : 'primary'}
                />
            </div>

            {/* Shortcuts */}
            <div>
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Akses Cepat</h2>
                <ShortcutGrid shortcuts={shortcuts} />
            </div>

            {/* Table */}
            {!warning && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                        <h2 className="font-headline font-bold text-gray-900">Mata Kuliah Yang Diampu</h2>
                        <div className="relative">
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari mata kuliah..."
                                className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-gray-50 focus:outline-none focus:border-polman-primary w-56"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Kode</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Nama Mata Kuliah</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">SKS</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Smt</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">CPL</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">CPMK</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status RPS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.length > 0 ? filtered.map((mk) => (
                                    <tr key={mk.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono font-bold text-polman-primary">{mk.kode_mk}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{mk.nama_mk}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-700 text-center">{mk.sks}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500 text-center">{mk.semester}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${mk.cpls_count > 0 ? 'bg-polman-primary/10 text-polman-primary' : 'bg-gray-100 text-gray-400'}`}>
                                                {mk.cpls_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${mk.cpmks_count > 0 ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-400'}`}>
                                                {mk.cpmks_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <RpsStatusBadge status={mk.rps_status} />
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16 text-center text-gray-400 font-bold italic text-sm">
                                            {search ? 'Tidak ada mata kuliah yang cocok.' : 'Belum ada mata kuliah yang diampu.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Default Dashboard ────────────────────────────────────────────────────────

function DefaultDashboard() {
    const { user } = usePage().props.auth as any;
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight font-headline">Dashboard</h1>
                <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">
                    Selamat datang, {user?.name}
                </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500 text-sm">
                    Dashboard untuk role Anda sedang dalam pengembangan.
                </p>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard({
    dashboardRole = 'default',
    stats = {},
    coverage = {},
    items = [],
    shortcuts = [],
    warning,
}: DashboardProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {dashboardRole === 'kaprodi' && (
                <KaprodiDashboard
                    stats={stats}
                    coverage={coverage ?? {}}
                    items={items as KaprodiItem[]}
                    shortcuts={shortcuts}
                />
            )}

            {dashboardRole === 'dosen' && (
                <DosenDashboard
                    stats={stats}
                    items={items as DosenItem[]}
                    shortcuts={shortcuts}
                    warning={warning}
                />
            )}

            {dashboardRole === 'default' && <DefaultDashboard />}
        </AuthenticatedLayout>
    );
}

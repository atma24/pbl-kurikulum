import Modal from '@/Components/Modal';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Stats {
    total_mata_kuliah: number;
    total_cpl:         number;
    total_ppm:         number;
    total_dosen:       number;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
    label:  string;
    value:  number;
    icon:   React.ReactNode;
    accent: string;
    border: string;
}

function StatCard({ label, value, icon, accent, border }: StatCardProps) {
    return (
        <div className={`bg-white rounded-2xl border ${border} p-8 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200`}>
            <div className={`${accent} w-14 h-14 rounded-xl flex items-center justify-center`}>
                {icon}
            </div>
            <div>
                <p className="text-4xl font-extrabold text-gray-800 leading-none tracking-tight">{value}</p>
                <p className="text-sm text-gray-500 mt-2 font-semibold uppercase tracking-widest">{label}</p>
            </div>
        </div>
    );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconBook = () => (
    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const IconTarget = () => (
    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const IconGrid = () => (
    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const IconUsers = () => (
    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const IconPencil = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const IconLock = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const IconArrowLeft = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const IconX = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
            {badge ? (
                <span className="inline-flex self-start items-center px-3 py-1 rounded-full text-sm font-bold text-teal-700 bg-teal-50 border border-teal-200">
                    {value}
                </span>
            ) : (
                <span className="text-sm font-semibold text-gray-800">{value}</span>
            )}
        </div>
    );
}

// ─── Modal Header ─────────────────────────────────────────────────────────────

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
    return (
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
            <div>
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
            </div>
            <button
                onClick={onClose}
                className="ml-4 flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
                <IconX />
            </button>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Edit({
    mustVerifyEmail,
    status,
    stats,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; stats: Stats }>) {

    const { user, roles } = usePage().props.auth as any;
    const primaryRole: string = roles?.[0] ?? 'User';

    const [showProfileModal,  setShowProfileModal]  = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const statCards: StatCardProps[] = [
        {
            label:  'Mata Kuliah',
            value:  stats.total_mata_kuliah,
            icon:   <IconBook />,
            accent: 'bg-teal-50',
            border: 'border-teal-100',
        },
        {
            label:  'Total CPL',
            value:  stats.total_cpl,
            icon:   <IconTarget />,
            accent: 'bg-blue-50',
            border: 'border-blue-100',
        },
        {
            label:  'Total PPM',
            value:  stats.total_ppm,
            icon:   <IconGrid />,
            accent: 'bg-purple-50',
            border: 'border-purple-100',
        },
        {
            label:  'Total Dosen',
            value:  stats.total_dosen,
            icon:   <IconUsers />,
            accent: 'bg-amber-50',
            border: 'border-amber-100',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-body">
            <Head title="Profile" />

            {/* ── Minimal Top Bar ─────────────────────────────────────────── */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm sticky top-0 z-10">
                <Link
                    href={route('dashboard')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-teal-700 transition-colors"
                >
                    <IconArrowLeft />
                    Kembali ke Dashboard
                </Link>

                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-teal-600 rounded-md flex items-center justify-center text-white font-bold text-xs flex-shrink-0">P</div>
                    <div className="hidden sm:block">
                        <p className="font-bold text-teal-700 text-sm leading-tight">POLMAN Bandung</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">TRIN Engineering</p>
                    </div>
                </div>
            </header>

            {/* ── Page Content ─────────────────────────────────────────────── */}
            <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">

                {/* Page Title */}
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola informasi akun dan keamanan Anda.</p>
                </div>

                {/* ── Main Layout: Profile Card (left) + Stats 2×2 (right) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                    {/* ── Profile Card ────────────────────────────────────── */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Teal banner with subtle dot pattern */}
                        <div className="h-28 bg-gradient-to-br from-teal-500 via-teal-700 to-teal-900 relative overflow-hidden">
                            <div
                                className="absolute inset-0 opacity-[0.08]"
                                style={{
                                    backgroundImage:
                                        'radial-gradient(circle, white 1.5px, transparent 1.5px)',
                                    backgroundSize: '20px 20px',
                                }}
                            />
                        </div>

                        <div className="px-6 pb-6">
                            {/* Avatar — overlaps banner */}
                            <div className="-mt-10 mb-5">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'User')}&background=0D8E8E&color=fff&size=120`}
                                    alt="Avatar"
                                    className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg"
                                />
                            </div>

                            {/* Identity fields */}
                            <div className="space-y-4 divide-y divide-gray-50">
                                <div className="space-y-4">
                                    <InfoRow label="Nama Lengkap" value={user?.name ?? '—'} />
                                    <InfoRow label="Email Institusi" value={user?.email ?? '—'} />
                                </div>
                                <div className="pt-4 space-y-4">
                                    <InfoRow label="NIP" value={user?.nip ?? 'Belum terdaftar'} />
                                    <InfoRow label="Jabatan" value={primaryRole} badge />
                                </div>
                                <div className="pt-4">
                                    <span className="text-xs text-gray-400 font-medium">POLMAN Bandung — TRIN Engineering</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex flex-col gap-2.5">
                                <button
                                    onClick={() => setShowProfileModal(true)}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 active:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors shadow-sm"
                                >
                                    <IconPencil />
                                    Edit Profil
                                </button>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-600 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors"
                                >
                                    <IconLock />
                                    Ubah Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Stats 2×2 Grid ──────────────────────────────────── */}
                    <div className="lg:col-span-3 grid grid-cols-2 gap-4">
                        {statCards.map((card) => (
                            <StatCard key={card.label} {...card} />
                        ))}
                    </div>

                </div>
            </main>

            {/* ── Modal: Edit Profil ───────────────────────────────────────── */}
            <Modal show={showProfileModal} maxWidth="lg" onClose={() => setShowProfileModal(false)}>
                <ModalHeader
                    title="Edit Profil"
                    subtitle="Perbarui nama dan NIP Anda"
                    onClose={() => setShowProfileModal(false)}
                />
                <div className="px-6 py-5">
                    <UpdateProfileInformationForm onSuccess={() => setShowProfileModal(false)} />
                </div>
            </Modal>

            {/* ── Modal: Ubah Password ─────────────────────────────────────── */}
            <Modal show={showPasswordModal} maxWidth="lg" onClose={() => setShowPasswordModal(false)}>
                <ModalHeader
                    title="Ubah Password"
                    subtitle="Gunakan password yang kuat dan unik"
                    onClose={() => setShowPasswordModal(false)}
                />
                <div className="px-6 py-5">
                    <UpdatePasswordForm onSuccess={() => setShowPasswordModal(false)} />
                </div>
            </Modal>

        </div>
    );
}

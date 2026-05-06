import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

// ─── Types ─────────────────────────────────────────────────────────────────

interface Stats {
    total_mata_kuliah: number;
    total_cpl:         number;
    total_ppm:         number;
    total_dosen:       number;
}

// ─── Stat Card Component ────────────────────────────────────────────────────

interface StatCardProps {
    label:  string;
    value:  number;
    icon:   React.ReactNode;
    accent: string;
    border: string;
}

function StatCard({ label, value, icon, accent, border }: StatCardProps) {
    return (
        <div
            className={`
                bg-white rounded-xl shadow-sm border border-gray-100
                border-l-4 ${border}
                flex items-center gap-4 p-5
                hover:shadow-md transition-shadow duration-200
            `}
        >
            <div className={`${accent} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800 leading-none">{value}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">{label}</p>
            </div>
        </div>
    );
}

// ─── Icons ──────────────────────────────────────────────────────────────────

const IconBook = () => (
    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const IconTarget = () => (
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const IconGrid = () => (
    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const IconUsers = () => (
    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

const IconX = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// ─── Modal Header ────────────────────────────────────────────────────────────

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

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Edit({
    mustVerifyEmail,
    status,
    stats,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; stats: Stats }>) {

    const { user, roles } = usePage().props.auth as any;
    const primaryRole: string = roles?.[0] ?? 'User';

    // ── Modal State ──────────────────────────────────────────────────────────
    const [showProfileModal,  setShowProfileModal]  = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // ── Stat Cards Config ────────────────────────────────────────────────────
    const statCards: StatCardProps[] = [
        {
            label:  'Mata Kuliah',
            value:  stats.total_mata_kuliah,
            icon:   <IconBook />,
            accent: 'bg-teal-50',
            border: 'border-l-teal-500',
        },
        {
            label:  'Total CPL',
            value:  stats.total_cpl,
            icon:   <IconTarget />,
            accent: 'bg-blue-50',
            border: 'border-l-blue-500',
        },
        {
            label:  'Total PPM',
            value:  stats.total_ppm,
            icon:   <IconGrid />,
            accent: 'bg-purple-50',
            border: 'border-l-purple-500',
        },
        {
            label:  'Total Dosen',
            value:  stats.total_dosen,
            icon:   <IconUsers />,
            accent: 'bg-amber-50',
            border: 'border-l-amber-500',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-6 space-y-6">

                {/* ── Profile Header ──────────────────────────────────────── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Banner */}
                    <div className="h-24 bg-gradient-to-r from-teal-600 to-teal-800" />

                    <div className="px-6 pb-6">
                        {/* Avatar + identity */}
                        <div className="flex items-end justify-between gap-5 -mt-10 mb-4">
                            <div className="flex items-end gap-5">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'User')}&background=008B8B&color=fff&size=80`}
                                    alt="Avatar"
                                    className="w-20 h-20 rounded-full border-4 border-white shadow-md flex-shrink-0"
                                />
                                <div className="pb-1">
                                    <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                        {user?.name ?? '—'}
                                    </h3>
                                    <p className="text-sm text-gray-500">{user?.email ?? '—'}</p>
                                </div>
                            </div>

                            {/* ── Action Buttons ───────────────────────────── */}
                            <div className="pb-1 flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => setShowProfileModal(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 active:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors shadow-sm"
                                >
                                    <IconPencil />
                                    Edit Profil
                                </button>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors shadow-sm"
                                >
                                    <IconLock />
                                    Ubah Password
                                </button>
                            </div>
                        </div>

                        {/* Meta row: NIP + role badge */}
                        <div className="flex flex-wrap items-center gap-3">
                            {user?.nip && (
                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                                    </svg>
                                    NIP: {user.nip}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                {primaryRole}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                                POLMAN Bandung — TRIN Engineering
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Statistics Cards ─────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </div>

            </div>

            {/* ── Modal: Edit Profil ───────────────────────────────────────── */}
            <Modal
                show={showProfileModal}
                maxWidth="lg"
                onClose={() => setShowProfileModal(false)}
            >
                <div>
                    <ModalHeader
                        title="Edit Profil"
                        subtitle="Perbarui nama dan NIP Anda"
                        onClose={() => setShowProfileModal(false)}
                    />
                    <div className="px-6 py-5">
                        <UpdateProfileInformationForm
                            onSuccess={() => setShowProfileModal(false)}
                        />
                    </div>
                </div>
            </Modal>

            {/* ── Modal: Ubah Password ─────────────────────────────────────── */}
            <Modal
                show={showPasswordModal}
                maxWidth="lg"
                onClose={() => setShowPasswordModal(false)}
            >
                <div>
                    <ModalHeader
                        title="Ubah Password"
                        subtitle="Gunakan password yang kuat dan unik"
                        onClose={() => setShowPasswordModal(false)}
                    />
                    <div className="px-6 py-5">
                        <UpdatePasswordForm
                            onSuccess={() => setShowPasswordModal(false)}
                        />
                    </div>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}

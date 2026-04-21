import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

interface Props {
    header?: ReactNode;
}

export default function AuthenticatedLayout({ header, children }: PropsWithChildren<Props>) {
    const user = usePage().props.auth.user;
    const currentUrl = usePage().url;

    // --- LOGIKA FOLDER SIDEBAR ---
    // Cek apakah kita sedang berada di dalam halaman Master Data
    const isMasterDataActive = currentUrl.startsWith('/cpl') || currentUrl.startsWith('/ppm') || currentUrl.startsWith('/iea');

    // State untuk mengontrol buka/tutup folder (default terbuka jika halamannya sedang aktif)
    const [isMasterFolderOpen, setIsMasterFolderOpen] = useState(isMasterDataActive);

    const isMatrixActive = currentUrl.startsWith('/matrix');
    const [isMatrixFolderOpen, setIsMatrixFolderOpen] = useState(isMatrixActive);

    return (
        <div className="flex h-screen w-full bg-polman-neutral overflow-hidden font-body">

            {/* AREA 1: LEFT SIDEBAR */}
            <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col justify-between z-20">
                <div>
                    {/* Area Logo */}
                    <div className="h-20 flex items-center px-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-polman-primary rounded-md flex items-center justify-center text-white font-bold">
                                P
                            </div>
                            <div>
                                <h1 className="font-headline font-bold text-polman-secondary text-sm leading-tight">POLMAN Bandung</h1>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">TRIN Engineering</p>
                            </div>
                        </div>
                    </div>

                    {/* Area Menu Navigasi */}
                    <nav className="p-4 space-y-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-2 px-4">Menu Utama</div>

                        <Link
                            href={route('dashboard')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${currentUrl.startsWith('/dashboard')
                                ? 'bg-polman-neutral text-polman-primary border-l-4 border-polman-primary'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-polman-secondary border-l-4 border-transparent'
                                }`}
                        >
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            href={route('matrix.index')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${currentUrl.startsWith('/matrix')
                                ? 'bg-polman-neutral text-polman-primary border-l-4 border-polman-primary'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-polman-secondary border-l-4 border-transparent'
                                }`}
                        >
                            <span>Curriculum Map</span>
                        </Link>

                        {/* --- FOLDER MASTER DATA (Sistem Lipat) --- */}
                        <div className="mt-6 mb-2">
                            {/* Tombol Toggle Folder */}
                            <button
                                onClick={() => setIsMasterFolderOpen(!isMasterFolderOpen)}
                                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-polman-primary transition-colors focus:outline-none"
                            >
                                <span>Master Data</span>
                                {/* Ikon Chevron (Panah) yang berputar jika terbuka */}
                                <svg
                                    className={`w-4 h-4 transform transition-transform duration-200 ${isMasterFolderOpen ? 'rotate-90 text-polman-primary' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Isi Folder (CPL, PPM, IEA) */}
                            <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isMasterFolderOpen ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                <Link
                                    href={route('cpl.index')}
                                    className={`flex items-center gap-3 px-4 py-2.5 ml-2 rounded-lg text-sm font-semibold transition-colors ${currentUrl.startsWith('/cpl')
                                        ? 'bg-polman-neutral text-polman-primary border-l-4 border-polman-primary'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-polman-secondary border-l-4 border-transparent'
                                        }`}
                                >
                                    <span>Data CPL</span>
                                </Link>

                                <Link
                                    href={route('ppm.index')}
                                    className={`flex items-center gap-3 px-4 py-2.5 ml-2 rounded-lg text-sm font-semibold transition-colors ${currentUrl.startsWith('/ppm')
                                        ? 'bg-polman-neutral text-polman-primary border-l-4 border-polman-primary'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-polman-secondary border-l-4 border-transparent'
                                        }`}
                                >
                                    <span>Data PPM</span>
                                </Link>

                                <Link
                                    href={route('iea.index')}
                                    className={`flex items-center gap-3 px-4 py-2.5 ml-2 rounded-lg text-sm font-semibold transition-colors ${currentUrl.startsWith('/iea')
                                        ? 'bg-polman-neutral text-polman-primary border-l-4 border-polman-primary'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-polman-secondary border-l-4 border-transparent'
                                        }`}
                                >
                                    <span>Data IEA</span>
                                </Link>
                            </div>
                        </div>
                      
                    </nav>
                </div>

                {/* Area Bawah Sidebar (Tombol & Logout) */}
                <div className="p-6 space-y-4">
                    <button className="w-full bg-polman-primary text-white rounded-lg py-3 text-sm font-bold flex items-center justify-center gap-2 hover:bg-polman-secondary transition-colors">
                        <span>+ New Revision</span>
                    </button>

                    <div className="pt-4 border-t border-gray-100 space-y-2">
                        <button className="flex items-center gap-3 text-gray-500 hover:text-gray-800 text-sm font-semibold px-2 py-2">
                            Support
                        </button>
                        <Link method="post" href={route('logout')} as="button" className="flex items-center gap-3 text-red-500 hover:text-red-700 text-sm font-semibold px-2 py-2 w-full text-left">
                            Logout
                        </Link>
                    </div>
                </div>
            </aside>

            {/* AREA KANAN: HEADER & MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden relative">

                {/* AREA 2: TOP HEADER */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 z-10">
                    <div className="flex items-center gap-8 w-full max-w-3xl">
                        <h2 className="font-headline font-bold text-polman-primary text-lg">TRIN Curriculum Portal</h2>

                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search curriculum components..."
                                className="w-full bg-gray-100 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-polman-primary text-gray-700"
                            />
                        </div>
                    </div>

                    {/* User Profile Area */}
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-gray-600">🔔</button>
                        <button className="text-gray-400 hover:text-gray-600">⚙️</button>
                        <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden ml-2 border border-gray-200">
                            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=008B8B&color=fff`} alt="Profile" />
                        </div>
                    </div>
                </header>

                {/* AREA 3: MAIN SCROLLABLE CONTENT */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}
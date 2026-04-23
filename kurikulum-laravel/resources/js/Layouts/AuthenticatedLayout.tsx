import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

interface Props {
    header?: ReactNode;
}

export default function AuthenticatedLayout({ header, children }: PropsWithChildren<Props>) {
    const user = usePage().props.auth.user;
    const currentUrl = usePage().url;

    // --- LOGIKA FOLDER SIDEBAR ---
    // Cek apakah kita sedang berada di dalam halaman Master Data (Termasuk Indikator Kinerja)
    const isMasterDataActive = currentUrl.startsWith('/cpl') || 
                               currentUrl.startsWith('/ppm') || 
                               currentUrl.startsWith('/iea') || 
                               currentUrl.startsWith('/indikator-kinerja');

    // State untuk mengontrol buka/tutup folder
    const [isMasterFolderOpen, setIsMasterFolderOpen] = useState(isMasterDataActive);

    return (
        <div className="flex h-screen w-full bg-polman-neutral overflow-hidden font-body">

            {/* AREA 1: LEFT SIDEBAR */}
            <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col justify-between z-20 shadow-sm">
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
                                {/* Ikon Chevron (Panah) */}
                                <svg
                                    className={`w-4 h-4 transform transition-transform duration-200 ${isMasterFolderOpen ? 'rotate-90 text-polman-primary' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Isi Folder (CPL, PPM, IEA, Indikator Kinerja) */}
                            <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isMasterFolderOpen ? 'max-h-[300px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
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

                                {/* Tombol Indikator Kinerja Baru */}
                                <Link
                                    href={route('indikator-kinerja.index')}
                                    className={`flex items-center gap-3 px-4 py-2.5 ml-2 rounded-lg text-sm font-semibold transition-colors ${currentUrl.startsWith('/indikator-kinerja')
                                        ? 'bg-polman-neutral text-polman-primary border-l-4 border-polman-primary'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-polman-secondary border-l-4 border-transparent'
                                        }`}
                                >
                                    <span>Indikator Kinerja</span>
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Area Bawah Sidebar (Tombol & Logout) */}
                <div className="p-6 space-y-4">
                    <button className="w-full bg-polman-primary text-white rounded-lg py-3 text-sm font-bold flex items-center justify-center gap-2 hover:bg-polman-secondary transition-colors shadow-sm hover:shadow-md">
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
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 z-10 shadow-sm">
                    <div className="flex items-center gap-8 w-full max-w-3xl">
                        <h2 className="font-headline font-bold text-polman-primary text-lg">TRIN Curriculum Portal</h2>

                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search curriculum components..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-polman-primary focus:bg-white transition-colors text-gray-700"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* User Profile Area */}
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden ml-2 border-2 border-polman-primary">
                            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=008B8B&color=fff`} alt="Profile" />
                        </div>
                    </div>
                </header>

                {/* AREA 3: MAIN SCROLLABLE CONTENT */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {header && (
                            <div className="mb-6">
                                {header}
                            </div>
                        )}
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}
import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

interface Props {
    header?: ReactNode;
}

export default function AuthenticatedLayout({ header, children }: PropsWithChildren<Props>) {
    const user = usePage().props.auth.user;
    const currentUrl = usePage().url;

    // Cek apakah kita sedang berada di dalam halaman Master Data
    const isMasterDataActive = currentUrl.startsWith('/cpl') || 
                               currentUrl.startsWith('/ppm') || 
                               currentUrl.startsWith('/iea') || 
                               currentUrl.startsWith('/indikator-kinerja') ||
                               currentUrl.startsWith('/mata-kuliah') || 
                               currentUrl.startsWith('/cpmk');

    const [isMasterFolderOpen, setIsMasterFolderOpen] = useState(isMasterDataActive);

    return (
        <div className="flex h-screen w-full bg-polman-neutral overflow-hidden font-body">

            {/* AREA 1: LEFT SIDEBAR */}
            <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col justify-between z-20 shadow-sm">
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Area Logo */}
                    <div className="h-20 shrink-0 flex items-center px-6 border-b border-gray-100">
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
                    <nav className="p-4 space-y-1 flex-1">
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

                        {/* --- MENU RPS PRODI --- */}
                        <Link
                            href={route('rps.index')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${currentUrl.startsWith('/rps')
                                ? 'bg-polman-neutral text-polman-primary border-l-4 border-polman-primary'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-polman-secondary border-l-4 border-transparent'
                                }`}
                        >
                            <span>RPS Prodi</span>
                        </Link>

                        {/* --- FOLDER MASTER DATA --- */}   
                        <div className="mt-6 mb-2">
                            <button
                                onClick={() => setIsMasterFolderOpen(!isMasterFolderOpen)}
                                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-polman-primary transition-colors focus:outline-none"
                            >
                                <span>Master Data</span>
                                <svg
                                    className={`w-4 h-4 transform transition-transform duration-200 ${isMasterFolderOpen ? 'rotate-90 text-polman-primary' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isMasterFolderOpen ? 'max-h-[400px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                <Link
                                    href={route('mata-kuliah.index')}
                                    className={`flex items-center gap-3 px-4 py-2.5 ml-2 rounded-lg text-sm font-semibold transition-colors ${currentUrl.startsWith('/mata-kuliah') || currentUrl.startsWith('/cpmk')
                                        ? 'bg-polman-neutral text-polman-primary border-l-4 border-polman-primary'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-polman-secondary border-l-4 border-transparent'
                                        }`}
                                >
                                    <span>Mata Kuliah</span>
                                </Link>

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

                {/* Area Bawah Sidebar */}
                <div className="p-6 space-y-4 shrink-0 bg-white border-t border-gray-100">
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                        <Link method="post" href={route('logout')} as="button" className="flex items-center gap-3 text-red-500 hover:text-red-700 text-sm font-semibold px-2 py-2 w-full text-left">
                            Logout
                        </Link>
                    </div>
                </div>
            </aside>

            {/* AREA KANAN: HEADER & MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden relative">

                {/* TOP HEADER */}
                <header className="h-20 shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 z-10 shadow-sm">
                    <div className="flex items-center gap-8 w-full max-w-3xl">
                        <h2 className="font-headline font-bold text-polman-primary text-lg whitespace-nowrap">TRIN Curriculum Portal</h2>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <span className="font-bold text-sm text-gray-700">{user.name}</span>
                        <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden ml-2 border-2 border-polman-primary">
                            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=008B8B&color=fff`} alt="Profile" />
                        </div>
                    </div>
                </header>

                {/* MAIN SCROLLABLE CONTENT */}
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
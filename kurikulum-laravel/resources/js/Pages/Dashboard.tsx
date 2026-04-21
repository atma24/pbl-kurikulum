import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {/* Container Utama menggunakan CSS Grid (3 Kolom di layar besar) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* =========================================
                    KOLOM KIRI (Memakan 2 dari 3 kolom)
                    ========================================= */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    
                    {/* 1. Hero Section (Visi & Misi) */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                        {/* Dekorasi Kotak Abu-abu di Kanan Atas */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-3xl -z-0"></div>
                        
                        <div className="relative z-10">
                            <span className="text-polman-primary font-bold text-xs tracking-widest uppercase">
                                D4 Teknologi Rekayasa Industri
                            </span>
                            <h1 className="font-headline text-4xl font-bold text-gray-900 mt-2 mb-8 max-w-lg leading-tight">
                                Industrial Engineering Technology Program
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="flex items-center gap-2 font-bold text-polman-primary text-sm mb-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        VISI
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Menjadi program studi unggulan dalam teknologi rekayasa industri yang diakui secara internasional untuk mendukung daya saing industri nasional pada tahun 2030.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="flex items-center gap-2 font-bold text-polman-primary text-sm mb-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        MISI
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Menyelenggarakan pendidikan vokasi yang berkualitas, mengembangkan riset terapan inovatif, dan memberikan kontribusi nyata pada solusi sistem industri berkelanjutan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Statistik Cards (Grid 3 Kolom) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Total Credits */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Credits</span>
                            <div>
                                <span className="font-headline text-4xl font-bold text-gray-900">144</span>
                                <span className="text-sm text-gray-500 ml-2 font-bold">SKS</span>
                                <div className="h-1 w-full bg-gray-100 rounded-full mt-3">
                                    <div className="h-1 bg-polman-primary rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: OBE Compliance */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">OBE Compliance</span>
                            <div>
                                <span className="font-headline text-4xl font-bold text-gray-900">94</span>
                                <span className="text-sm text-gray-500 ml-1 font-bold">%</span>
                                <div className="h-1 w-full bg-gray-100 rounded-full mt-3">
                                    <div className="h-1 bg-polman-primary rounded-full" style={{ width: '94%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Semesters */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Semesters</span>
                            <div>
                                <span className="font-headline text-4xl font-bold text-gray-900">08</span>
                                <span className="text-sm text-gray-500 ml-2 font-bold">Stages</span>
                                <div className="h-1 w-full bg-gray-100 rounded-full mt-3">
                                    <div className="h-1 bg-polman-secondary rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================================
                    KOLOM KANAN (Memakan 1 dari 3 kolom)
                    ========================================= */}
                <div className="flex flex-col gap-6">
                    
                    {/* 3. Accreditation Widget */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-headline text-lg font-bold text-gray-900">Accreditation</h3>
                                <p className="text-xs text-gray-500">IABEE Monitoring 2024</p>
                            </div>
                            <div className="w-8 h-8 bg-green-50 text-polman-primary rounded-full flex items-center justify-center">
                                {/* SVG Badge/Medal */}
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 border-2 border-polman-primary text-polman-primary font-bold text-xs rounded-lg flex items-center justify-center">
                                PROV
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Provisionally Accredited</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Valid Until Oct 2026</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span className="text-gray-600">Criteria 1 (PEO)</span>
                                <span className="font-bold text-polman-primary">Passed</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span className="text-gray-600">Criteria 2 (SO)</span>
                                <span className="font-bold text-polman-primary">Passed</span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-gray-600">Criteria 3 (Curriculum)</span>
                                <span className="font-bold text-yellow-600">Reviewing</span>
                            </div>
                        </div>

                        <button className="w-full border-2 border-polman-secondary text-polman-secondary font-bold text-sm py-2 rounded-lg hover:bg-polman-secondary hover:text-white transition-colors">
                            VIEW IABEE REPORT
                        </button>
                    </div>

                    {/* 4. Profil Lulusan Widget (Dark Mode Card) */}
                    <div className="bg-polman-secondary rounded-2xl p-6 shadow-sm relative overflow-hidden text-white">
                        {/* Overlay Pattern/Image simulasi */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                        
                        <div className="relative z-10">
                            <h3 className="font-headline text-lg font-bold mb-4">Profil Lulusan</h3>
                            <ul className="space-y-3 text-sm text-gray-200">
                                <li className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-polman-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </div>
                                    Industrial Systems Engineer
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-polman-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </div>
                                    Production & Logistics Manager
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-polman-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </div>
                                    Process Improvement Consultant
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            {/* TODO: Bagian Bawah (Curriculum Roadmap & OBE Tracker) akan kita buat di Sprint selanjutnya */}
            
        </AuthenticatedLayout>
    );
}
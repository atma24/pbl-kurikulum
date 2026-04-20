import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-polman-neutral">
            {/* Kolom Kiri: Branding (Disembunyikan di layar HP) */}
            <div className="hidden lg:flex flex-col justify-between bg-polman-primary text-white p-12 relative overflow-hidden">
                {/* Logo & Header */}
                <div className="z-10 flex items-center gap-4">
                    {/* TODO: Ganti dengan tag <img src="/images/logo.png" /> */}
                    <div className="w-12 h-12 bg-black rounded-md"></div>
                    <span className="font-headline font-bold text-xl">POLMAN Bandung</span>
                </div>

                {/* Typography Hero */}
                <div className="z-10 mt-16 max-w-md">
                    <h1 className="font-headline text-5xl font-bold leading-tight mb-6">
                        Engineering The Future of Curriculum.
                    </h1>
                    <p className="font-body text-polman-tertiary text-lg">
                        Integrated OBE management system for Industrial Engineering Technology.
                    </p>
                </div>

                {/* Footer / Badges (IABEE Compliant) */}
                <div className="z-10 flex flex-col gap-4 mt-auto">
                    {/* Nanti diisi badges */}
                </div>
                
                {/* TODO: Tambahkan background pattern/garis miring sesuai Figma di sini */}
            </div>

            {/* Kolom Kanan: Form Area */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white">
                <div className="w-full max-w-md">
                    {/* {children} ini adalah tempat Login.tsx / Register.tsx akan disuntikkan */}
                    {children}
                </div>
            </div>
        </div>
    );
}
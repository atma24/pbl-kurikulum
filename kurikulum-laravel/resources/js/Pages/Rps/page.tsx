import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RpsCreate({ mataKuliahs }: { mataKuliahs: any[] }) {
    // Sihir untuk mengendalikan langkah form (1: Identitas, 2: Matriks, 3: Mingguan)
    const [step, setStep] = useState(1);

    // State raksasa untuk menampung seluruh beban data sebelum dikirim
    const { data, setData, post, processing, errors } = useForm({
        mata_kuliah_id: '',
        semester_ke: '',
        tahun_akademik: '',
        deskripsi_singkat: '',
        pustaka_utama: '',
        pustaka_pendukung: '',
        penilaian: [], // Array of objects
        pertemuan: [], // Array of objects
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Segel terakhir: Kirim ke Backend
            post('/rps');
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tempa RPS Baru" />
            
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
                    
                    {/* Kompas Petunjuk Langkah (Stepper) */}
                    <div className="flex justify-between border-b pb-4 mb-6">
                        <h2 className="font-bold text-2xl text-polman-primary">Tempa RPS Baru</h2>
                        <div className="flex gap-4 text-sm font-bold">
                            <span className={step === 1 ? "text-blue-600" : "text-gray-400"}>1. Identitas</span>
                            <span className="text-gray-300">❯</span>
                            <span className={step === 2 ? "text-blue-600" : "text-gray-400"}>2. Matriks Evaluasi</span>
                            <span className="text-gray-300">❯</span>
                            <span className={step === 3 ? "text-blue-600" : "text-gray-400"}>3. Rencana Mingguan</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        
                        {/* FASE 1: IDENTITAS */}
                        {step === 1 && (
                            <div className="space-y-4 animate-fade-in">
                                <h3 className="font-bold text-lg border-l-4 border-polman-primary pl-2">Identitas Mata Kuliah</h3>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Pilih Mata Kuliah</label>
                                    <select 
                                        className="w-full border rounded-lg p-2 text-sm" 
                                        value={data.mata_kuliah_id}
                                        onChange={e => setData('mata_kuliah_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Pilih Pusaka MK --</option>
                                        {mataKuliahs.map(mk => (
                                            <option key={mk.id} value={mk.id}>{mk.kode_mk} - {mk.nama_mk}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Semester Ke-</label>
                                        <input type="number" className="w-full border rounded-lg p-2 text-sm" value={data.semester_ke} onChange={e => setData('semester_ke', e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Tahun Akademik</label>
                                        <input type="text" placeholder="Contoh: 2025/2026" className="w-full border rounded-lg p-2 text-sm" value={data.tahun_akademik} onChange={e => setData('tahun_akademik', e.target.value)} required />
                                    </div>
                                </div>
                                {/* Tambahkan input Pustaka dan Deskripsi di sini */}
                            </div>
                        )}

                        {/* FASE 2: MATRIKS PENILAIAN */}
                        {step === 2 && (
                            <div className="space-y-4 animate-fade-in">
                                <h3 className="font-bold text-lg border-l-4 border-polman-primary pl-2">Matriks Penilaian CPMK</h3>
                                <p className="text-sm text-gray-500">Pahat bobot Kuis, Tugas, UTS, dan UAS di sini.</p>
                                {/* Komponen Tabel Matriks akan diletakkan di sini */}
                            </div>
                        )}

                        {/* FASE 3: RENCANA MINGGUAN */}
                        {step === 3 && (
                            <div className="space-y-4 animate-fade-in">
                                <h3 className="font-bold text-lg border-l-4 border-polman-primary pl-2">Rencana Kegiatan Mingguan</h3>
                                <p className="text-sm text-gray-500">Susun jadwal pertemuan 1 hingga 14.</p>
                                {/* Komponen Tabel Mingguan akan diletakkan di sini */}
                            </div>
                        )}

                        {/* TOMBOL PENGENDALI ARAH */}
                        <div className="flex justify-between mt-8 pt-4 border-t">
                            {step > 1 ? (
                                <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300">
                                    Mundur
                                </button>
                            ) : (
                                <Link href="/rps" className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Batal</Link>
                            )}
                            
                            <button type="submit" className="px-6 py-2 bg-polman-primary text-white rounded-lg font-bold hover:bg-polman-secondary" disabled={processing}>
                                {step < 3 ? 'Selanjutnya ❯' : 'Tempa Prasasti RPS'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
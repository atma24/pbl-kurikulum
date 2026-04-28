import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Dialog } from '@headlessui/react';

interface MataKuliah {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
    jenis: 'Teori' | 'Praktek';
    deskripsi: string | null;
}

export default function MataKuliahIndex({ mataKuliahs }: { mataKuliahs: MataKuliah[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const { data, setData, post, patch, reset, processing, errors, clearErrors } = useForm({
        kode_mk: '',
        nama_mk: '',
        sks: '',
        jenis: 'Teori',
        deskripsi: '',
    });

    // --- FUNGSI GENERATOR KODE OTOMATIS ---
    const generateNextKodeMk = () => {
        if (!mataKuliahs || mataKuliahs.length === 0) return 'MK-01';

        // Ekstrak angka dari format "MK-XX" yang sudah ada
        const existingNumbers = mataKuliahs.map(mk => {
            const match = mk.kode_mk.match(/MK-(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
        });

        // Cari angka paling tinggi, lalu tambah 1
        const maxNumber = Math.max(...existingNumbers, 0);
        const nextNumber = maxNumber + 1;

        // Jadikan format 2 digit (contoh: 1 -> "01", 12 -> "12")
        const paddedNumber = nextNumber.toString().padStart(2, '0');
        return `MK-${paddedNumber}`;
    };

    const openAddModal = () => {
        setModalMode('add');
        reset(); 
        clearErrors();
        
        // Panggil fungsi generator untuk mengisi kode otomatis
        setData({
            kode_mk: generateNextKodeMk(),
            nama_mk: '',
            sks: '',
            jenis: 'Teori',
            deskripsi: '',
        });
        
        setIsModalOpen(true);
    };

    const openEditModal = (mk: MataKuliah) => {
        setModalMode('edit');
        setSelectedId(mk.id);
        setData({
            kode_mk: mk.kode_mk, // Tarik data lama
            nama_mk: mk.nama_mk,
            sks: mk.sks.toString(),
            jenis: mk.jenis,
            deskripsi: mk.deskripsi || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'add') post('/mata-kuliah', { onSuccess: () => setIsModalOpen(false) });
        else patch(`/mata-kuliah/${selectedId}`, { onSuccess: () => setIsModalOpen(false) });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mata Kuliah" />
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-headline font-bold text-2xl text-gray-900">Mata Kuliah</h2>
                    <p className="text-gray-500 text-sm font-body mt-1">Kelola data pusaka mata kuliah prodi.</p>
                </div>
                <button onClick={openAddModal} className="bg-polman-primary hover:bg-polman-secondary text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors">+ Tambah Mata Kuliah</button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-body">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Kode</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Nama</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">SKS</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Jenis</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mataKuliahs.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-400">Belum ada data Mata Kuliah.</td></tr>
                        ) : (
                            mataKuliahs.map((mk) => (
                                <tr key={mk.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-polman-primary">{mk.kode_mk}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{mk.nama_mk}</td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-600">{mk.sks}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${mk.jenis === 'Teori' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                                            {mk.jenis}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/cpmk/mk/${mk.id}`} className="bg-polman-primary hover:bg-polman-secondary text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Kelola CPMK
                                            </Link>
                                            <button onClick={() => openEditModal(mk)} className="text-blue-600 hover:text-blue-800 font-bold px-2 text-sm transition-colors">Edit</button>
                                            <button onClick={() => { if (confirm(`Hapus MK ${mk.kode_mk}?`)) router.delete(`/mata-kuliah/${mk.id}`); }} className="text-red-500 hover:text-red-700 font-bold px-2 text-sm transition-colors">Hapus</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl font-body">
                        <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">{modalMode === 'add' ? 'Tambah Mata Kuliah' : 'Edit Mata Kuliah'}</Dialog.Title>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Kode MK <span className="text-red-500">*</span></label>
                                    {/* --- INPUT DIKUNCI (READONLY) DAN DIUBAH WARNANYA AGAR TERLIHAT TERKUNCI --- */}
                                    <input 
                                        type="text" 
                                        className="w-full border-gray-200 bg-gray-100 text-gray-500 rounded-lg text-sm cursor-not-allowed font-bold" 
                                        value={data.kode_mk} 
                                        readOnly // Mengunci input
                                    />
                                    {errors.kode_mk && <p className="text-red-500 text-xs mt-1">{errors.kode_mk}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Bobot SKS <span className="text-red-500">*</span></label>
                                    <input type="number" min="1" className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm" value={data.sks} onChange={e => setData('sks', e.target.value)} required />
                                    {errors.sks && <p className="text-red-500 text-xs mt-1">{errors.sks}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Jenis Mata Kuliah <span className="text-red-500">*</span></label>
                                <select 
                                    className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm bg-white" 
                                    value={data.jenis} 
                                    onChange={e => setData('jenis', e.target.value as 'Teori' | 'Praktek')}
                                >
                                    <option value="Teori">Teori</option>
                                    <option value="Praktek">Praktek</option>
                                </select>
                                {errors.jenis && <p className="text-red-500 text-xs mt-1">{errors.jenis}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Mata Kuliah <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm" value={data.nama_mk} onChange={e => setData('nama_mk', e.target.value)} required />
                                {errors.nama_mk && <p className="text-red-500 text-xs mt-1">{errors.nama_mk}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
                                <textarea rows={3} className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm" value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" className="bg-polman-primary hover:bg-polman-secondary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Data'}</button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    );
}
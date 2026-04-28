import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Dialog } from '@headlessui/react';

interface MataKuliah {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
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
        deskripsi: '',
    });

    const openAddModal = () => {
        setModalMode('add');
        reset(); clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (mk: MataKuliah) => {
        setModalMode('edit');
        setSelectedId(mk.id);
        setData({
            kode_mk: mk.kode_mk,
            nama_mk: mk.nama_mk,
            sks: mk.sks.toString(),
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
                <h2 className="font-bold text-2xl">Mata Kuliah</h2>
                <button onClick={openAddModal} className="bg-polman-primary text-white px-4 py-2 rounded-lg font-bold">+ Tambah</button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Kode</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nama</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">SKS</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mataKuliahs.map((mk) => (
                            <tr key={mk.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-polman-primary">{mk.kode_mk}</td>
                                <td className="px-6 py-4">{mk.nama_mk}</td>
                                <td className="px-6 py-4 text-center font-bold">{mk.sks}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        {/* --- Tombol Kelola CPMK yang sudah di-Makeover --- */}
                                        <Link 
                                            href={`/cpmk/mk/${mk.id}`} 
                                            className="bg-polman-primary hover:bg-polman-secondary text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Kelola CPMK
                                        </Link>
                                        
                                        <button 
                                            onClick={() => openEditModal(mk)} 
                                            className="text-blue-600 hover:text-blue-800 font-bold px-2 text-sm transition-colors"
                                        >
                                            Edit
                                        </button>
                                        
                                        <button 
                                            onClick={() => router.delete(`/mata-kuliah/${mk.id}`)} 
                                            className="text-red-500 hover:text-red-700 font-bold px-2 text-sm transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - Buat sederhana menggunakan Dialog */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
                        <Dialog.Title className="text-lg font-bold mb-4">{modalMode === 'add' ? 'Tambah' : 'Edit'} Mata Kuliah</Dialog.Title>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Kode MK" className="w-full border rounded-lg p-2" value={data.kode_mk} onChange={e => setData('kode_mk', e.target.value.toUpperCase())} required />
                            <input type="text" placeholder="Nama MK" className="w-full border rounded-lg p-2" value={data.nama_mk} onChange={e => setData('nama_mk', e.target.value)} required />
                            <input type="number" placeholder="SKS" className="w-full border rounded-lg p-2" value={data.sks} onChange={e => setData('sks', e.target.value)} required />
                            <textarea placeholder="Deskripsi" className="w-full border rounded-lg p-2" value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500">Batal</button>
                                <button type="submit" className="bg-polman-primary text-white px-4 py-2 rounded-lg" disabled={processing}>Simpan</button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    );
}
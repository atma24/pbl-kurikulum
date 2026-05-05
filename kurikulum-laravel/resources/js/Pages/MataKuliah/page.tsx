import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Dialog } from '@headlessui/react';

// 1. Pembaruan Kontrak Tipe Data (Interface)
interface MataKuliah {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
    semester: number;
    sifat_pengambilan: string;
    cara_pembelajaran: string;
    prasyarat: string | null;
    deskripsi: string | null;
}

export default function MataKuliahIndex({ mataKuliahs }: { mataKuliahs: MataKuliah[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // 2. Pembaruan State Manajemen Formulir
    const { data, setData, post, patch, reset, processing, errors, clearErrors } = useForm({
        kode_mk: '',
        nama_mk: '',
        sks: '',
        semester: '',
        sifat_pengambilan: 'Wajib', // Nilai bawaan (default)
        cara_pembelajaran: 'Tatap Muka', // Nilai bawaan (default)
        prasyarat: '',
        deskripsi: '',
    });

    const openAddModal = () => {
        setModalMode('add');
        reset(); 
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (mk: MataKuliah) => {
        setModalMode('edit');
        setSelectedId(mk.id);
        setData({
            kode_mk: mk.kode_mk,
            nama_mk: mk.nama_mk,
            sks: mk.sks.toString(),
            semester: mk.semester.toString(),
            sifat_pengambilan: mk.sifat_pengambilan,
            cara_pembelajaran: mk.cara_pembelajaran,
            prasyarat: mk.prasyarat || '',
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
                <button onClick={openAddModal} className="bg-polman-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-polman-secondary transition-colors">+ Tambah</button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Kode</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nama</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Semester</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">SKS</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mataKuliahs.map((mk) => (
                            <tr key={mk.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-polman-primary">{mk.kode_mk}</td>
                                <td className="px-6 py-4">
                                    {mk.nama_mk}
                                    <div className="text-xs text-gray-500 mt-1">{mk.sifat_pengambilan} • {mk.cara_pembelajaran}</div>
                                </td>
                                <td className="px-6 py-4 text-center font-bold">{mk.semester}</td>
                                <td className="px-6 py-4 text-center font-bold">{mk.sks}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
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
                                            onClick={() => {
                                                if(confirm('Apakah Paduka yakin ingin melenyapkan data ini?')) {
                                                    router.delete(`/mata-kuliah/${mk.id}`)
                                                }
                                            }} 
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

            {/* Modal dengan Form Grid Terstruktur */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                        <Dialog.Title className="text-lg font-bold mb-4 border-b pb-2">
                            {modalMode === 'add' ? 'Tempa' : 'Perbarui'} Pusaka Mata Kuliah
                        </Dialog.Title>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Grid 2 Kolom untuk menghemat ruang */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Kode MK <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full border rounded-lg p-2 text-sm uppercase" value={data.kode_mk} onChange={e => setData('kode_mk', e.target.value.toUpperCase())} required />
                                    {errors.kode_mk && <span className="text-red-500 text-xs">{errors.kode_mk}</span>}
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Nama MK <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full border rounded-lg p-2 text-sm" value={data.nama_mk} onChange={e => setData('nama_mk', e.target.value)} required />
                                    {errors.nama_mk && <span className="text-red-500 text-xs">{errors.nama_mk}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">SKS <span className="text-red-500">*</span></label>
                                    <input type="number" min="1" className="w-full border rounded-lg p-2 text-sm" value={data.sks} onChange={e => setData('sks', e.target.value)} required />
                                    {errors.sks && <span className="text-red-500 text-xs">{errors.sks}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Semester <span className="text-red-500">*</span></label>
                                    <input type="number" min="1" className="w-full border rounded-lg p-2 text-sm" value={data.semester} onChange={e => setData('semester', e.target.value)} required />
                                    {errors.semester && <span className="text-red-500 text-xs">{errors.semester}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Sifat Pengambilan <span className="text-red-500">*</span></label>
                                    <select className="w-full border rounded-lg p-2 text-sm" value={data.sifat_pengambilan} onChange={e => setData('sifat_pengambilan', e.target.value)} required>
                                        <option value="Wajib">Wajib</option>
                                        <option value="Pilihan">Pilihan</option>
                                    </select>
                                    {errors.sifat_pengambilan && <span className="text-red-500 text-xs">{errors.sifat_pengambilan}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Cara Pembelajaran <span className="text-red-500">*</span></label>
                                    <select className="w-full border rounded-lg p-2 text-sm" value={data.cara_pembelajaran} onChange={e => setData('cara_pembelajaran', e.target.value)} required>
                                        <option value="Tatap Muka">Tatap Muka</option>
                                        <option value="Daring">Daring</option>
                                        <option value="Bauran">Bauran (Blended)</option>
                                    </select>
                                    {errors.cara_pembelajaran && <span className="text-red-500 text-xs">{errors.cara_pembelajaran}</span>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Prasyarat</label>
                                <input type="text" placeholder="Kosongkan jika tidak ada" className="w-full border rounded-lg p-2 text-sm" value={data.prasyarat} onChange={e => setData('prasyarat', e.target.value)} />
                                <p className="text-xs text-gray-400 mt-1">Contoh: Matematika 1</p>
                                {errors.prasyarat && <span className="text-red-500 text-xs">{errors.prasyarat}</span>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Singkat</label>
                                <textarea rows={3} className="w-full border rounded-lg p-2 text-sm resize-none" value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} />
                                {errors.deskripsi && <span className="text-red-500 text-xs">{errors.deskripsi}</span>}
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Batal</button>
                                <button type="submit" className="bg-polman-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-polman-secondary transition-colors disabled:opacity-50" disabled={processing}>
                                    {processing ? 'Menempa...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    );
}
import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Dialog } from '@headlessui/react';

interface MataKuliah {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
    jenis: 'Teori' | 'Praktek';
    deskripsi: string | null;
    semester: string | null;
    sifat_pengambilan: string | null;
    cara_pembelajaran: string | null;
    prasyarat_id: number | null;
    prasyarat?: { kode_mk: string; nama_mk: string } | null;
}

interface DosenBiodata {
    id: number;
    nama_lengkap: string;
    gelar_depan: string | null;
    gelar_belakang: string | null;
    nip: string;
}

interface SelfManagementData {
    mataKuliah: MataKuliah;
    dosenBiodata: DosenBiodata;
    isAssigned: boolean;
}

interface Props {
    mataKuliahs: MataKuliah[];
    showSelfManagementModal?: boolean;
    selfManagementData?: SelfManagementData;
}

export default function MataKuliahIndex({ mataKuliahs, showSelfManagementModal, selfManagementData }: Props) {
    const { roles } = usePage().props.auth as any;
    const isKaprodi = roles?.includes('Kaprodi');
    const isDosen = roles?.includes('Dosen');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    
    const [isSelfManagementModalOpen, setIsSelfManagementModalOpen] = useState(false);

    useEffect(() => {
        if (showSelfManagementModal && selfManagementData) {
            setIsSelfManagementModalOpen(true);
        }
    }, [showSelfManagementModal, selfManagementData]);

    const { data, setData, post, patch, reset, processing, errors, clearErrors } = useForm({
        kode_mk: '',
        nama_mk: '',
        sks: '',
        jenis: 'Teori',
        semester: '',
        sifat_pengambilan: 'Wajib',
        cara_pembelajaran: 'Tatap Muka',
        deskripsi: '',
        prasyarat_id: '' as string | number | null,
    });

    const openAddModal = () => {
        setModalMode('add');
        reset(); 
        clearErrors();
        setData({
            kode_mk: '',
            nama_mk: '',
            sks: '',
            jenis: 'Teori',
            semester: '',
            sifat_pengambilan: 'Wajib',
            cara_pembelajaran: 'Tatap Muka',
            deskripsi: '',
            prasyarat_id: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (mk: MataKuliah) => {
        setModalMode('edit');
        setSelectedId(mk.id);
        setData({
            kode_mk: mk.kode_mk,
            nama_mk: mk.nama_mk,
            sks: mk.sks.toString(),
            jenis: mk.jenis,
            semester: mk.semester || '',
            sifat_pengambilan: mk.sifat_pengambilan || 'Wajib',
            cara_pembelajaran: mk.cara_pembelajaran || 'Tatap Muka',
            deskripsi: mk.deskripsi || '',
            prasyarat_id: mk.prasyarat_id || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'add') post('/mata-kuliah', { onSuccess: () => setIsModalOpen(false) });
        else patch(`/mata-kuliah/${selectedId}`, { onSuccess: () => setIsModalOpen(false) });
    };
    
    const handleSelfManagementToggle = () => {
        if (!selfManagementData) return;
        
        const { mataKuliah, isAssigned } = selfManagementData;
        
        if (isAssigned) {
            if (confirm(`Hapus diri Anda dari dosen pengampu ${mataKuliah.kode_mk}?`)) {
                router.delete(`/mata-kuliah/${mataKuliah.id}/dosen-pengampu/${selfManagementData.dosenBiodata.id}`, {
                    onSuccess: () => setIsSelfManagementModalOpen(false)
                });
            }
        } else {
            if (confirm(`Tambahkan diri Anda sebagai dosen pengampu ${mataKuliah.kode_mk}?`)) {
                router.post(`/mata-kuliah/${mataKuliah.id}/dosen-pengampu`, {}, {
                    onSuccess: () => setIsSelfManagementModalOpen(false)
                });
            }
        }
    };
    
    const fullName = (d: DosenBiodata) =>
        [d.gelar_depan, d.nama_lengkap, d.gelar_belakang].filter(Boolean).join(' ');

    return (
        <AuthenticatedLayout>
            <Head title="Mata Kuliah" />
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-headline font-bold text-2xl text-gray-900">Mata Kuliah</h2>
                    <p className="text-gray-500 text-sm font-body mt-1">Kelola data pusaka mata kuliah prodi.</p>
                </div>
                {isKaprodi && (
                    <button onClick={openAddModal} className="bg-polman-primary hover:bg-polman-secondary text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors">
                        + Tambah Mata Kuliah
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-body">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Kode</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Nama</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Smt</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">SKS</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Sifat</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mataKuliahs.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8 text-gray-400">Belum ada data Mata Kuliah.</td></tr>
                        ) : (
                            mataKuliahs.map((mk) => (
                                <tr key={mk.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-polman-primary">{mk.kode_mk}</td>
                                    
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {mk.nama_mk}
                                        <div className="text-xs text-gray-500 mt-1">{mk.jenis} • {mk.cara_pembelajaran}</div>
                                        {mk.prasyarat && (
                                            <div className="text-xs text-red-500 mt-1 font-bold">
                                                Prasyarat: {mk.prasyarat.nama_mk}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-center font-bold text-gray-600">{mk.semester || '-'}</td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-600">{mk.sks}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${mk.sifat_pengambilan === 'Wajib' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                            {mk.sifat_pengambilan || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {isKaprodi && (
                                                <>
                                                    <Link href={`/cpmk/mk/${mk.id}`} className="bg-polman-primary hover:bg-polman-secondary text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                                                        Kelola CPMK
                                                    </Link>
                                                    
                                                    <Link href={`/mata-kuliah/${mk.id}/dosen-pengampu`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                                                        Kelola Dosen
                                                    </Link>
                                                    
                                                    <button onClick={() => openEditModal(mk)} className="text-blue-600 hover:text-blue-800 font-bold px-2 text-sm transition-colors">Edit</button>
                                                    <button onClick={() => { if (confirm(`Hapus MK ${mk.kode_mk}?`)) router.delete(`/mata-kuliah/${mk.id}`); }} className="text-red-500 hover:text-red-700 font-bold px-2 text-sm transition-colors">Hapus</button>
                                                </>
                                            )}
                                            
                                            {isDosen && (
                                                <Link href={`/mata-kuliah/${mk.id}/dosen-pengampu`} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                                                    Kelola Diri Sendiri
                                                </Link>
                                            )}
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
                    <Dialog.Panel className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-2xl font-body overflow-y-auto max-h-[90vh]">
                        <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">{modalMode === 'add' ? 'Tambah Mata Kuliah' : 'Edit Mata Kuliah'}</Dialog.Title>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Kode MK <span className="text-red-500">*</span></label>
                                    <input type="text" placeholder="Cth: MK-01, TRO-101" className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm" value={data.kode_mk} onChange={e => setData('kode_mk', e.target.value)} required />
                                    {errors.kode_mk && <p className="text-red-500 text-xs mt-1">{errors.kode_mk}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Mata Kuliah <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm" value={data.nama_mk} onChange={e => setData('nama_mk', e.target.value)} required />
                                    {errors.nama_mk && <p className="text-red-500 text-xs mt-1">{errors.nama_mk}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Bobot SKS <span className="text-red-500">*</span></label>
                                    <input type="number" min="1" className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm" value={data.sks} onChange={e => setData('sks', e.target.value)} required />
                                    {errors.sks && <p className="text-red-500 text-xs mt-1">{errors.sks}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Semester</label>
                                    <input type="text" placeholder="Cth: 2 atau Ganjil" className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm" value={data.semester} onChange={e => setData('semester', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Jenis MK <span className="text-red-500">*</span></label>
                                    <select className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm bg-white" value={data.jenis} onChange={e => setData('jenis', e.target.value as 'Teori' | 'Praktek')}>
                                        <option value="Teori">Teori</option>
                                        <option value="Praktek">Praktek</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Sifat Pengambilan</label>
                                    <select className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm bg-white" value={data.sifat_pengambilan} onChange={e => setData('sifat_pengambilan', e.target.value)}>
                                        <option value="Wajib">Wajib</option>
                                        <option value="Pilihan">Pilihan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Cara Pembelajaran</label>
                                    <select className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm bg-white" value={data.cara_pembelajaran} onChange={e => setData('cara_pembelajaran', e.target.value)}>
                                        <option value="Tatap Muka">Tatap Muka</option>
                                        <option value="Daring">Daring</option>
                                        <option value="Bauran (Blended)">Bauran (Blended)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Prasyarat</label>
                                    <select 
                                        className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm bg-white" 
                                        value={data.prasyarat_id || ''} 
                                        onChange={e => setData('prasyarat_id', e.target.value === '' ? null : Number(e.target.value))}
                                    >
                                        <option value="">- Tidak Ada -</option>
                                        {mataKuliahs.map((mkOption) => (
                                            mkOption.id !== selectedId && (
                                                <option key={mkOption.id} value={mkOption.id}>
                                                    {mkOption.nama_mk}
                                                </option>
                                            )
                                        ))}
                                    </select>
                                    {errors.prasyarat_id && <p className="text-red-500 text-xs mt-1">{errors.prasyarat_id}</p>}
                                </div>
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

            {/* MODAL SELF-MANAGEMENT FOR DOSEN */}
            {selfManagementData && (
                <Dialog open={isSelfManagementModalOpen} onClose={() => setIsSelfManagementModalOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl font-body">
                            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">Kelola Diri Sendiri</Dialog.Title>
                            
                            <div className="space-y-4">
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <h3 className="font-bold text-sm text-gray-700 mb-2">Mata Kuliah</h3>
                                    <p className="text-sm font-bold text-polman-primary">{selfManagementData.mataKuliah.kode_mk}</p>
                                    <p className="text-sm text-gray-800">{selfManagementData.mataKuliah.nama_mk}</p>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <h3 className="font-bold text-sm text-gray-700 mb-2">Informasi Dosen</h3>
                                    <p className="text-sm font-bold text-gray-900">{fullName(selfManagementData.dosenBiodata)}</p>
                                    <p className="text-xs text-gray-500 mt-1">NIP: {selfManagementData.dosenBiodata.nip}</p>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                    <div className="flex-shrink-0">
                                        {selfManagementData.isAssigned ? (
                                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Status</p>
                                        <p className="text-xs text-gray-600">
                                            {selfManagementData.isAssigned 
                                                ? 'Anda terdaftar sebagai dosen pengampu' 
                                                : 'Anda belum terdaftar sebagai dosen pengampu'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button 
                                    onClick={() => setIsSelfManagementModalOpen(false)} 
                                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSelfManagementToggle}
                                    className={`px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors ${
                                        selfManagementData.isAssigned
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    {selfManagementData.isAssigned ? 'Hapus Diri Sendiri' : 'Tambahkan Diri Sendiri'}
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}
        </AuthenticatedLayout>
    );
}

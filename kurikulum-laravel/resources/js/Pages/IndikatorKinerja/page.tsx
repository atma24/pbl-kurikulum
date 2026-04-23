import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Dialog } from '@headlessui/react';

// --- Tipe Data ---
interface Cpl {
    id: number;
    kode: string;
    deskripsi: string;
}

interface IndikatorKinerja {
    id: number;
    kode: string;
    deskripsi: string;
    cpl_id: number;
    cpl?: Cpl; // Relasi dari backend
}

interface Props {
    indikator_kinerjas: IndikatorKinerja[]; // Disesuaikan dengan penamaan Controller (snake_case)
    cpls: Cpl[];
}

export default function IndikatorKinerjaPage({ indikator_kinerjas, cpls }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Inertia Form Setup (Ditambahkan field 'kode')
    const { data, setData, post, patch, reset, processing, errors, clearErrors } = useForm({
        kode: '',
        deskripsi: '',
        cpl_id: '' as number | '',
    });

    // --- State untuk Fitur Search CPL ---
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Menutup dropdown jika klik di luar area
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter CPL berdasarkan pencarian
    const filteredCpls = cpls.filter(cpl => 
        cpl.kode.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cpl.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Menemukan CPL yang sedang dipilih untuk ditampilkan di input
    const selectedCpl = cpls.find(c => c.id === data.cpl_id);

    // --- Handlers ---
    const openAddModal = () => {
        setModalMode('add');
        reset();
        setSearchQuery('');
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (ik: IndikatorKinerja) => {
        setModalMode('edit');
        setSelectedId(ik.id);
        setData({
            kode: ik.kode,
            deskripsi: ik.deskripsi,
            cpl_id: ik.cpl_id,
        });
        setSearchQuery('');
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'add') {
            post('/indikator-kinerja', { onSuccess: () => closeModal() });
        } else {
            patch(`/indikator-kinerja/${selectedId}`, { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id: number, kode: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus indikator ${kode}?`)) {
            router.delete(`/indikator-kinerja/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Master Indikator Kinerja" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-headline font-bold text-2xl text-gray-900">Indikator Kinerja</h2>
                    <p className="text-gray-500 text-sm font-body mt-1">Kelola indikator kinerja dan relasinya dengan CPL.</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="bg-polman-primary hover:bg-polman-secondary text-white font-bold py-2.5 px-5 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm"
                >
                    <span>+ Tambah Indikator</span>
                </button>
            </div>

            {/* Tabel Data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-body">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-polman-neutral">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase w-32">Kode</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Deskripsi Kinerja</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Terkait CPL</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase w-32">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {!indikator_kinerjas || indikator_kinerjas.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Belum ada data Indikator Kinerja.</td>
                            </tr>
                        ) : (
                            indikator_kinerjas.map((ik) => (
                                <tr key={ik.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-polman-primary">{ik.kode}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{ik.deskripsi}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {ik.cpl ? (
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">
                                                {ik.cpl.kode}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button onClick={() => openEditModal(ik)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(ik.id, ik.kode)} className="text-red-600 hover:text-red-900">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah/Edit */}
            <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl font-body overflow-visible">
                        <Dialog.Title className="font-headline text-xl font-bold text-gray-900 mb-4">
                            {modalMode === 'add' ? 'Tambah Indikator Kinerja' : 'Edit Indikator Kinerja'}
                        </Dialog.Title>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {/* Custom Searchable Dropdown untuk CPL (Dipindah ke atas agar logis) */}
                            <div className="relative" ref={dropdownRef}>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Pilih Relasi CPL <span className="text-red-500">*</span></label>
                                
                                {/* Area Input Pencarian / Tampilan Terpilih */}
                                <div 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm flex items-center justify-between cursor-text focus-within:ring-2 focus-within:ring-polman-primary focus-within:border-polman-primary transition-all"
                                    onClick={() => setIsDropdownOpen(true)}
                                >
                                    {isDropdownOpen ? (
                                        <input 
                                            type="text"
                                            className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm"
                                            placeholder="Ketik kode atau deskripsi CPL..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            autoFocus
                                        />
                                    ) : (
                                        <div className={`w-full truncate ${selectedCpl ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                                            {selectedCpl ? `${selectedCpl.kode} - ${selectedCpl.deskripsi}` : 'Klik untuk mencari CPL...'}
                                        </div>
                                    )}
                                    
                                    <svg className={`w-4 h-4 text-gray-400 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {/* List Dropdown Mengambang */}
                                {isDropdownOpen && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                        {filteredCpls.length === 0 ? (
                                            <div className="p-3 text-sm text-gray-500 text-center">CPL tidak ditemukan.</div>
                                        ) : (
                                            <ul className="py-1">
                                                {filteredCpls.map((cpl) => (
                                                    <li 
                                                        key={cpl.id}
                                                        className={`px-4 py-2 hover:bg-polman-neutral hover:text-polman-primary cursor-pointer text-sm transition-colors ${data.cpl_id === cpl.id ? 'bg-polman-neutral text-polman-primary font-bold' : 'text-gray-700'}`}
                                                        onClick={() => {
                                                            setData('cpl_id', cpl.id);
                                                            setSearchQuery('');
                                                            setIsDropdownOpen(false);
                                                        }}
                                                    >
                                                        <span className="block font-bold">{cpl.kode}</span>
                                                        <span className="block text-[10px] text-gray-500 truncate">{cpl.deskripsi}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                                {errors.cpl_id && <p className="text-red-500 text-xs mt-1">{errors.cpl_id}</p>}
                            </div>

                            {/* Input Kode */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Kode Indikator <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-polman-primary focus:border-polman-primary uppercase"
                                    placeholder="Contoh: A-1, B-2..."
                                    value={data.kode}
                                    onChange={(e) => setData('kode', e.target.value.toUpperCase())}
                                    required
                                />
                                {errors.kode && <p className="text-red-500 text-xs mt-1">{errors.kode}</p>}
                            </div>

                            {/* Input Deskripsi */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi Kinerja <span className="text-red-500">*</span></label>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-polman-primary focus:border-polman-primary"
                                    rows={3}
                                    placeholder="Masukkan deskripsi kinerja..."
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    required
                                />
                                {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
                            </div>

                            {/* Tombol Simpan/Batal */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing || !data.cpl_id} className="px-4 py-2 text-sm font-bold text-white bg-polman-primary hover:bg-polman-secondary rounded-lg transition-colors disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    );
}
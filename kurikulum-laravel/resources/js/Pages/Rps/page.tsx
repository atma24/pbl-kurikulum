import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Dialog } from '@headlessui/react';
import axios from 'axios';

interface CPMK { id: number; kode_cpmk: string; deskripsi: string; }
interface MataKuliah { id: number; kode_mk: string; nama_mk: string; }
interface Rps {
    id: number;
    mata_kuliah_id: number;
    tahun_akademik: string;
    kode_dokumen?: string;
    mata_kuliah: MataKuliah;
    dosen: { name: string };
    tanggal_penyusunan: string;
    pustaka_utama: string;
    pustaka_pendukung: string;
    bahan_kajian_utama: string;
    penilaians: any[];
    details: any[];
}

export default function RpsIndex({ rps, mataKuliahs }: { rps: Rps[], mataKuliahs: MataKuliah[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [cpmks, setCpmks] = useState<CPMK[]>([]);
    
    // State khusus untuk Modal Delete yang Estetik
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, setData, post, reset, processing, errors, clearErrors } = useForm({
        mata_kuliah_id: '',
        tahun_akademik: '',
        kode_dokumen: '', // <--- Tambahan field kode dokumen
        tanggal_penyusunan: new Date().toISOString().split('T')[0],
        pustaka_utama: '',
        pustaka_pendukung: '',
        bahan_kajian_utama: '', 
        tte_dosen: null as File | null,     
        tte_kaprodi: null as File | null,   
        tte_kajur: null as File | null,     
        penilaians: [] as any[],
        details: [{ minggu_ke: '', kemampuan_akhir: '', indikator: '', bahan_kajian: '', metode_pembelajaran: '', estimasi_waktu: '', pengalaman_belajar: '', penilaian_komponen: '', penilaian_bobot: 0 }],
        _method: 'POST'
    });

    const handleMkChange = async (mk_id: string) => {
        setData('mata_kuliah_id', mk_id);
        if (!mk_id) return;
        try {
            const res = await axios.get(`/api/mata-kuliah/${mk_id}/rps-data`);
            const fetchedCpmks = res.data.data.cpmks;
            setCpmks(fetchedCpmks);
            setData('penilaians', fetchedCpmks.map((c: CPMK) => ({
                cpmk_id: c.id, quiz: 0, tugas: 0, project: 0, uts: 0, uas: 0
            })));
        } catch (error) {
            console.error("Gagal menarik data RPS MK", error);
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        reset();
        clearErrors();
        setCpmks([]);
        setData('_method', 'POST');
        setIsModalOpen(true);
    };

    const openEditModal = async (item: Rps) => {
        setModalMode('edit');
        setSelectedId(item.id);
        clearErrors();
        
        let loadedPenilaians = item.penilaians || [];

        // Tarik struktur CPMK untuk render tabel matriks
        try {
            const res = await axios.get(`/api/mata-kuliah/${item.mata_kuliah_id}/rps-data`);
            const fetchedCpmks = res.data.data.cpmks;
            setCpmks(fetchedCpmks);

            // JARING PENGAMAN: Jika matriks kosong
            if (loadedPenilaians.length === 0) {
                loadedPenilaians = fetchedCpmks.map((c: CPMK) => ({
                    cpmk_id: c.id, quiz: 0, tugas: 0, project: 0, uts: 0, uas: 0
                }));
            }
        } catch (error) {
            console.error("Gagal menarik data RPS MK", error);
        }

        // Timpa state form dengan data yang ada di database
        setData({
            mata_kuliah_id: item.mata_kuliah_id.toString(),
            tahun_akademik: item.tahun_akademik,
            kode_dokumen: item.kode_dokumen || '',
            tanggal_penyusunan: item.tanggal_penyusunan,
            pustaka_utama: item.pustaka_utama,
            pustaka_pendukung: item.pustaka_pendukung || '',
            bahan_kajian_utama: item.bahan_kajian_utama || '',
            tte_dosen: null,   
            tte_kaprodi: null,
            tte_kajur: null,
            penilaians: loadedPenilaians,
            details: (item.details && item.details.length > 0) 
                     ? item.details 
                     : [{ minggu_ke: '', kemampuan_akhir: '', indikator: '', bahan_kajian: '', metode_pembelajaran: '', estimasi_waktu: '', pengalaman_belajar: '', penilaian_komponen: '', penilaian_bobot: 0 }],
            _method: 'PUT'
        });

        setIsModalOpen(true);
    };

    const addMingguan = () => setData('details', [...data.details, { minggu_ke: '', kemampuan_akhir: '', indikator: '', bahan_kajian: '', metode_pembelajaran: '', estimasi_waktu: '', pengalaman_belajar: '', penilaian_komponen: '', penilaian_bobot: 0 }]);
    const removeMingguan = (index: number) => setData('details', data.details.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'add') {
            post(route('rps.store'), { onSuccess: () => setIsModalOpen(false) });
        } else {
            post(route('rps.update', selectedId!), { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(`/rps/${deleteId}`, { 
                preserveScroll: true,
                onSuccess: () => setDeleteId(null) 
            });
        }
    };

    // Fungsi bantu untuk handle input angka yang pakai koma (,)
    const parseDecimal = (val: string) => parseFloat(val.replace(',', '.')) || 0;

    return (
        <AuthenticatedLayout>
            <Head title="Daftar RPS" />
            
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-headline font-bold text-2xl text-gray-900">Rencana Pembelajaran Semester</h2>
                    <p className="text-gray-500 text-sm font-body mt-1">Kelola dokumen RPS Mata Kuliah.</p>
                </div>
                <button onClick={openAddModal} className="bg-polman-primary hover:bg-polman-secondary text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors">
                    + Tambah RPS
                </button>
            </div>

            {/* TABEL LIST RPS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-body">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Mata Kuliah</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Tahun Akademik</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Dosen Penyusun</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {rps.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-8 text-gray-400">Belum ada dokumen RPS.</td></tr>
                        ) : (
                            rps.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-polman-primary">{item.mata_kuliah?.kode_mk}</div>
                                        <div className="font-medium text-gray-800">{item.mata_kuliah?.nama_mk}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-600">
                                        {item.tahun_akademik}
                                        <div className="text-xs text-gray-400 mt-1">{item.kode_dokumen}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{item.dosen?.name}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {/* TOMBOL PRINT KE RUTE PDF */}
                                            <a href={route('rps.pdf', item.id)} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900 font-bold px-2 text-sm transition-colors">Print</a>
                                            <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800 font-bold px-2 text-sm transition-colors">Edit</button>
                                            <button onClick={() => setDeleteId(item.id)} className="text-red-500 hover:text-red-700 font-bold px-2 text-sm transition-colors">Hapus</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL KONFIRMASI HAPUS (ESTETIK) */}
            <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl font-body text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <Dialog.Title className="text-lg font-bold text-gray-900 mb-2">Hapus Dokumen RPS?</Dialog.Title>
                        <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat diurungkan. Seluruh matriks penilaian dan rencana mingguan terkait akan ikut terhapus selamanya.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Batal</button>
                            <button onClick={confirmDelete} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm">Ya, Hapus!</button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* MODAL FORM RPS UTAMA */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-2xl w-full max-w-5xl shadow-2xl font-body overflow-y-auto max-h-[90vh]">
                        <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                            {modalMode === 'add' ? 'Tambah Dokumen RPS' : 'Edit Dokumen RPS'}
                        </Dialog.Title>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* IDENTITAS */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Mata Kuliah</label>
                                    <select className="w-full border-gray-300 rounded text-sm" value={data.mata_kuliah_id} onChange={e => handleMkChange(e.target.value)} required disabled={modalMode === 'edit'}>
                                        <option value="">-- Pilih Mata Kuliah --</option>
                                        {mataKuliahs.map(mk => <option key={mk.id} value={mk.id}>{mk.kode_mk} - {mk.nama_mk}</option>)}
                                    </select>
                                    {errors.mata_kuliah_id && <span className="text-red-500 text-xs">{errors.mata_kuliah_id}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tahun Akademik</label>
                                    <input type="text" placeholder="Cth: 2021/2022" className="w-full border-gray-300 rounded text-sm" value={data.tahun_akademik} onChange={e => setData('tahun_akademik', e.target.value)} required />
                                    {errors.tahun_akademik && <span className="text-red-500 text-xs">{errors.tahun_akademik}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Kode Dokumen RPS</label>
                                    <select className="w-full border-gray-300 rounded text-sm" value={data.kode_dokumen} onChange={e => setData('kode_dokumen', e.target.value)} required>
                                        <option value="">-- Pilih Kode --</option>
                                        <option value="RPS_TRIN">RPS_TRIN</option>
                                        <option value="RPS_TRO">RPS_TRO</option>
                                        <option value="RPS_TRMO">RPS_TRMO</option>
                                    </select>
                                </div>
                                
                                {/* UPLOAD TTE (3 Kolom) */}
                                <div className="col-span-3 mt-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 border-b pb-1">Upload QR Code / Tanda Tangan Elektronik</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Dosen Pengampu</label>
                                            <input type="file" accept=".png,.jpg,.jpeg,.pdf" className="w-full border-gray-300 rounded text-xs p-1.5 border" onChange={e => setData('tte_dosen', e.target.files ? e.target.files[0] : null)} />
                                            {errors.tte_dosen && <span className="text-red-500 text-xs">{errors.tte_dosen}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Kepala Program Studi</label>
                                            <input type="file" accept=".png,.jpg,.jpeg,.pdf" className="w-full border-gray-300 rounded text-xs p-1.5 border" onChange={e => setData('tte_kaprodi', e.target.files ? e.target.files[0] : null)} />
                                            {errors.tte_kaprodi && <span className="text-red-500 text-xs">{errors.tte_kaprodi}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Ketua Jurusan</label>
                                            <input type="file" accept=".png,.jpg,.jpeg,.pdf" className="w-full border-gray-300 rounded text-xs p-1.5 border" onChange={e => setData('tte_kajur', e.target.files ? e.target.files[0] : null)} />
                                            {errors.tte_kajur && <span className="text-red-500 text-xs">{errors.tte_kajur}</span>}
                                        </div>
                                    </div>
                                    {modalMode === 'edit' && <p className="text-xs text-blue-500 mt-2 italic">* Kosongkan kolom TTE di atas jika tidak ingin mengubah file yang sudah diupload sebelumnya.</p>}
                                </div>
                            </div>

                            {/* PUSTAKA & BAHAN KAJIAN UTAMA */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Pustaka Utama</label>
                                    <textarea rows={3} className="w-full border-gray-300 rounded text-sm" value={data.pustaka_utama} onChange={e => setData('pustaka_utama', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Pustaka Pendukung</label>
                                    <textarea rows={3} className="w-full border-gray-300 rounded text-sm" value={data.pustaka_pendukung} onChange={e => setData('pustaka_pendukung', e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Bahan Kajian / Materi Pembelajaran (1 Semester)</label>
                                    <textarea rows={4} placeholder="1. Dasar kalkulus&#10;2. Limit&#10;3. Turunan" className="w-full border-gray-300 rounded text-sm" value={data.bahan_kajian_utama} onChange={e => setData('bahan_kajian_utama', e.target.value)} required />
                                </div>
                            </div>

                            {/* MATRIKS PENILAIAN */}
                            {cpmks.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 border-b pb-1">Sistem Evaluasi (Bobot % per CPMK)</label>
                                    <table className="w-full text-sm border">
                                        <thead className="bg-gray-50">
                                            <tr><th className="border p-2">CPMK</th><th className="border p-2">Quiz</th><th className="border p-2">Tugas</th><th className="border p-2">Project</th><th className="border p-2">UTS</th><th className="border p-2">UAS</th></tr>
                                        </thead>
                                        <tbody>
                                            {data.penilaians.map((penilaian, idx) => (
                                                <tr key={idx}>
                                                    <td className="border p-2 font-bold text-center">{cpmks[idx]?.kode_cpmk}</td>
                                                    {['quiz', 'tugas', 'project', 'uts', 'uas'].map(field => (
                                                        <td key={field} className="border p-1">
                                                            {/* SUDAH SUPPORT KOMA DAN DESIMAL */}
                                                            <input 
                                                                type="text" 
                                                                className="w-full border-gray-300 rounded text-xs text-center" 
                                                                value={penilaian[field]} 
                                                                onChange={e => {
                                                                    const newPenilaian = [...data.penilaians];
                                                                    newPenilaian[idx][field] = e.target.value; 
                                                                    setData('penilaians', newPenilaian);
                                                                }}
                                                                onBlur={e => {
                                                                    const newPenilaian = [...data.penilaians];
                                                                    newPenilaian[idx][field] = parseDecimal(e.target.value);
                                                                    setData('penilaians', newPenilaian);
                                                                }}
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* RENCANA MINGGUAN */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 border-b pb-1">Rencana Pembelajaran Mingguan</label>
                                {data.details.map((detail, idx) => (
                                    <div key={idx} className="border border-gray-200 p-3 rounded mb-3 bg-gray-50 relative">
                                        <button type="button" onClick={() => removeMingguan(idx)} className="absolute top-2 right-3 text-red-500 text-xs font-bold hover:underline">Hapus Baris</button>
                                        <div className="grid grid-cols-4 gap-3 mt-4">
                                            <input type="text" placeholder="Mg Ke- (cth: 1)" className="border-gray-300 rounded text-sm" value={detail.minggu_ke} onChange={e => { const d = [...data.details]; d[idx].minggu_ke = e.target.value; setData('details', d); }} required />
                                            <input type="text" placeholder="Estimasi Waktu" className="border-gray-300 rounded text-sm" value={detail.estimasi_waktu} onChange={e => { const d = [...data.details]; d[idx].estimasi_waktu = e.target.value; setData('details', d); }} required />
                                            <input type="text" placeholder="Metode Pembelajaran" className="border-gray-300 rounded text-sm col-span-2" value={detail.metode_pembelajaran} onChange={e => { const d = [...data.details]; d[idx].metode_pembelajaran = e.target.value; setData('details', d); }} required />
                                            
                                            <textarea placeholder="Kemampuan Akhir" rows={2} className="border-gray-300 rounded text-sm col-span-2" value={detail.kemampuan_akhir} onChange={e => { const d = [...data.details]; d[idx].kemampuan_akhir = e.target.value; setData('details', d); }} required />
                                            <textarea placeholder="Indikator" rows={2} className="border-gray-300 rounded text-sm col-span-2" value={detail.indikator} onChange={e => { const d = [...data.details]; d[idx].indikator = e.target.value; setData('details', d); }} required />
                                            
                                            <textarea placeholder="Bahan Kajian (Materi Spesifik)" rows={2} className="border-gray-300 rounded text-sm col-span-2" value={detail.bahan_kajian} onChange={e => { const d = [...data.details]; d[idx].bahan_kajian = e.target.value; setData('details', d); }} required />
                                            <textarea placeholder="Pengalaman Belajar" rows={2} className="border-gray-300 rounded text-sm col-span-2" value={detail.pengalaman_belajar} onChange={e => { const d = [...data.details]; d[idx].pengalaman_belajar = e.target.value; setData('details', d); }} />
                                            
                                            <input type="text" placeholder="Komponen Penilaian" className="border-gray-300 rounded text-sm col-span-2" value={detail.penilaian_komponen} onChange={e => { const d = [...data.details]; d[idx].penilaian_komponen = e.target.value; setData('details', d); }} />
                                            
                                            {/* SUDAH SUPPORT KOMA DAN DESIMAL */}
                                            <input 
                                                type="text" 
                                                placeholder="Bobot Penilaian (%)" 
                                                className="border-gray-300 rounded text-sm col-span-2" 
                                                value={detail.penilaian_bobot} 
                                                onChange={e => { 
                                                    const d = [...data.details]; 
                                                    d[idx].penilaian_bobot = e.target.value as any; 
                                                    setData('details', d); 
                                                }}
                                                onBlur={e => {
                                                    const d = [...data.details];
                                                    d[idx].penilaian_bobot = parseDecimal(e.target.value);
                                                    setData('details', d);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addMingguan} className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded font-bold">+ Tambah Minggu</button>
                            </div>

                            {/* AKSI TOMBOL */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" disabled={processing} className="bg-polman-primary hover:bg-polman-secondary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm">
                                    {processing ? 'Menyimpan...' : 'Simpan RPS'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    );
}
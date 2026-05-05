import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Dialog } from '@headlessui/react';
import axios from 'axios';

interface CPMK { id: number; kode_cpmk: string; deskripsi: string; }
interface MataKuliah { id: number; kode_mk: string; nama_mk: string; }
interface Rps {
    id: number;
    tahun_akademik: string;
    mata_kuliah: MataKuliah;
    dosen: { name: string };
    tanggal_penyusunan: string;
}

export default function RpsIndex({ rps, mataKuliahs }: { rps: Rps[], mataKuliahs: MataKuliah[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [cpmks, setCpmks] = useState<CPMK[]>([]);

    const { data, setData, post, reset, processing, errors, clearErrors } = useForm({
        mata_kuliah_id: '',
        tahun_akademik: '',
        tanggal_penyusunan: new Date().toISOString().split('T')[0],
        pustaka_utama: '',
        pustaka_pendukung: '',
        tte: null as File | null,
        penilaians: [] as any[],
        details: [{ minggu_ke: '', kemampuan_akhir: '', indikator: '', bahan_kajian: '', metode_pembelajaran: '', estimasi_waktu: '', pengalaman_belajar: '', penilaian_komponen: '', penilaian_bobot: 0 }],
        _method: 'POST' // Digunakan untuk override saat edit (PUT via POST)
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

    const openEditModal = (item: Rps) => {
        // Logika edit menyusul: Idealnya fetch data detail RPS dari API, lalu set state
        setModalMode('edit');
        setSelectedId(item.id);
        setData('_method', 'PUT');
        setIsModalOpen(true);
        // Note: Implementasikan fetch detail RPS di sini
    };

    const addMingguan = () => setData('details', [...data.details, { minggu_ke: '', kemampuan_akhir: '', indikator: '', bahan_kajian: '', metode_pembelajaran: '', estimasi_waktu: '', pengalaman_belajar: '', penilaian_komponen: '', penilaian_bobot: 0 }]);
    const removeMingguan = (index: number) => setData('details', data.details.filter((_, i) => i !== index));

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
        post(route('rps.store'), { onSuccess: () => setIsModalOpen(false) });
    } else {
        // Tambahkan tanda '!' setelah selectedId
        post(route('rps.update', selectedId!), { onSuccess: () => setIsModalOpen(false) });
    }
};

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
                                        <div className="font-bold text-polman-primary">{item.mata_kuliah.kode_mk}</div>
                                        <div className="font-medium text-gray-800">{item.mata_kuliah.nama_mk}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-600">{item.tahun_akademik}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{item.dosen.name}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button className="text-gray-600 hover:text-gray-900 font-bold px-2 text-sm transition-colors">Print</button>
                                            <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800 font-bold px-2 text-sm transition-colors">Edit</button>
                                            <button 
    onClick={() => { 
        if (confirm('Yakin ingin menghapus dokumen RPS ini?')) {
            router.delete(`/rps/${item.id}`, { preserveScroll: true });
        } 
    }} 
    className="text-red-500 hover:text-red-700 font-bold px-2 text-sm transition-colors"
>
    Hapus
</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL FORM RPS */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-2xl w-full max-w-5xl shadow-2xl font-body overflow-y-auto max-h-[90vh]">
                        <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                            {modalMode === 'add' ? 'Tambah Dokumen RPS' : 'Edit Dokumen RPS'}
                        </Dialog.Title>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* IDENTITAS */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Mata Kuliah</label>
                                    <select className="w-full border-gray-300 rounded text-sm" value={data.mata_kuliah_id} onChange={e => handleMkChange(e.target.value)} required>
                                        <option value="">-- Pilih Mata Kuliah --</option>
                                        {mataKuliahs.map(mk => <option key={mk.id} value={mk.id}>{mk.kode_mk} - {mk.nama_mk}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tahun Akademik</label>
                                    <input type="text" placeholder="Cth: 2021/2022" className="w-full border-gray-300 rounded text-sm" value={data.tahun_akademik} onChange={e => setData('tahun_akademik', e.target.value)} required />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Upload TTE (Tanda Tangan Elektronik)</label>
                                    <input type="file" accept=".png,.jpg,.jpeg,.pdf" className="w-full border-gray-300 rounded text-sm p-1.5 border" onChange={e => setData('tte', e.target.files ? e.target.files[0] : null)} />
                                </div>
                            </div>

                            {/* PUSTAKA */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Pustaka Utama</label>
                                    <textarea rows={2} className="w-full border-gray-300 rounded text-sm" value={data.pustaka_utama} onChange={e => setData('pustaka_utama', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Pustaka Pendukung</label>
                                    <textarea rows={2} className="w-full border-gray-300 rounded text-sm" value={data.pustaka_pendukung} onChange={e => setData('pustaka_pendukung', e.target.value)} />
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
                                                            <input type="number" min="0" max="100" className="w-full border-gray-300 rounded text-xs text-center" value={penilaian[field]} onChange={e => {
                                                                const newPenilaian = [...data.penilaians];
                                                                newPenilaian[idx][field] = parseFloat(e.target.value) || 0;
                                                                setData('penilaians', newPenilaian);
                                                            }}/>
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
                                            
                                            <textarea placeholder="Bahan Kajian" rows={2} className="border-gray-300 rounded text-sm col-span-2" value={detail.bahan_kajian} onChange={e => { const d = [...data.details]; d[idx].bahan_kajian = e.target.value; setData('details', d); }} required />
                                            <textarea placeholder="Pengalaman Belajar" rows={2} className="border-gray-300 rounded text-sm col-span-2" value={detail.pengalaman_belajar} onChange={e => { const d = [...data.details]; d[idx].pengalaman_belajar = e.target.value; setData('details', d); }} />
                                            
                                            <input type="text" placeholder="Komponen Penilaian" className="border-gray-300 rounded text-sm col-span-2" value={detail.penilaian_komponen} onChange={e => { const d = [...data.details]; d[idx].penilaian_komponen = e.target.value; setData('details', d); }} />
                                            <input type="number" placeholder="Bobot Penilaian (%)" className="border-gray-300 rounded text-sm col-span-2" value={detail.penilaian_bobot} onChange={e => { const d = [...data.details]; d[idx].penilaian_bobot = parseFloat(e.target.value) || 0; setData('details', d); }} />
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addMingguan} className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded font-bold">+ Tambah Minggu</button>
                            </div>

                            {/* AKSI TOMBOL */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Batal</button>
                                <button type="button" className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-gray-900">Print Preview</button>
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
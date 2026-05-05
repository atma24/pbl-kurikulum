import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import axios from 'axios';

interface CPMK {
    id: number;
    kode_cpmk: string;
    deskripsi: string;
}

export default function RpsCreate({ mataKuliahs, kaprodis }: { mataKuliahs: any[], kaprodis: any[] }) {
    const [step, setStep] = useState(1);
    const [cpmkList, setCpmkList] = useState<CPMK[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        mata_kuliah_id: '',
        semester_ke: '',
        tahun_akademik: '',
        deskripsi_singkat: '',
        pustaka_utama: '',
        pustaka_pendukung: '',
        kaprodi_id: '',
        nama_kajur: '',
        penilaian: [] as any[], 
        pertemuan: [] as any[], 
    });

    // --- LOGIKA FETCH API ---
    const handleMkChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mkId = e.target.value;
        setData('mata_kuliah_id', mkId);
        setCpmkList([]);
        setData('penilaian', []); // Reset jika MK diganti
        setData('pertemuan', []); // Reset jika MK diganti

        if (mkId) {
            try {
                const response = await axios.get(`/api/mata-kuliah/${mkId}/rps-data`);
                if (response.data.status === 'success') {
                    setCpmkList(response.data.data.cpmks);
                }
            } catch (error) {
                console.error("Gagal menarik data CPMK:", error);
            }
        }
    };

    // --- LOGIKA ARRAY DINAMIS TAHAP 2 (MATRIKS) ---
    const addPenilaian = () => {
        setData('penilaian', [...data.penilaian, { cpmk_id: '', kuis: 0, tugas: 0, project: 0, uts: 0, uas: 0 }]);
    };
    const updatePenilaian = (index: number, field: string, value: string | number) => {
        const newData = [...data.penilaian];
        newData[index][field] = value;
        setData('penilaian', newData);
    };
    const removePenilaian = (index: number) => {
        setData('penilaian', data.penilaian.filter((_, i) => i !== index));
    };

    // --- LOGIKA ARRAY DINAMIS TAHAP 3 (MINGGUAN) ---
    const addPertemuan = () => {
        setData('pertemuan', [...data.pertemuan, { 
            pertemuan_ke: '', kemampuan_akhir: '', indikator: '', bahan_kajian: '', 
            metode_pembelajaran: '', estimasi_waktu: '', pengalaman_belajar: '', 
            metode_penilaian: '', bobot_penilaian: 0, cpmk_ids: [] 
        }]);
    };
    const updatePertemuan = (index: number, field: string, value: any) => {
        const newData = [...data.pertemuan];
        newData[index][field] = value;
        setData('pertemuan', newData);
    };
    const handleCheckboxCpmk = (index: number, cpmkId: number, checked: boolean) => {
        const newData = [...data.pertemuan];
        let currentIds = [...newData[index].cpmk_ids];
        if (checked) currentIds.push(cpmkId);
        else currentIds = currentIds.filter(id => id !== cpmkId);
        
        newData[index].cpmk_ids = currentIds;
        setData('pertemuan', newData);
    };
    const removePertemuan = (index: number) => {
        setData('pertemuan', data.pertemuan.filter((_, i) => i !== index));
    };

    // --- PENGENDALI FORM ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            post(route('rps.store'));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tempa RPS Baru" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    
                    {/* Stepper */}
                    <div className="flex justify-between border-b pb-4 mb-6">
                        <h2 className="font-bold text-2xl text-gray-800">Pembuatan RPS</h2>
                        <div className="flex gap-4 text-sm font-bold">
                            <span className={step === 1 ? "text-blue-600" : "text-gray-400"}>1. Identitas</span>
                            <span className="text-gray-300">❯</span>
                            <span className={step === 2 ? "text-blue-600" : "text-gray-400"}>2. Matriks</span>
                            <span className="text-gray-300">❯</span>
                            <span className={step === 3 ? "text-blue-600" : "text-gray-400"}>3. Mingguan</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* FASE 1: IDENTITAS */}
                        <div className={step === 1 ? 'block' : 'hidden'}>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <InputLabel value="Pilih Mata Kuliah" />
                                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" value={data.mata_kuliah_id} onChange={handleMkChange} required={step === 1}>
                                        <option value="">-- Pilih Pusaka MK --</option>
                                        {mataKuliahs.map(mk => (<option key={mk.id} value={mk.id}>{mk.kode_mk} - {mk.nama_mk}</option>))}
                                    </select>
                                    {errors.mata_kuliah_id && <div className="text-red-500 text-xs mt-1">{errors.mata_kuliah_id}</div>}
                                </div>
                                <div>
                                    <InputLabel value="Tahun Akademik" />
                                    <TextInput className="mt-1 block w-full" placeholder="2025/2026" value={data.tahun_akademik} onChange={e => setData('tahun_akademik', e.target.value)} required={step === 1} />
                                </div>
                                <div>
                                    <InputLabel value="Semester Ke-" />
                                    <TextInput type="number" className="mt-1 block w-full" value={data.semester_ke} onChange={e => setData('semester_ke', e.target.value)} required={step === 1} />
                                </div>
                                <div>
                                    <InputLabel value="Pilih Kaprodi" />
                                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" value={data.kaprodi_id} onChange={e => setData('kaprodi_id', e.target.value)} required={step === 1}>
                                        <option value="">-- Pilih Kaprodi --</option>
                                        {kaprodis && kaprodis.map((kaprodi: any) => (<option key={kaprodi.id} value={kaprodi.id}>{kaprodi.name}</option>))}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <InputLabel value="Nama Kajur (Manual)" />
                                    <TextInput className="mt-1 block w-full" placeholder="Contoh: Dr. Budi Santoso, M.T." value={data.nama_kajur} onChange={e => setData('nama_kajur', e.target.value)} required={step === 1} />
                                </div>
                            </div>
                        </div>

                        {/* FASE 2: MATRIKS */}
                        <div className={step === 2 ? 'block' : 'hidden'}>
                            <button type="button" onClick={addPenilaian} className="mb-4 bg-green-500 text-white px-4 py-2 rounded font-bold text-sm">+ Tambah Matriks Penilaian</button>
                            {data.penilaian.map((item, index) => (
                                <div key={index} className="border p-4 rounded-lg mb-4 bg-gray-50 relative">
                                    <button type="button" onClick={() => removePenilaian(index)} className="absolute top-2 right-2 text-red-500 font-bold">X Hapus</button>
                                    <div className="grid grid-cols-6 gap-4">
                                        <div className="col-span-6">
                                            <InputLabel value={`Target CPMK (Baris ${index + 1})`} />
                                            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm" value={item.cpmk_id} onChange={e => updatePenilaian(index, 'cpmk_id', e.target.value)} required={step === 2}>
                                                <option value="">-- Pilih CPMK --</option>
                                                {cpmkList.map(c => (<option key={c.id} value={c.id}>{c.kode_cpmk}</option>))}
                                            </select>
                                        </div>
                                        <div><InputLabel value="Kuis (%)" /><TextInput type="number" className="w-full mt-1" value={item.kuis} onChange={e => updatePenilaian(index, 'kuis', e.target.value)} /></div>
                                        <div><InputLabel value="Tugas (%)" /><TextInput type="number" className="w-full mt-1" value={item.tugas} onChange={e => updatePenilaian(index, 'tugas', e.target.value)} /></div>
                                        <div><InputLabel value="Project (%)" /><TextInput type="number" className="w-full mt-1" value={item.project} onChange={e => updatePenilaian(index, 'project', e.target.value)} /></div>
                                        <div><InputLabel value="UTS (%)" /><TextInput type="number" className="w-full mt-1" value={item.uts} onChange={e => updatePenilaian(index, 'uts', e.target.value)} /></div>
                                        <div><InputLabel value="UAS (%)" /><TextInput type="number" className="w-full mt-1" value={item.uas} onChange={e => updatePenilaian(index, 'uas', e.target.value)} /></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* FASE 3: MINGGUAN */}
                        <div className={step === 3 ? 'block' : 'hidden'}>
                            <button type="button" onClick={addPertemuan} className="mb-4 bg-green-500 text-white px-4 py-2 rounded font-bold text-sm">+ Tambah Pertemuan</button>
                            {data.pertemuan.map((item, index) => (
                                <div key={index} className="border p-4 rounded-lg mb-4 bg-blue-50 relative">
                                    <button type="button" onClick={() => removePertemuan(index)} className="absolute top-2 right-2 text-red-500 font-bold">X Hapus</button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <InputLabel value="Pilih CPMK Terkait (Bisa lebih dari 1)" />
                                            <div className="flex gap-4 mt-2">
                                                {cpmkList.map(c => (
                                                    <label key={c.id} className="flex items-center space-x-2 text-sm">
                                                        <input type="checkbox" checked={item.cpmk_ids.includes(c.id)} onChange={e => handleCheckboxCpmk(index, c.id, e.target.checked)} className="rounded border-gray-300" />
                                                        <span>{c.kode_cpmk}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div><InputLabel value="Pertemuan Ke-" /><TextInput className="w-full mt-1" placeholder="Misal: 1 atau 1-2" value={item.pertemuan_ke} onChange={e => updatePertemuan(index, 'pertemuan_ke', e.target.value)} required={step === 3}/></div>
                                        <div><InputLabel value="Bobot Penilaian (%)" /><TextInput type="number" className="w-full mt-1" value={item.bobot_penilaian} onChange={e => updatePertemuan(index, 'bobot_penilaian', e.target.value)} /></div>
                                        <div className="col-span-2"><InputLabel value="Kemampuan Akhir" /><textarea className="w-full mt-1 border-gray-300 rounded-md shadow-sm" value={item.kemampuan_akhir} onChange={e => updatePertemuan(index, 'kemampuan_akhir', e.target.value)} /></div>
                                        {/* Tambahkan textarea lain (Indikator, Bahan Kajian, Metode) di sini jika perlu */}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CONTROLS */}
                        <div className="flex justify-between mt-8 pt-4 border-t">
                            {step > 1 ? (
                                <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded-lg font-bold">Mundur</button>
                            ) : (
                                <Link href={route('rps.index')} className="px-4 py-2 text-gray-500 font-bold">Batal</Link>
                            )}
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold" disabled={processing}>
                                {step < 3 ? 'Selanjutnya ❯' : 'Tempa Prasasti RPS'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
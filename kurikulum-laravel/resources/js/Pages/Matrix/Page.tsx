import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// --- Interfaces ---
interface Iea { id: number; kode: string; deskripsi: string; }
interface Cpl { id: number; kode: string; deskripsi: string; ieas?: Iea[]; }
interface Ppm { id: number; kode: string; deskripsi: string; ieas?: Iea[]; }
interface Ik { id: number; kode: string; deskripsi: string; cpl_id: number; } // <-- Tambahan Interface IK

interface Props {
    cpls: Cpl[];
    ieas: Iea[];
    ppms: Ppm[];
    iks: Ik[]; // <-- Menerima Props IK dari Controller
    cplToPpmMatrix: Record<number, Record<number, boolean>>;
}

export default function MatrixPage({ cpls, ieas, ppms, iks, cplToPpmMatrix }: Props) {
    // State Tab diperbarui dengan opsi ke-4
    const [activeTab, setActiveTab] = useState<'iea-cpl' | 'iea-ppm' | 'cpl-ppm' | 'cpl-ik'>('iea-cpl');

    const handleSyncCpl = (cplId: number, ieaId: number, isSelected: boolean) => {
        router.post('/matrix/sync-cpl-iea', { cpl_id: cplId, iea_id: ieaId, is_selected: isSelected }, { preserveScroll: true });
    };

    const handleSyncPpm = (ppmId: number, ieaId: number, isSelected: boolean) => {
        router.post('/matrix/sync-ppm-iea', { ppm_id: ppmId, iea_id: ieaId, is_selected: isSelected }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Curriculum Mapping Matrix" />

            <div className="mb-6">
                <h2 className="font-headline font-bold text-2xl text-gray-900">Outcome Mapping Matrix</h2>
                <p className="text-gray-500 text-sm mt-1">Pemetaan relasional otomatis antara IEA, CPL, Profil Lulusan (PPM), dan Indikator Kinerja.</p>
            </div>

            {/* --- Sistem Tabs --- */}
            <div className="flex space-x-1 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
                <button
                    onClick={() => setActiveTab('iea-cpl')}
                    className={`py-3 px-6 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                        activeTab === 'iea-cpl' ? 'border-polman-primary text-polman-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    1. Input: IEA x CPL
                </button>
                <button
                    onClick={() => setActiveTab('iea-ppm')}
                    className={`py-3 px-6 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                        activeTab === 'iea-ppm' ? 'border-polman-primary text-polman-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    2. Input: IEA x PPM
                </button>
                <button
                    onClick={() => setActiveTab('cpl-ppm')}
                    className={`py-3 px-6 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                        activeTab === 'cpl-ppm' ? 'border-polman-secondary text-polman-secondary' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    3. Result: CPL x PPM
                </button>
                <button
                    onClick={() => setActiveTab('cpl-ik')}
                    className={`py-3 px-6 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                        activeTab === 'cpl-ik' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    4. Map: CPL x IK
                </button>
            </div>

            {/* ... KODE TAB 1, TAB 2, DAN TAB 3 SAMA SEPERTI SEBELUMNYA ... */}
            {/* (Biarkan Tab 1, 2, 3 persis seperti aslinya. Saya lewati di sini untuk fokus ke Tab 4) */}
            
            {activeTab === 'iea-cpl' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    {/* ... (Kode Tabel Tab 1 Anda yang sudah ada) ... */}
                    <table className="min-w-full border-collapse font-body">
                        <thead>
                            <tr className="bg-polman-neutral">
                                <th className="p-4 border-b border-r text-left text-xs font-bold text-gray-700 uppercase sticky left-0 bg-polman-neutral z-10 w-64">CPL \ IEA</th>
                                {ieas.map(iea => <th key={iea.id} className="p-4 border-b text-center text-[10px] font-bold text-polman-primary uppercase min-w-[80px]">{iea.kode}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {!cpls || cpls.length === 0 ? (
                                <tr><td colSpan={ieas.length + 1} className="p-8 text-center text-gray-500">Silakan isi Master Data CPL terlebih dahulu.</td></tr>
                            ) : cpls.map(cpl => (
                                <tr key={cpl.id} className="hover:bg-gray-50">
                                    <td className="p-4 border-b border-r sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                        <div className="font-bold text-sm text-polman-primary">{cpl.kode}</div>
                                        <div className="text-[10px] text-gray-500 truncate w-56">{cpl.deskripsi}</div>
                                    </td>
                                    {ieas.map(iea => {
                                        const isChecked = cpl.ieas?.some(item => item.id === iea.id) || false;
                                        return (
                                            <td key={iea.id} className="p-4 border-b text-center">
                                                <input type="checkbox" checked={isChecked} onChange={(e) => handleSyncCpl(cpl.id, iea.id, e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-polman-primary focus:ring-polman-primary cursor-pointer" />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'iea-ppm' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    {/* ... (Kode Tabel Tab 2 Anda yang sudah ada) ... */}
                    <table className="min-w-full border-collapse font-body">
                        <thead>
                            <tr className="bg-polman-neutral">
                                <th className="p-4 border-b border-r text-left text-xs font-bold text-gray-700 uppercase sticky left-0 bg-polman-neutral z-10 w-64">PPM \ IEA</th>
                                {ieas.map(iea => <th key={iea.id} className="p-4 border-b text-center text-[10px] font-bold text-polman-primary uppercase min-w-[80px]">{iea.kode}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {!ppms || ppms.length === 0 ? (
                                <tr><td colSpan={ieas.length + 1} className="p-8 text-center text-gray-500">Silakan isi Master Data PPM terlebih dahulu.</td></tr>
                            ) : ppms.map(ppm => (
                                <tr key={ppm.id} className="hover:bg-gray-50">
                                    <td className="p-4 border-b border-r sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                        <div className="font-bold text-sm text-polman-primary">{ppm.kode}</div>
                                        <div className="text-[10px] text-gray-500 truncate w-56">{ppm.deskripsi}</div>
                                    </td>
                                    {ieas.map(iea => {
                                        const isChecked = ppm.ieas?.some(item => item.id === iea.id) || false;
                                        return (
                                            <td key={iea.id} className="p-4 border-b text-center">
                                                <input type="checkbox" checked={isChecked} onChange={(e) => handleSyncPpm(ppm.id, iea.id, e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-polman-primary focus:ring-polman-primary cursor-pointer" />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'cpl-ppm' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    <div className="p-4 bg-blue-50 border-b border-blue-100 text-sm text-blue-800 flex items-center gap-2 font-body">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Tabel ini dihasilkan secara otomatis. Relasi terbentuk jika CPL dan PPM beririsan pada IEA yang sama.
                    </div>
                    {/* ... (Kode Tabel Tab 3 Anda yang sudah ada) ... */}
                    <table className="min-w-full border-collapse font-body">
                        <thead>
                            <tr className="bg-polman-secondary text-white">
                                <th className="p-4 border-b border-r border-polman-primary text-left text-xs font-bold uppercase sticky left-0 bg-polman-secondary z-10 w-64">CPL \ PPM</th>
                                {ppms.map(ppm => <th key={ppm.id} className="p-4 border-b border-polman-primary text-center text-[10px] font-bold uppercase min-w-[80px]">{ppm.kode}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {!cpls || cpls.length === 0 ? (
                                <tr><td colSpan={ppms.length + 1} className="p-8 text-center text-gray-500">Data belum tersedia.</td></tr>
                            ) : cpls.map(cpl => (
                                <tr key={cpl.id} className="hover:bg-gray-50">
                                    <td className="p-4 border-b border-r sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                        <div className="font-bold text-sm text-polman-secondary">{cpl.kode}</div>
                                    </td>
                                    {ppms.map(ppm => {
                                        const isLinked = cplToPpmMatrix[cpl.id] && cplToPpmMatrix[cpl.id][ppm.id];
                                        return (
                                            <td key={ppm.id} className="p-4 border-b text-center bg-gray-50/30">
                                                {isLinked ? <div className="w-6 h-6 mx-auto bg-polman-secondary rounded flex items-center justify-center text-white font-bold text-xs shadow-sm">✓</div> : <div className="text-gray-300">-</div>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- TAB 4 (BARU): HASIL PEMETAAN CPL x IK (Read-Only) --- */}
            {activeTab === 'cpl-ik' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    <div className="p-4 bg-indigo-50 border-b border-indigo-100 text-sm text-indigo-800 flex items-center gap-2 font-body">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Tabel Visualisasi. Data ini otomatis digenerate berdasarkan pilihan CPL saat Anda membuat Indikator Kinerja di menu Master Data.
                    </div>
                    <table className="min-w-full border-collapse font-body">
                        <thead>
                            <tr className="bg-indigo-600 text-white">
                                <th className="p-4 border-b border-r border-indigo-500 text-left text-xs font-bold uppercase sticky left-0 bg-indigo-600 z-10 w-64">CPL \ IK</th>
                                {iks && iks.map(ik => (
                                    <th key={ik.id} className="p-4 border-b border-indigo-500 text-center text-[10px] font-bold uppercase min-w-[80px]">
                                        {ik.kode}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {!cpls || cpls.length === 0 ? (
                                <tr><td colSpan={(iks?.length || 0) + 1} className="p-8 text-center text-gray-500">Data CPL belum tersedia.</td></tr>
                            ) : cpls.map(cpl => (
                                <tr key={cpl.id} className="hover:bg-indigo-50/30">
                                    <td className="p-4 border-b border-r sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                        <div className="font-bold text-sm text-indigo-700">{cpl.kode}</div>
                                    </td>
                                    {iks && iks.map(ik => {
                                        // Pengecekan Relasi: Jika cpl_id di tabel IK sama dengan id CPL pada baris ini
                                        const isLinked = ik.cpl_id === cpl.id;
                                        return (
                                            <td key={ik.id} className="p-4 border-b text-center bg-gray-50/10">
                                                {isLinked ? (
                                                    <div className="w-6 h-6 mx-auto bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs shadow-sm">✓</div>
                                                ) : (
                                                    <div className="text-gray-300">-</div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
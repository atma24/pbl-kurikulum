import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { MatrixProps } from '@/types/matrix';

export default function MatrixIndex({ cpls, ieas, ppms, cplToPpmMatrix }: MatrixProps) {
    const [activeTab, setActiveTab] = useState<'cpl_iea' | 'cpl_ppm'>('cpl_iea');
    const [isSaving, setIsSaving] = useState(false);

    // Local State untuk menampung matriks CPL x IEA
    // Format: { cpl_id: { iea_id: boolean } }
    const [localMatrix, setLocalMatrix] = useState<Record<number, Record<number, boolean>>>({});

    // 1. Inisialisasi data dari Backend ke Local State
    useEffect(() => {
        const initialState: Record<number, Record<number, boolean>> = {};
        
        cpls.forEach(cpl => {
            initialState[cpl.id] = {};
            // Buat default false untuk semua IEA
            ieas.forEach(iea => {
                initialState[cpl.id][iea.id] = false;
            });
            // Timpa dengan true jika data dari backend (database) memiliki relasi
            if (cpl.ieas && cpl.ieas.length > 0) {
                cpl.ieas.forEach(iea => {
                    initialState[cpl.id][iea.id] = true;
                });
            }
        });
        
        setLocalMatrix(initialState);
    }, [cpls, ieas]);

    // 2. Handler saat checkbox di-klik (Hanya mengubah memori lokal, TIDAK menembak API)
    const handleCheckboxChange = (cplId: number, ieaId: number) => {
        setLocalMatrix(prev => ({
            ...prev,
            [cplId]: {
                ...prev[cplId],
                [ieaId]: !prev[cplId][ieaId] // Toggle nilai boolean
            }
        }));
    };

    // 3. Handler Bulk Update (Menembak API sekaligus)
    const handleBulkSave = () => {
        setIsSaving(true);
        
        // Transform state object menjadi array yang mudah dibaca backend
        const payload = [];
        for (const cplId in localMatrix) {
            for (const ieaId in localMatrix[cplId]) {
                payload.push({
                    cpl_id: parseInt(cplId),
                    iea_id: parseInt(ieaId),
                    is_selected: localMatrix[cplId][ieaId]
                });
            }
        }

        // Tembak ke endpoint backend
        router.post(route('matrix.sync.bulk'), { matrix_data: payload }, {
            preserveScroll: true,
            onFinish: () => setIsSaving(false),
            onSuccess: () => alert('Matriks berhasil disimpan!'),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-headline font-bold text-xl text-polman-secondary leading-tight">Curriculum Mapping Matrix</h2>}
        >
            <Head title="Matrix Mapping" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl p-6 border border-gray-100">
                        
                        {/* Sistem Navigasi Tabs */}
                        <div className="flex border-b border-gray-200 mb-6">
                            <button
                                className={`py-3 px-6 text-sm font-label font-bold border-b-2 transition-colors ${
                                    activeTab === 'cpl_iea' 
                                        ? 'border-polman-primary text-polman-primary' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                onClick={() => setActiveTab('cpl_iea')}
                            >
                                INPUT: CPL x IEA
                            </button>
                            <button
                                className={`py-3 px-6 text-sm font-label font-bold border-b-2 transition-colors ${
                                    activeTab === 'cpl_ppm' 
                                        ? 'border-polman-primary text-polman-primary' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                onClick={() => setActiveTab('cpl_ppm')}
                            >
                                RESULT: CPL x PPM
                            </button>
                        </div>

                        {/* TAB 1: AREA INPUT MATRIKS */}
                        {activeTab === 'cpl_iea' && (
                            <div className="space-y-6">
                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm font-body">
                                        <thead className="bg-polman-neutral">
                                            <tr>
                                                <th className="px-6 py-3 text-left font-bold text-gray-700 uppercase tracking-wider sticky left-0 bg-polman-neutral z-10 border-r border-gray-200">
                                                    CPL \ IEA
                                                </th>
                                                {ieas.map(iea => (
                                                    <th key={iea.id} className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider min-w-[100px]">
                                                        {iea.kode}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {cpls.map(cpl => (
                                                <tr key={cpl.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb]">
                                                        {cpl.kode}
                                                    </td>
                                                    {ieas.map(iea => (
                                                        <td key={iea.id} className="px-4 py-4 whitespace-nowrap text-center">
                                                            <input
                                                                type="checkbox"
                                                                className="w-5 h-5 text-polman-primary border-gray-300 rounded focus:ring-polman-primary cursor-pointer transition-colors"
                                                                checked={localMatrix[cpl.id]?.[iea.id] || false}
                                                                onChange={() => handleCheckboxChange(cpl.id, iea.id)}
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Tombol Bulk Save */}
                                <div className="flex justify-end">
                                    <PrimaryButton 
                                        className="w-auto px-8" 
                                        onClick={handleBulkSave} 
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Menyimpan...' : 'Simpan Matriks'}
                                    </PrimaryButton>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: AREA HASIL READ-ONLY */}
                        {activeTab === 'cpl_ppm' && (
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200 text-sm font-body">
                                    <thead className="bg-gray-800 text-white">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-bold uppercase tracking-wider sticky left-0 bg-gray-900 z-10 border-r border-gray-700">
                                                CPL \ PPM
                                            </th>
                                            {ppms.map(ppm => (
                                                <th key={ppm.id} className="px-4 py-3 text-center font-bold uppercase tracking-wider min-w-[100px]">
                                                    {ppm.kode}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {cpls.map(cpl => (
                                            <tr key={cpl.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb]">
                                                    {cpl.kode}
                                                </td>
                                                {ppms.map(ppm => {
                                                    // Ambil hasil kalkulasi transitif dari props backend
                                                    const isMet = cplToPpmMatrix[cpl.id]?.[ppm.id];
                                                    return (
                                                        <td key={ppm.id} className="px-4 py-4 whitespace-nowrap text-center">
                                                            {isMet ? (
                                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-polman-primary text-white rounded-full">
                                                                    ✓
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-300">-</span>
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

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
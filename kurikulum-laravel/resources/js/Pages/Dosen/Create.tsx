import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function CreateDosen() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        nip: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Menembak route dosen.store di backend
        post(route('dosen.store'), {
            onSuccess: () => reset('password'),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Registrasi Akun Dosen</h2>}
        >
            <Head title="Register Dosen" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8 border border-gray-200">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Lengkap" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    isFocused
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="nip" value="NIP (Nomor Induk Pegawai)" />
                                <TextInput
                                    id="nip"
                                    className="mt-1 block w-full"
                                    value={data.nip}
                                    onChange={(e) => setData('nip', e.target.value)}
                                    required
                                />
                                <InputError className="mt-2" message={errors.nip} />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email Dosen" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password Awal" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="mt-1 block w-full"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError className="mt-2" message={errors.password} />
                                <p className="text-xs text-red-500 mt-1">*Kaprodi menginput password awal. Dosen diwajibkan mengubahnya nanti.</p>
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <PrimaryButton className="ml-4 bg-teal-600 hover:bg-teal-700" disabled={processing}>
                                    Simpan & Daftarkan Dosen
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
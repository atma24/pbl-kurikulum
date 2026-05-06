import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    className = '',
    onSuccess,
}: {
    className?: string;
    onSuccess?: () => void;
}) {
    const { user, roles } = usePage().props.auth as any;
    const roleName = roles?.length > 0 ? roles[0] : 'Dosen';

    // Payload: nama + NIP
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        nip:  user.nip ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => {
                onSuccess?.();
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-5">

                {/* Jabatan — Read Only */}
                <div>
                    <InputLabel htmlFor="role" value="Jabatan Sistem" className="text-xs uppercase tracking-wider text-gray-500" />
                    <TextInput
                        id="role"
                        type="text"
                        className="mt-1 block w-full bg-gray-50 border-gray-200 text-teal-700 cursor-not-allowed font-bold"
                        value={roleName}
                        disabled
                    />
                </div>

                {/* Email — Read Only */}
                <div>
                    <InputLabel htmlFor="email" value="Email Institusi" className="text-xs uppercase tracking-wider text-gray-500" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                        value={user.email}
                        disabled
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Nama Lengkap */}
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap & Gelar" className="text-xs uppercase tracking-wider text-gray-500" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    {/* NIP */}
                    <div>
                        <InputLabel htmlFor="nip" value="NIP (Nomor Induk Pegawai)" className="text-xs uppercase tracking-wider text-gray-500" />
                        <TextInput
                            id="nip"
                            type="text"
                            className="mt-1 block w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm"
                            value={data.nip}
                            onChange={(e) => setData('nip', e.target.value)}
                            autoComplete="off"
                        />
                        <InputError className="mt-2" message={errors.nip} />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-md font-bold text-xs text-white uppercase tracking-widest hover:bg-teal-700 focus:bg-teal-700 active:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-sm disabled:opacity-60"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-teal-600 font-bold flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

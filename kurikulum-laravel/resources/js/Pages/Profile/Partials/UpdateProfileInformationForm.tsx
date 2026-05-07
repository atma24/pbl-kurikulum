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
    // 1. Tarik user dan roles dari shared props (HandleInertiaRequests)
    const { user, roles } = usePage().props.auth as any;
    const roleName = roles?.length > 0 ? roles[0] : 'Dosen';

    // 2. Payload HANYA berisi nama. NIP dan Email dikunci.
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess,
        });
    };

    return (
        <section className={className}>
            <header className="border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-teal-600 shadow-sm">
                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=0d9488&color=fff&size=128`} alt="Profile" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 font-headline">
                            Informasi Profil
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 font-body">
                            Kelola identitas personal Anda di dalam sistem TRIN.
                        </p>
                    </div>
                </div>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5 font-body">
                
                {/* Field Jabatan (Read-Only) */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Field NIP (Read-Only) */}
                    <div>
                        <InputLabel htmlFor="nip" value="NIP (Nomor Induk Pegawai)" className="text-xs uppercase tracking-wider text-gray-500" />
                        <TextInput
                            id="nip"
                            type="text"
                            className="mt-1 block w-full bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed font-medium"
                            value={user.nip || 'Belum Terdaftar'}
                            disabled
                        />
                    </div>

                    {/* Field Email (Read-Only) */}
                    <div>
                        <InputLabel htmlFor="email" value="Email Institusi" className="text-xs uppercase tracking-wider text-gray-500" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed font-medium"
                            value={user.email}
                            disabled
                        />
                    </div>
                </div>

                {/* Field Nama (Bisa Diubah) */}
                <div className="pt-4">
                    <InputLabel htmlFor="name" value="Nama Lengkap & Gelar Akademik" className="text-xs uppercase tracking-wider text-gray-500" />
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

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-md font-bold text-xs text-white uppercase tracking-widest hover:bg-teal-700 focus:bg-teal-700 active:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-sm"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan Nama'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-teal-600 font-bold flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

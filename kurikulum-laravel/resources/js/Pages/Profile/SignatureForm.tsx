import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface UserProps {
    name: string;
    jabatan: string | null;
    signature_path: string | null;
}

export default function SignatureForm({ user }: { user: UserProps }) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name || '',
        jabatan: user.jabatan || '',
        signature: null as File | null,
        _method: 'PUT',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('signature.update'));
    };

    return (
        <form onSubmit={submit} className="max-w-md p-4 space-y-4">
            <div>
                <label>Nama Dosen</label>
                <input 
                    type="text" 
                    value={data.name} 
                    onChange={e => setData('name', e.target.value)} 
                    className="w-full border p-2"
                />
                {errors.name && <span className="text-red-500">{errors.name}</span>}
            </div>

            <div>
                <label>Jabatan</label>
                <input 
                    type="text" 
                    value={data.jabatan} 
                    onChange={e => setData('jabatan', e.target.value)} 
                    className="w-full border p-2"
                />
                {errors.jabatan && <span className="text-red-500">{errors.jabatan}</span>}
            </div>

            <div>
                <label>Tanda Tangan Digital (Gambar)</label>
                {user.signature_path && (
                    <img src={`/storage/${user.signature_path}`} alt="TTD" className="h-16 mb-2" />
                )}
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setData('signature', e.target.files ? e.target.files[0] : null)} 
                    className="w-full border p-2"
                />
                {errors.signature && <span className="text-red-500">{errors.signature}</span>}
            </div>

            <button type="submit" disabled={processing} className="bg-blue-500 text-white p-2 rounded">
                Simpan
            </button>
        </form>
    );
}
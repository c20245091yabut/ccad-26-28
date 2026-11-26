import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface Inspector {
    inspector_id: number;
    full_name: string;
    email: string;
    phone_number: string;
    position: string;
    status: 'Active' | 'Inactive';
}

export default function Edit({ inspector }: { inspector: Inspector }) {
    const { data, setData, put, processing, errors } = useForm({
        full_name: inspector.full_name,
        email: inspector.email,
        phone_number: inspector.phone_number,
        position: inspector.position,
        status: inspector.status,
    });

    function submit(event: FormEvent) {
        event.preventDefault();
        put(`/inspectors/${inspector.inspector_id}`);
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inspectors', href: '/inspectors' },
            { title: inspector.full_name, href: `/inspectors/${inspector.inspector_id}` },
            { title: 'Edit', href: `/inspectors/${inspector.inspector_id}/edit` },
        ]}>
            <Head title={`Edit ${inspector.full_name}`} />
            <div className="max-w-2xl space-y-6 p-6">
                <Link href={`/inspectors/${inspector.inspector_id}`} className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={16} />Back to Inspector Profile</Link>
                <div><h1 className="text-2xl font-bold">Edit Inspector</h1><p className="text-muted-foreground">Update the inspector profile.</p></div>
                <form onSubmit={submit} className="space-y-5 rounded-xl border bg-card p-6">
                    {([
                        ['full_name', 'Full Name', 'text'],
                        ['email', 'Email', 'email'],
                        ['phone_number', 'Phone Number', 'text'],
                        ['position', 'Position', 'text'],
                    ] as const).map(([name, label, type]) => (
                        <div key={name}>
                            <label className="mb-2 block text-sm font-medium">{label}</label>
                            <input type={type} value={data[name]} onChange={event => setData(name, event.target.value)} className="w-full rounded-lg border bg-background px-3 py-2" />
                            {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
                        </div>
                    ))}
                    <div>
                        <label className="mb-2 block text-sm font-medium">Status</label>
                        <select value={data.status} onChange={event => setData('status', event.target.value as 'Active' | 'Inactive')} className="w-full rounded-lg border bg-background px-3 py-2">
                            <option value="Active">Active</option><option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <button type="submit" disabled={processing} className="rounded-lg bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50">{processing ? 'Updating...' : 'Update Inspector'}</button>
                </form>
            </div>
        </AppLayout>
    );
}

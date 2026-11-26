import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        email: '',
        phone_number: '',
        position: '',
        status: 'Active',
    });

    function submit(event: FormEvent) {
        event.preventDefault();
        post('/inspectors');
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inspectors', href: '/inspectors' },
            { title: 'Add Inspector', href: '/inspectors/create' },
        ]}>
            <Head title="Add Inspector" />
            <div className="max-w-2xl space-y-6 p-6">
                <Link href="/inspectors" className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={16} />Back to Inspectors</Link>
                <div><h1 className="text-2xl font-bold">Add Inspector</h1><p className="text-muted-foreground">Create an inspector profile.</p></div>
                <form onSubmit={submit} className="space-y-5 rounded-xl border bg-card p-6">
                    {([
                        ['full_name', 'Full Name', 'text', 'Example: Maria Santos'],
                        ['email', 'Email', 'email', 'Example: maria@example.com'],
                        ['phone_number', 'Phone Number', 'text', 'Example: 0912 345 6789'],
                        ['position', 'Position', 'text', 'Example: Quality Inspector'],
                    ] as const).map(([name, label, type, placeholder]) => (
                        <div key={name}>
                            <label className="mb-2 block text-sm font-medium">{label}</label>
                            <input type={type} value={data[name]} onChange={event => setData(name, event.target.value)} placeholder={placeholder} className="w-full rounded-lg border bg-background px-3 py-2" />
                            {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
                        </div>
                    ))}
                    <div>
                        <label className="mb-2 block text-sm font-medium">Status</label>
                        <select value={data.status} onChange={event => setData('status', event.target.value as 'Active' | 'Inactive')} className="w-full rounded-lg border bg-background px-3 py-2">
                            <option value="Active">Active</option><option value="Inactive">Inactive</option>
                        </select>
                        {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
                    </div>
                    <button type="submit" disabled={processing} className="rounded-lg bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50">{processing ? 'Saving...' : 'Save Inspector'}</button>
                </form>
            </div>
        </AppLayout>
    );
}

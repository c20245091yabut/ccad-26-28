import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { FormEvent } from 'react';

interface Inspector {
    inspector_id: number;
    full_name: string;
    email: string;
    phone_number: string;
    position: string;
    status: 'Active' | 'Inactive';
}

interface Props {
    inspectors: {
        data: Inspector[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    search: string;
}

export default function Index({ inspectors, search }: Props) {
    function submitSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const value = String(form.get('search') ?? '');
        router.get('/inspectors', value ? { search: value } : {}, {
            preserveState: true,
            replace: true,
        });
    }

    function deleteInspector(id: number) {
        if (confirm('Are you sure you want to delete this inspector?')) {
            router.delete(`/inspectors/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Inspectors', href: '/inspectors' }]}>
            <Head title="Inspectors" />
            <div className="space-y-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold">Inspectors</h1>
                        <p className="text-muted-foreground">Manage inspector profiles and status.</p>
                    </div>
                    <Link href="/inspectors/create" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground">
                        <Plus size={18} /> Add Inspector
                    </Link>
                </div>

                <form onSubmit={submitSearch} className="flex max-w-md gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                        <input name="search" defaultValue={search} placeholder="Search by inspector name" className="w-full rounded-lg border bg-background py-2 pl-9 pr-3" />
                    </div>
                    <button type="submit" className="rounded-lg border px-4 text-sm">Search</button>
                </form>

                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Position</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inspectors.data.length > 0 ? inspectors.data.map(inspector => (
                                <tr key={inspector.inspector_id} className="border-t">
                                    <td className="p-4">
                                        <Link href={`/inspectors/${inspector.inspector_id}`} className="font-medium hover:underline">
                                            {inspector.full_name}
                                        </Link>
                                    </td>
                                    <td className="p-4">{inspector.position}</td>
                                    <td className="p-4">{inspector.email}</td>
                                    <td className="p-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${inspector.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {inspector.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <Link href={`/inspectors/${inspector.inspector_id}/edit`} className="rounded-lg p-2 text-blue-600 hover:bg-muted" title="Edit"><Pencil size={17} /></Link>
                                            <button type="button" onClick={() => deleteInspector(inspector.inspector_id)} className="rounded-lg p-2 text-red-500 hover:bg-muted" title="Delete"><Trash2 size={17} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground"><ShieldCheck className="mx-auto mb-2" />No inspectors found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-wrap gap-2">
                    {inspectors.links.map((link, index) => (
                        <Link key={index} href={link.url || '#'} preserveScroll preserveState className={`rounded-lg border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : ''} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

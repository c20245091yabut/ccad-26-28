import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ClipboardCheck, Pencil } from 'lucide-react';

interface Inspector {
    inspector_id: number;
    full_name: string;
    email: string;
    phone_number: string;
    position: string;
    status: 'Active' | 'Inactive';
}

interface HistoryItem {
    inspection_id: number;
    inspection_date: string;
    quality_status: string;
    remarks: string | null;
    inventory_batch?: {
        batch_number: string;
        ingredient?: {
            ingredient_name: string;
            supplier?: { supplier_name: string };
        };
    };
}

export default function Show({
    inspector,
    history,
}: {
    inspector: Inspector;
    history: { data: HistoryItem[]; links: { url: string | null; label: string; active: boolean }[] };
}) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Inspectors', href: '/inspectors' },
            { title: inspector.full_name, href: `/inspectors/${inspector.inspector_id}` },
        ]}>
            <Head title={inspector.full_name} />
            <div className="space-y-6 p-6">
                <Link href="/inspectors" className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={16} />Back to Inspectors</Link>
                <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border bg-card p-6">
                    <div>
                        <h1 className="text-2xl font-bold">{inspector.full_name}</h1>
                        <p className="text-muted-foreground">{inspector.position}</p>
                        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                            <p><span className="font-medium">Email:</span> {inspector.email}</p>
                            <p><span className="font-medium">Phone:</span> {inspector.phone_number}</p>
                            <p><span className="font-medium">Status:</span> {inspector.status}</p>
                        </div>
                    </div>
                    <Link href={`/inspectors/${inspector.inspector_id}/edit`} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"><Pencil size={16} />Edit Profile</Link>
                </div>

                <div className="overflow-x-auto rounded-xl border bg-card">
                    <div className="border-b p-4"><h2 className="flex items-center gap-2 font-semibold"><ClipboardCheck size={18} />Inspection History</h2></div>
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-4 text-left">Supplier</th>
                                <th className="p-4 text-left">Ingredient</th>
                                <th className="p-4 text-left">Batch</th>
                                <th className="p-4 text-left">Date</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.data.length > 0 ? history.data.map(item => (
                                <tr key={item.inspection_id} className="border-t">
                                    <td className="p-4">{item.inventory_batch?.ingredient?.supplier?.supplier_name ?? 'N/A'}</td>
                                    <td className="p-4">{item.inventory_batch?.ingredient?.ingredient_name ?? 'N/A'}</td>
                                    <td className="p-4">{item.inventory_batch?.batch_number ?? 'N/A'}</td>
                                    <td className="p-4">{String(item.inspection_date).slice(0, 10)}</td>
                                    <td className="p-4">{item.quality_status}</td>
                                    <td className="p-4">{item.remarks || '—'}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No inspection history found.</td></tr>
                            )}
                        </tbody>
                    </table>
                    {history.links.length > 0 && (
                        <div className="flex flex-wrap gap-2 border-t p-4">
                            {history.links.map((link, index) => (
                                <Link key={index} href={link.url || '#'} preserveScroll preserveState className={`rounded-lg border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : ''} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

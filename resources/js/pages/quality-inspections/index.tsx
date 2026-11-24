import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Warehouse } from 'lucide-react';

interface Inspection {
    inspection_id: number;
    batch_id: number;
    inspector_name: string;
    inspection_date: string;
    quality_status: string;
    remarks: string | null;
    inventory_batch?: {
        batch_number: string;
        ingredient?: {
            ingredient_name: string;
        };
    };
}

interface Props {
    inspections: {
        data: Inspection[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

export default function Index({ inspections }: Props) {
    function deleteInspection(id: number) {
        if (confirm('Are you sure you want to delete this inspection?')) {
            router.delete(`/quality-inspections/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'Quality Inspections', href: '/quality-inspections' },
        ]}>
            <Head title="Quality Inspections" />

            <div className="space-y-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold">Quality Inspections</h1>
                        <p className="text-muted-foreground">
                            Manage ingredient quality inspection records.
                        </p>
                    </div>

                    <Link
                        href="/quality-inspections/create"
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                    >
                        <Plus size={18} />
                        Add Inspection
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-4 text-left">Batch</th>
                                <th className="p-4 text-left">Ingredient</th>
                                <th className="p-4 text-left">Inspector</th>
                                <th className="p-4 text-left">Date</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Remarks</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {inspections.data.length > 0 ? (
                                inspections.data.map(item => (
                                    <tr key={item.inspection_id} className="border-t">
                                        <td className="p-4">
                                            {item.inventory_batch?.batch_number ?? item.batch_id}
                                        </td>

                                        <td className="p-4">
                                            {item.inventory_batch?.ingredient?.ingredient_name ?? 'N/A'}
                                        </td>

                                        <td className="p-4">{item.inspector_name}</td>

                                        <td className="p-4">
                                            {String(item.inspection_date).slice(0, 10)}
                                        </td>

                                        <td className="p-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                item.quality_status === 'Passed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : item.quality_status === 'Failed'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {item.quality_status}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            {item.remarks || '—'}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/quality-inspections/${item.inspection_id}/edit`}
                                                    className="rounded-lg p-2 text-blue-600 hover:bg-muted"
                                                    title="Edit"
                                                >
                                                    <Pencil size={17} />
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => deleteInspection(item.inspection_id)}
                                                    className="rounded-lg p-2 text-red-500 hover:bg-muted"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        <Warehouse className="mx-auto mb-2" size={30} />
                                        No quality inspections found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-2">
                    {inspections.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            preserveScroll
                            className={`rounded-lg border px-3 py-2 text-sm ${
                                link.active ? 'bg-primary text-primary-foreground' : ''
                            } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Warehouse, Pencil, Trash2 } from 'lucide-react';

interface WarehouseItem {
    warehouse_id: number;
    warehouse_name: string;
}

interface Props {
    warehouses: {
        data: WarehouseItem[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

export default function Index({ warehouses }: Props) {
    function deleteWarehouse(id: number, name: string) {
        const confirmed = window.confirm(
            `Are you sure you want to delete warehouse ${name}?`
        );

        if (confirmed) {
            router.delete(`/warehouses/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'Warehouses', href: '/warehouses' },
        ]}>
            <Head title="Warehouses" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Warehouses</h1>
                        <p className="text-muted-foreground">
                            Manage your ingredient storage locations.
                        </p>
                    </div>

                    <Link
                        href="/warehouses/create"
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                    >
                        <Plus size={18} />
                        Add Warehouse
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-3 text-left font-semibold">
                                    Warehouse Name
                                </th>
                                <th className="p-3 text-left font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {warehouses.data.length > 0 ? (
                                warehouses.data.map((warehouse) => (
                                    <tr
                                        key={warehouse.warehouse_id}
                                        className="border-t"
                                    >
                                        <td className="p-3 font-medium">
                                            {warehouse.warehouse_name}
                                        </td>

                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/warehouses/${warehouse.warehouse_id}/edit`}
                                                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs hover:bg-muted"
                                                >
                                                    <Pencil size={14} />
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteWarehouse(
                                                            warehouse.warehouse_id,
                                                            warehouse.warehouse_name
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-lg border border-red-500 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        <Warehouse className="mx-auto mb-2" />
                                        No warehouses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-2">
                    {warehouses.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url ?? '#'}
                            preserveScroll
                            className={`rounded border px-3 py-2 text-sm ${
                                link.active
                                    ? 'bg-primary text-primary-foreground'
                                    : ''
                            } ${
                                !link.url
                                    ? 'pointer-events-none opacity-50'
                                    : ''
                            }`}
                            dangerouslySetInnerHTML={{
                                __html: link.label,
                            }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
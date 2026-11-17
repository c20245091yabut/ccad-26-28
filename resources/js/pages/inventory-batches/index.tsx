
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Plus, Package, Pencil, Trash2, Search, X } from 'lucide-react';

interface Batch {
    batch_id: number;
    batch_number: string;
    quantity_kg: number;
    unit_cost: number;
    total_batch_value: number;
    expiry_date: string;
    quality_status: string;
    ingredient?: {
        ingredient_name: string;
    };
    warehouse?: {
        warehouse_name: string;
    };
}

interface Props {
    batches: {
        data: Batch[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    search: string;
}

export default function Index({ batches, search: initialSearch }: Props) {
    const [search, setSearch] = useState(initialSearch ?? '');

    function handleSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        router.get(
            '/inventory-batches',
            { search },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    function clearSearch() {
        setSearch('');

        router.get(
            '/inventory-batches',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    function deleteBatch(id: number, batchNumber: string) {
        const confirmed = window.confirm(
            `Are you sure you want to delete batch ${batchNumber}?`
        );

        if (confirmed) {
            router.delete(`/inventory-batches/${id}`);
        }
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Inventory Batches', href: '/inventory-batches' },
            ]}
        >
            <Head title="Inventory Batches" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Inventory Batches
                        </h1>

                        <p className="text-muted-foreground">
                            Manage your bakery ingredient stock batches.
                        </p>
                    </div>

                    <Link
                        href="/inventory-batches/create"
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                    >
                        <Plus size={18} />
                        Add Batch
                    </Link>
                </div>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="flex flex-wrap items-center gap-2"
                >
                    <div className="relative w-full max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search batch, ingredient, or warehouse..."
                            className="w-full rounded-lg border bg-background py-2 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                title="Clear search"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                    >
                        <Search size={16} />
                        Search
                    </button>
                </form>

                {/* Inventory Batches Table */}
                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                {[
                                    'Batch Number',
                                    'Ingredient',
                                    'Warehouse',
                                    'Quantity (kg)',
                                    'Unit Cost',
                                    'Total Value',
                                    'Expiry Date',
                                    'Status',
                                    'Actions',
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="p-3 text-left font-semibold"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {batches.data.length > 0 ? (
                                batches.data.map((batch) => (
                                    <tr
                                        key={batch.batch_id}
                                        className="border-t"
                                    >
                                        <td className="p-3 font-medium">
                                            {batch.batch_number}
                                        </td>

                                        <td className="p-3">
                                            {batch.ingredient?.ingredient_name ?? '-'}
                                        </td>

                                        <td className="p-3">
                                            {batch.warehouse?.warehouse_name ?? '-'}
                                        </td>

                                        <td className="p-3">
                                            {batch.quantity_kg}
                                        </td>

                                        <td className="p-3">
                                            ₱{Number(batch.unit_cost).toFixed(2)}
                                        </td>

                                        <td className="p-3">
                                            ₱{Number(batch.total_batch_value).toFixed(2)}
                                        </td>

                                        <td className="p-3">
                                            {batch.expiry_date
                                                ? batch.expiry_date.substring(0, 10)
                                                : '-'}
                                        </td>

                                        <td className="p-3">
                                            <span className="rounded-full bg-muted px-3 py-1">
                                                {batch.quality_status}
                                            </span>
                                        </td>

                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/inventory-batches/${batch.batch_id}/edit`}
                                                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs hover:bg-muted"
                                                >
                                                    <Pencil size={14} />
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteBatch(
                                                            batch.batch_id,
                                                            batch.batch_number
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
                                        colSpan={9}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        <Package className="mx-auto mb-2" />

                                        {initialSearch
                                            ? 'No matching inventory batches found.'
                                            : 'No inventory batches found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap gap-2">
                    {batches.links.map((link, index) => (
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

import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Warehouse {
    warehouse_id: number;
    warehouse_name: string;
}

interface Props {
    warehouse: Warehouse;
}

export default function Edit({ warehouse }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        warehouse_name: warehouse.warehouse_name,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(`/warehouses/${warehouse.warehouse_id}`);
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'Warehouses', href: '/warehouses' },
            {
                title: 'Edit Warehouse',
                href: `/warehouses/${warehouse.warehouse_id}/edit`,
            },
        ]}>
            <Head title="Edit Warehouse" />

            <div className="space-y-6 p-6">
                <div>
                    <Link
                        href="/warehouses"
                        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft size={16} />
                        Back to Warehouses
                    </Link>

                    <h1 className="text-2xl font-bold">Edit Warehouse</h1>
                    <p className="text-muted-foreground">
                        Update the warehouse information below.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-xl space-y-5 rounded-xl border bg-card p-6"
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="warehouse_name"
                            className="text-sm font-medium"
                        >
                            Warehouse Name
                        </label>

                        <input
                            id="warehouse_name"
                            type="text"
                            value={data.warehouse_name}
                            onChange={(e) =>
                                setData('warehouse_name', e.target.value)
                            }
                            placeholder="Enter warehouse name"
                            className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                        />

                        {errors.warehouse_name && (
                            <p className="text-sm text-red-500">
                                {errors.warehouse_name}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link
                            href="/warehouses"
                            className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update Warehouse'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
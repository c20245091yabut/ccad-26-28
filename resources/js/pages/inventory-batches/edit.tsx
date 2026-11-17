import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Ingredient {
    ingredient_id: number;
    ingredient_name: string;
}

interface Warehouse {
    warehouse_id: number;
    warehouse_name: string;
}

interface Batch {
    batch_id: number;
    ingredient_id: number;
    warehouse_id: number;
    batch_number: string;
    quantity_kg: number | string;
    unit_cost: number | string;
    expiry_date: string;
    quality_status: string;
}

interface Props {
    batch: Batch;
    ingredients: Ingredient[];
    warehouses: Warehouse[];
}

export default function Edit({
    batch,
    ingredients,
    warehouses,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        ingredient_id: String(batch.ingredient_id),
        warehouse_id: String(batch.warehouse_id),
        batch_number: batch.batch_number,
        quantity_kg: String(batch.quantity_kg),
        unit_cost: String(batch.unit_cost),
        expiry_date: batch.expiry_date
            ? batch.expiry_date.substring(0, 10)
            : '',
        quality_status: batch.quality_status,
    });

    const totalValue =
        (Number(data.quantity_kg) || 0) *
        (Number(data.unit_cost) || 0);

    function submit(e: FormEvent) {
        e.preventDefault();
        put(`/inventory-batches/${batch.batch_id}`);
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inventory Batches', href: '/inventory-batches' },
            { title: 'Edit Batch', href: `/inventory-batches/${batch.batch_id}/edit` },
        ]}>
            <Head title="Edit Inventory Batch" />

            <div className="max-w-2xl space-y-6 p-6">
                <div>
                    <Link
                        href="/inventory-batches"
                        className="mb-3 flex items-center gap-2 text-sm text-muted-foreground"
                    >
                        <ArrowLeft size={16} />
                        Back to Inventory Batches
                    </Link>

                    <h1 className="text-2xl font-bold">
                        Edit Inventory Batch
                    </h1>

                    <p className="text-muted-foreground">
                        Update the details of batch {batch.batch_number}.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-5 rounded-xl border bg-card p-6"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Ingredient
                        </label>

                        <select
                            value={data.ingredient_id}
                            onChange={e => setData('ingredient_id', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        >
                            <option value="">Select ingredient</option>
                            {ingredients.map(item => (
                                <option
                                    key={item.ingredient_id}
                                    value={item.ingredient_id}
                                >
                                    {item.ingredient_name}
                                </option>
                            ))}
                        </select>

                        {errors.ingredient_id && (
                            <p className="text-sm text-red-500">
                                {errors.ingredient_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Warehouse
                        </label>

                        <select
                            value={data.warehouse_id}
                            onChange={e => setData('warehouse_id', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        >
                            <option value="">Select warehouse</option>
                            {warehouses.map(item => (
                                <option
                                    key={item.warehouse_id}
                                    value={item.warehouse_id}
                                >
                                    {item.warehouse_name}
                                </option>
                            ))}
                        </select>

                        {errors.warehouse_id && (
                            <p className="text-sm text-red-500">
                                {errors.warehouse_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Batch Number
                        </label>

                        <input
                            value={data.batch_number}
                            onChange={e => setData('batch_number', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        />

                        {errors.batch_number && (
                            <p className="text-sm text-red-500">
                                {errors.batch_number}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Quantity (kg)
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={data.quantity_kg}
                            onChange={e => setData('quantity_kg', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        />

                        {errors.quantity_kg && (
                            <p className="text-sm text-red-500">
                                {errors.quantity_kg}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Unit Cost (₱)
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.unit_cost}
                            onChange={e => setData('unit_cost', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        />

                        {errors.unit_cost && (
                            <p className="text-sm text-red-500">
                                {errors.unit_cost}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Total Batch Value
                        </label>

                        <input
                            readOnly
                            value={`₱${totalValue.toFixed(2)}`}
                            className="w-full rounded-lg border bg-muted px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Expiry Date
                        </label>

                        <input
                            type="date"
                            value={data.expiry_date}
                            onChange={e => setData('expiry_date', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        />

                        {errors.expiry_date && (
                            <p className="text-sm text-red-500">
                                {errors.expiry_date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Quality Status
                        </label>

                        <select
                            value={data.quality_status}
                            onChange={e => setData('quality_status', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Passed">Passed</option>
                            <option value="Failed">Failed</option>
                        </select>

                        {errors.quality_status && (
                            <p className="text-sm text-red-500">
                                {errors.quality_status}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50"
                    >
                        {processing ? 'Updating...' : 'Update Inventory Batch'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}

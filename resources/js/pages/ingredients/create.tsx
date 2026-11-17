import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Supplier {
    supplier_id: number;
    supplier_name: string;
}

interface Props {
    suppliers: Supplier[];
}

export default function Create({ suppliers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        ingredient_code: '',
        ingredient_name: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/ingredients');
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'Ingredients', href: '/ingredients' },
            { title: 'Add Ingredient', href: '/ingredients/create' },
        ]}>
            <Head title="Add Ingredient" />

            <div className="max-w-2xl space-y-6 p-6">
                <div>
                    <Link href="/ingredients" className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <ArrowLeft size={16} /> Back to Ingredients
                    </Link>
                    <h1 className="text-2xl font-bold">Add Ingredient</h1>
                    <p className="text-muted-foreground">
                        Enter the details of your new ingredient.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5 rounded-xl border bg-card p-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Ingredient Code
                        </label>
                        <input
                            value={data.ingredient_code}
                            onChange={e => setData('ingredient_code', e.target.value)}
                            placeholder="Example: FL001"
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        />
                        {errors.ingredient_code && (
                            <p className="mt-1 text-sm text-red-500">{errors.ingredient_code}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Ingredient Name
                        </label>
                        <input
                            value={data.ingredient_name}
                            onChange={e => setData('ingredient_name', e.target.value)}
                            placeholder="Example: Bread Flour"
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        />
                        {errors.ingredient_name && (
                            <p className="mt-1 text-sm text-red-500">{errors.ingredient_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Supplier
                        </label>
                        <select
                            value={data.supplier_id}
                            onChange={e => setData('supplier_id', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        >
                            <option value="">Select supplier</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.supplier_id} value={supplier.supplier_id}>
                                    {supplier.supplier_name}
                                </option>
                            ))}
                        </select>
                        {errors.supplier_id && (
                            <p className="mt-1 text-sm text-red-500">{errors.supplier_id}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Save Ingredient'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}

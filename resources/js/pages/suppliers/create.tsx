import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        supplier_name: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/suppliers');
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'Suppliers', href: '/suppliers' },
            { title: 'Create Supplier', href: '/suppliers/create' },
        ]}>
            <Head title="Create Supplier" />

            <div className="space-y-6 p-6">
                <div>
                    <Link
                        href="/suppliers"
                        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft size={16} />
                        Back to Suppliers
                    </Link>

                    <h1 className="text-2xl font-bold">Add Supplier</h1>
                    <p className="text-muted-foreground">
                        Enter the supplier information below.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-xl space-y-5 rounded-xl border bg-card p-6"
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="supplier_name"
                            className="text-sm font-medium"
                        >
                            Supplier Name
                        </label>

                        <input
                            id="supplier_name"
                            type="text"
                            value={data.supplier_name}
                            onChange={(e) =>
                                setData('supplier_name', e.target.value)
                            }
                            placeholder="Enter supplier name"
                            className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                        />

                        {errors.supplier_name && (
                            <p className="text-sm text-red-500">
                                {errors.supplier_name}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link
                            href="/suppliers"
                            className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Supplier'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
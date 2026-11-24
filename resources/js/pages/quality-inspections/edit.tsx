import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Batch {
    batch_id: number;
    batch_number: string;
    ingredient?: {
        ingredient_name: string;
    };
    warehouse?: {
        warehouse_name: string;
    };
}

interface Inspection {
    inspection_id: number;
    batch_id: number;
    inspector_name: string;
    inspection_date: string;
    quality_status: string;
    remarks: string | null;
}

interface Props {
    inspection: Inspection;
    batches: Batch[];
}

export default function Edit({ inspection, batches }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        batch_id: String(inspection.batch_id),
        inspector_name: inspection.inspector_name,
        inspection_date: String(inspection.inspection_date).slice(0, 10),
        quality_status: inspection.quality_status,
        remarks: inspection.remarks ?? '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();

        put(`/quality-inspections/${inspection.inspection_id}`);
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'Quality Inspections', href: '/quality-inspections' },
            {
                title: 'Edit Inspection',
                href: `/quality-inspections/${inspection.inspection_id}/edit`,
            },
        ]}>
            <Head title="Edit Inspection" />

            <div className="max-w-2xl space-y-6 p-6">
                <div>
                    <Link
                        href="/quality-inspections"
                        className="mb-3 flex items-center gap-2 text-sm text-muted-foreground"
                    >
                        <ArrowLeft size={16} />
                        Back to Quality Inspections
                    </Link>

                    <h1 className="text-2xl font-bold">
                        Edit Quality Inspection
                    </h1>

                    <p className="text-muted-foreground">
                        Update the inspection details below.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-5 rounded-xl border bg-card p-6"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Inventory Batch
                        </label>

                        <select
                            value={data.batch_id}
                            onChange={e => setData('batch_id', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        >
                            <option value="">Select inventory batch</option>

                            {batches.map(batch => (
                                <option
                                    key={batch.batch_id}
                                    value={batch.batch_id}
                                >
                                    {batch.batch_number} - {batch.ingredient?.ingredient_name ?? 'Unknown ingredient'}
                                </option>
                            ))}
                        </select>

                        {errors.batch_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.batch_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Inspector Name
                        </label>

                        <input
                            value={data.inspector_name}
                            onChange={e => setData('inspector_name', e.target.value)}
                            placeholder="Enter inspector name"
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        />

                        {errors.inspector_name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.inspector_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Inspection Date
                        </label>

                        <input
                            type="date"
                            value={data.inspection_date}
                            onChange={e => setData('inspection_date', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        />

                        {errors.inspection_date && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.inspection_date}
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
                            <p className="mt-1 text-sm text-red-500">
                                {errors.quality_status}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Remarks
                        </label>

                        <textarea
                            value={data.remarks}
                            onChange={e => setData('remarks', e.target.value)}
                            placeholder="Enter inspection remarks"
                            rows={4}
                            className="w-full rounded-lg border bg-background px-3 py-2"
                        />

                        {errors.remarks && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.remarks}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link
                            href="/quality-inspections"
                            className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update Inspection'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
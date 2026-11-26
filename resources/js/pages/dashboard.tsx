import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Package,
    Boxes,
    AlertTriangle,
    XCircle,
    Warehouse,
    Truck,
    ShieldCheck,
    Plus,
    ArrowRight,
    CircleDollarSign,
    ClipboardCheck,
    CalendarClock,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];



interface DashboardProps {
    totalIngredients: number;
    totalBatches: number;
    expiringSoon: number;
    failedBatches: number;
    expiredBatches: number;
    totalSuppliers: number;
    totalWarehouses: number;
    activeInspectors: number;
    totalInventoryValue: number;
    qualityStatusCounts: {
        Passed: number;
        Pending: number;
        Failed: number;
    };
    recentBatches: Array<{
        batch_id: number;
        batch_number: string;
        quantity_kg: string | number;
        expiry_date: string;
        quality_status: string;
        ingredient?: { ingredient_name: string };
        warehouse?: { warehouse_name: string };
    }>;
    recentInspections: Array<{
        inspection_id: number;
        inspector_name: string;
        inspection_date: string;
        quality_status: string;
        inspector?: { full_name: string };
        inventory_batch?: {
            batch_number: string;
            ingredient?: { ingredient_name: string };
        };
    }>;
}

export default function Dashboard({
    totalIngredients = 0,
    totalBatches = 0,
    expiringSoon = 0,
    failedBatches = 0,
    expiredBatches = 0,
    totalSuppliers = 0,
    totalWarehouses = 0,
    activeInspectors = 0,
    totalInventoryValue = 0,
    qualityStatusCounts = { Passed: 0, Pending: 0, Failed: 0 },
    recentBatches = [],
    recentInspections = [],
}: DashboardProps) {
    const stats = [
        {
            title: 'Total Ingredients',
            value: totalIngredients,
            icon: Package,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            title: 'Inventory Batches',
            value: totalBatches,
            icon: Boxes,
            color: 'text-green-600',
            bg: 'bg-green-100 dark:bg-green-900/30',
        },
        {
            title: 'Expiring Soon',
            value: expiringSoon,
            icon: AlertTriangle,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        },
        {
            title: 'Failed Batches',
            value: failedBatches,
            icon: XCircle,
            color: 'text-red-600',
            bg: 'bg-red-100 dark:bg-red-900/30',
        },
    ];

    const secondaryStats = [
        { title: 'Suppliers', value: totalSuppliers, icon: Truck, href: '/suppliers' },
        { title: 'Warehouses', value: totalWarehouses, icon: Warehouse, href: '/warehouses' },
        { title: 'Active Inspectors', value: activeInspectors, icon: ShieldCheck, href: '/inspectors' },
        {
            title: 'Inventory Value',
            value: `₱${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: CircleDollarSign,
            href: '/inventory-batches',
        },
    ];

    const qualityTotal =
        qualityStatusCounts.Passed +
        qualityStatusCounts.Pending +
        qualityStatusCounts.Failed;

    const qualityRows = [
        { label: 'Passed', value: qualityStatusCounts.Passed, color: 'bg-green-500' },
        { label: 'Pending', value: qualityStatusCounts.Pending, color: 'bg-yellow-500' },
        { label: 'Failed', value: qualityStatusCounts.Failed, color: 'bg-red-500' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Overview " />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-primary">Operations overview</p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight">
                            Commercial Bakery Inventory
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Monitor stock, quality, expiry, and supplier activity.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/inventory-batches/create" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                            <Plus size={16} /> New Batch
                        </Link>
                        <Link href="/quality-inspections/create" className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
                            <ClipboardCheck size={16} /> New Inspection
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.title} className="rounded-xl border bg-card p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <div className={`rounded-lg p-2 ${stat.bg}`}>
                                        <Icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                </div>
                                <p className="mt-4 text-3xl font-bold">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {secondaryStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Link key={stat.title} href={stat.href} className="group rounded-xl border bg-card p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <div className="rounded-lg bg-primary/10 p-2"><Icon className="h-4 w-4 text-primary" /></div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
                                </div>
                                <p className="mt-3 text-sm text-muted-foreground">{stat.title}</p>
                                <p className="mt-1 text-xl font-bold">{stat.value}</p>
                            </Link>
                        );
                    })}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="flex items-center justify-between border-b p-5">
                            <div>
                                <h2 className="font-semibold">Recent Inventory Batches</h2>
                                <p className="text-sm text-muted-foreground">Latest batch activity</p>
                            </div>
                            <Link href="/inventory-batches" className="text-sm font-medium text-primary hover:underline">View all</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/40">
                                    <tr>
                                        <th className="p-4 text-left">Batch</th>
                                        <th className="p-4 text-left">Ingredient</th>
                                        <th className="p-4 text-left">Warehouse</th>
                                        <th className="p-4 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBatches.length ? recentBatches.map(batch => (
                                        <tr key={batch.batch_id} className="border-t">
                                            <td className="p-4 font-medium">{batch.batch_number}</td>
                                            <td className="p-4">{batch.ingredient?.ingredient_name ?? 'N/A'}</td>
                                            <td className="p-4">{batch.warehouse?.warehouse_name ?? 'N/A'}</td>
                                            <td className="p-4">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    batch.quality_status === 'Passed' ? 'bg-green-100 text-green-700' :
                                                    batch.quality_status === 'Failed' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>{batch.quality_status}</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No inventory batches found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-5">
                            <h2 className="font-semibold">Batch Quality</h2>
                            <p className="text-sm text-muted-foreground">Current quality distribution</p>
                        </div>
                        <div className="flex h-3 overflow-hidden rounded-full bg-muted">
                            {qualityRows.map(row => (
                                <div key={row.label} className={row.color} style={{ width: `${qualityTotal ? (row.value / qualityTotal) * 100 : 0}%` }} />
                            ))}
                        </div>
                        <div className="mt-5 space-y-3">
                            {qualityRows.map(row => (
                                <div key={row.label} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${row.color}`} /><span>{row.label}</span></div>
                                    <span className="font-semibold">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <h2 className="font-semibold">Inventory Alerts</h2>
                        <p className="mb-4 text-sm text-muted-foreground">Conditions requiring attention</p>
                        <div className="space-y-3">
                            <Link href="/inventory-batches" className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
                                <div className="flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-yellow-600" /><span className="text-sm font-medium">Expiring within 7 days</span></div>
                                <span className="font-bold">{expiringSoon}</span>
                            </Link>
                            <Link href="/inventory-batches" className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
                                <div className="flex items-center gap-3"><CalendarClock className="h-5 w-5 text-orange-600" /><span className="text-sm font-medium">Already expired</span></div>
                                <span className="font-bold">{expiredBatches}</span>
                            </Link>
                            <Link href="/quality-inspections" className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
                                <div className="flex items-center gap-3"><XCircle className="h-5 w-5 text-red-600" /><span className="text-sm font-medium">Failed quality batches</span></div>
                                <span className="font-bold">{failedBatches}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="flex items-center justify-between border-b p-5">
                            <div><h2 className="font-semibold">Recent Inspections</h2><p className="text-sm text-muted-foreground">Latest quality records</p></div>
                            <Link href="/quality-inspections" className="text-sm font-medium text-primary hover:underline">View all</Link>
                        </div>
                        <div className="divide-y">
                            {recentInspections.length ? recentInspections.map(inspection => (
                                <div key={inspection.inspection_id} className="flex items-center justify-between gap-4 p-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">{inspection.inspector?.full_name ?? inspection.inspector_name}</p>
                                        <p className="truncate text-xs text-muted-foreground">{inspection.inventory_batch?.ingredient?.ingredient_name ?? inspection.inventory_batch?.batch_number ?? 'Inspection record'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xs font-medium ${inspection.quality_status === 'Passed' ? 'text-green-600' : inspection.quality_status === 'Failed' ? 'text-red-600' : 'text-yellow-600'}`}>{inspection.quality_status}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">{String(inspection.inspection_date).slice(0, 10)}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="p-8 text-center text-sm text-muted-foreground">No quality inspections found.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}

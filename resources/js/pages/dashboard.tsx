import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
       Package,
    Boxes,
    AlertTriangle,
    XCircle,
    Warehouse,
}from 'lucide-react';



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
}

export default function Dashboard({
    totalIngredients = 0,
    totalBatches = 0,
    expiringSoon = 0,
    failedBatches = 0,
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Overview " />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">

                {/* Welcome Section */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Commercial Bakery Inventory
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Monitor your ingredients and inventory batches.
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-xl border bg-card p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </p>

                                    <div className={`rounded-lg p-2 ${stat.bg}`}>
                                        <Icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                </div>

                                <p className="mt-4 text-3xl font-bold">
                                    {stat.value}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Inventory Overview */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Warehouse className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                Inventory Overview
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Summary of your current inventory records.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">
                                Total Ingredients
                            </p>
                            <p className="mt-2 text-2xl font-bold">
                                {totalIngredients}
                            </p>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">
                                Total Inventory Batches
                            </p>
                            <p className="mt-2 text-2xl font-bold">
                                {totalBatches}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="font-semibold">Inventory Alerts</h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Important inventory conditions that need attention.
                    </p>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                <span className="text-sm font-medium">
                                    Batches expiring within 7 days
                                </span>
                            </div>
                            <span className="font-bold">{expiringSoon}</span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                                <XCircle className="h-5 w-5 text-red-600" />
                                <span className="text-sm font-medium">
                                    Failed quality batches
                                </span>
                            </div>
                            <span className="font-bold">{failedBatches}</span>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}

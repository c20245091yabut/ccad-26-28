import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Package } from 'lucide-react';

interface Ingredient {
    ingredient_id: number;
    ingredient_code: string;
    ingredient_name: string;
    supplier?: {
        supplier_name: string;
    };
}

interface Props {
    ingredients: {
        data: Ingredient[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

export default function Index({ ingredients }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Ingredients', href: '/ingredients' },
        ]}>
            <Head title="Ingredients" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Ingredients</h1>
                        <p className="text-muted-foreground">
                            Manage your bakery ingredients.
                        </p>
                    </div>

                    <Link
                        href="/ingredients/create"
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                    >
                        <Plus size={18} />
                        Add Ingredient
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-4">Product</th>
                                <th className="p-4">Ingredient Name</th>
                                <th className="p-4">Supplier</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ingredients.data.length > 0 ? (
                                ingredients.data.map((item) => (
                                    <tr
                                        key={item.ingredient_id}
                                        className="border-t"
                                    >
                                        <td className="p-4">
                                            {item.ingredient_code}
                                        </td>

                                        <td className="p-4">
                                            {item.ingredient_name}
                                        </td>

                                        <td className="p-4">
                                            {item.supplier?.supplier_name ?? 'No supplier'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center">
                                        <Package className="mx-auto mb-2" />
                                        No ingredients found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="flex gap-2 border-t p-4">
                        {ingredients.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded border px-3 py-2 text-sm ${
                                    link.active ? 'bg-primary text-primary-foreground' : ''
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    Boxes,
    Truck,
    Warehouse,
    ClipboardCheck,
    BookOpen,
    Folder,
} from 'lucide-react';
import AppLogo from './app-logo';

// Main Navigation
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Ingredients',
        url: '/ingredients',
        icon: Package,
    },
    {
        title: 'Inventory Batches',
        url: '/inventory-batches',
        icon: Boxes,
    },
    {
        title: 'Suppliers',
        url: '/suppliers',
        icon: Truck,
    },
    {
        title: 'Warehouses',
        url: '/warehouses',
        icon: Warehouse,
    },
    {
        title: 'Quality Inspections',
        url: '/quality-inspections',
        icon: ClipboardCheck,
    },
];

// Footer Navigation
const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/c20245091yabut/ccad-26-28',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">

            {/* Sidebar Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Main Navigation */}
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            {/* Sidebar Footer */}
            <SidebarFooter>
                <NavFooter
                    items={footerNavItems}
                    className="mt-auto"
                />
                <NavUser />
            </SidebarFooter>

        </Sidebar>
    );
}

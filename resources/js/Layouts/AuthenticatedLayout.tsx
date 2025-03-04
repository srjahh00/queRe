import { Link, usePage } from "@inertiajs/react";
import { useState, PropsWithChildren, ReactNode } from "react";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Card } from "@/Components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { CircleUserRound, Menu, User2, X } from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Badge } from "@/Components/ui/badge";
import { Toaster } from "@/Components/ui/sonner";
import ShoutListener from "@/Pages/Shout/Shout";
import { getPermissions } from "@/Components/utils/permissions";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const { url } = usePage();
    const roles = usePage().props.auth.roles;
    const { hasPermission } = getPermissions(roles);
    return (
        <div className="min-h-screen bg-gray-100">
            <Card className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <Link
                                href="/"
                                className="text-lg font-semibold text-gray-800"
                            >
                                <ApplicationLogo></ApplicationLogo>
                            </Link>
                            <nav className="hidden sm:flex space-x-6 ml-10">
                                <Link
                                    href={route("dashboard")}
                                    className={`text-gray-700 hover:text-gray-900 ${
                                        url === route("dashboard")
                                            ? "text-blue-600 font-bold"
                                            : ""
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route("sms.index")}
                                    className={`text-gray-700 hover:text-gray-900 ${
                                        url === route("sms.index")
                                            ? "text-blue-600 font-bold"
                                            : ""
                                    }`}
                                >
                                    Daisy SMS
                                </Link>
                                <Link
                                    href={route("dashboard")}
                                    className={`text-gray-700 hover:text-gray-900 ${
                                        url === route("dashboard")
                                            ? "text-blue-600 font-bold"
                                            : ""
                                    }`}
                                >
                                    Utilities
                                </Link>
                                {hasPermission("manage environment") && (
                                    <Link
                                        href={route("environments.index")}
                                        className={`text-gray-700 hover:text-gray-900 ${
                                            url === route("dashboard")
                                                ? "text-blue-600 font-bold"
                                                : ""
                                        }`}
                                    >
                                        Environment
                                    </Link>
                                )}
                            </nav>
                        </div>

                        <div className="hidden sm:flex items-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="text-gray-700"
                                    >
                                        <CircleUserRound />
                                        {user.name}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={route("profile.edit")}>
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                        >
                                            Log Out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="sm:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="w-6 h-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <div className="flex justify-between items-center pb-4">
                                        <h2 className="text-lg font-semibold">
                                            Menu
                                        </h2>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setShowingNavigationDropdown(
                                                    false
                                                )
                                            }
                                        >
                                            <X className="w-6 h-6" />
                                        </Button>
                                    </div>
                                    <nav className="space-y-4">
                                        <Link
                                            href={route("dashboard")}
                                            className="block text-gray-700 hover:text-gray-900"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href={route("profile.edit")}
                                            className="block text-gray-700 hover:text-gray-900"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            className="block text-gray-700 hover:text-gray-900"
                                        >
                                            Log Out
                                        </Link>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </Card>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                <ShoutListener />
                {children}
            </main>
            <Toaster position="top-right" richColors />
        </div>
    );
}

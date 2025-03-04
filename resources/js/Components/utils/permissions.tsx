import { router } from "@inertiajs/react";
import { toast } from "sonner";

// Function to check if a user has a specific permission
export const getPermissions = (roles: any[]) => {
    const hasPermission = (permission: string) => {
        return roles.some((role: any) =>
            role.permissions.some((perm: any) => perm.name === permission)
        );
    };

    const isSuperAdmin = roles.some((role: any) => role.name === "super admin");
    const isAdmin = roles.some((role: any) => role.name === "admin");
    const isStaff = roles.some((role: any) => role.name === "staff");

    return {
        hasPermission,
        isSuperAdmin,
        isAdmin,
        isStaff,
    };
};

// Function to check permission and redirect if necessary (for Laravel + Inertia)
export const permiSsionChecker = (roles: any[], permission: string) => {
    const { hasPermission } = getPermissions(roles);

    if (!hasPermission(permission)) {
        toast.error("You do not have permission to access this page!");

        router.visit("/dashboard");
    }
};

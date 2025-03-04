import { permiSsionChecker } from "@/Components/utils/permissions";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import EnvironmentTable from "./Partials/EnvironmentTable";

interface Environment {
    environments: [];
}
export default function Environment({ environments }: Environment) {
    const userRoles = usePage().props.auth.roles;
    permiSsionChecker(userRoles, "manage environment");
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Environment Settings
                </h2>
            }
        >
            <EnvironmentTable environments={environments} />
        </AuthenticatedLayout>
    );
}

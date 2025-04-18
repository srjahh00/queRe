import { Badge } from "@/Components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { useState } from "react";
import Modal from "@/Components/Modal";
import { Switch } from "@/Components/ui/switch";
import StatisticCard from "./Partials/StatisticCard";
import UsersTable from "./Partials/UsersTable";
import { toast } from "sonner";
import { useEffect } from "react";
import echo from "@/Components/utils/echo";
import { getPermissions } from "@/Components/utils/permissions";
import { error } from "console";
interface DashboardProps {
    balance: any;
    users_count: any;
    users: any;
    roles: any;
    environments: any;
    sms: any;
}

export default function Dashboard({
    balance,
    users_count,
    users: initialUsers,
    environments,
    roles,
    sms,
}: DashboardProps) {
    const userRoles = usePage().props.auth.roles;
    const { hasPermission } = getPermissions(userRoles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState<any[]>(initialUsers);
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const { data, setData, post, errors, reset } = useForm({
        name: "",
        email: "",
        allow_login: false,
        role: "",
        environment_id: "",
    });

    console.log(errors);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setData((prevData: any) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleDropdownRole = (value: string) => {
        setData((prevData: any) => ({
            ...prevData,
            role: value,
        }));
    };
    const handleDropDownEnvironment = (value: string) => {
        setData((prevData: any) => ({
            ...prevData,
            environment_id: value,
        }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setData((prevData: any) => ({
            ...prevData,
            allow_login: checked,
        }));
    };

    const fetchUsers = async () => {
        const response = await fetch(route("users.index"));
        const data = await response.json();
        setUsers(data); // Update the state with new user data
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("profile.store"), {
            onSuccess: () => {
                closeModal();
                toast.success("User Created Successfully!");
                fetchUsers();
                reset();
            },
            onError: (errors: any) => {
                console.log("Error updating profile", errors);
            },
        });
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            {/* Grid container for cards */}
            <StatisticCard
                balance={balance}
                users_count={users_count}
                sms={sms}
            />
            <br />

            {hasPermission("manage user") && (
                <UsersTable
                    users={users}
                    users_count={users_count}
                    openModal={openModal}
                    environments={environments}
                    roles={roles}
                />
            )}

            <Modal show={isModalOpen} onClose={closeModal}>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Create user 🫡</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Enter name"
                                        value={data.name}
                                        onChange={handleInputChange}
                                        className={
                                            errors.name ? "is-invalid" : ""
                                        }
                                    />
                                    {errors.name && (
                                        <span className="error">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="Enter email address"
                                        value={data.email}
                                        onChange={handleInputChange}
                                        className={
                                            errors.email ? "is-invalid" : ""
                                        }
                                    />
                                    {errors.email && (
                                        <span className="error">
                                            {errors.email}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="role">Role</Label>

                                    <Select
                                        value={data.role}
                                        onValueChange={handleDropdownRole}
                                    >
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {roles.map((role: any) => (
                                                    <SelectItem
                                                        key={role.id}
                                                        value={role.name}
                                                    >
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="role">Environment</Label>

                                    <Select
                                        value={data.environment_id} // Ensure it's storing ID, not name
                                        onValueChange={
                                            handleDropDownEnvironment
                                        }
                                    >
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="Select Environment" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {environments.map(
                                                    (environment: any) => (
                                                        <SelectItem
                                                            key={environment.id}
                                                            value={String(
                                                                environment.id
                                                            )} // Ensure value is a string
                                                        >
                                                            {environment.name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="status">Allow login?</Label>
                                    <Switch
                                        id="status"
                                        checked={data.allow_login}
                                        onCheckedChange={handleSwitchChange}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeModal}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Submit</Button>
                        </CardFooter>
                    </form>
                </Card>{" "}
            </Modal>
        </AuthenticatedLayout>
    );
}

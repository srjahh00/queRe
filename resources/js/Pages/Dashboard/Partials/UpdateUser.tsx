import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm } from "@inertiajs/react";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Switch } from "@/Components/ui/switch";

export default function UpdateUser({
    user,
    environments,
    roles,
}: {
    user: any;
    environments: any;
    roles: any;
}) {
    const [open, setOpen] = useState(false);
    const {
        data,
        setData,
        post,
        put,
        delete: deleteRequest,
        errors,
    } = useForm({
        id: user.id,
        name: user.name,
        email: user.email,
        allow_login: user.allow_login,
        environment_id: user.environments
            ? user.environments.environment_id
            : null,
    });
    // Form submission handler
    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        put(
            route("users.update", {
                id: user.id,
            }),
            {
                onSuccess: (response: any) => {
                    setOpen(false);
                },
                onError: (errors: any) => {
                    toast.error(errors.message || "An error occurred.");
                    console.log("Error canceling rental", errors);
                },
            }
        );
        e;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData: any) => ({
            ...prevData,
            [name]: value,
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

    // Open dialog and reset form data
    const handleOpenDialog = () => {
        setData({
            id: user.id,
            name: user.name,
            email: user.email,
            allow_login: user.allow_login,
            environment_id: user.environments
                ? String(user.environments.environment_id)
                : null,
        });

        setOpen(true);
    };

    return (
        <div className="flex justify-end w-full">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" onClick={handleOpenDialog}>
                        <Pencil />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update User Details</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Are you sure you want to update this user?
                    </DialogDescription>
                    <form onSubmit={handleUpdateUser}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter name"
                                    value={data.name}
                                    onChange={handleInputChange}
                                    className={errors.name ? "is-invalid" : ""}
                                />
                                {errors.name && (
                                    <span className="error">{errors.name}</span>
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
                                    className={errors.email ? "is-invalid" : ""}
                                />
                                {errors.email && (
                                    <span className="error">
                                        {errors.email}
                                    </span>
                                )}
                            </div>
                            {/* <div className="flex flex-col space-y-1.5">
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
                            </div> */}
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="role">Environment</Label>

                                <Select
                                    value={String(data.environment_id)}
                                    onValueChange={handleDropDownEnvironment}
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
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" type="submit">
                                Proceed
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

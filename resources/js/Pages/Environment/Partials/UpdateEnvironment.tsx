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
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm } from "@inertiajs/react";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function UpdateEnvironment({
    environment,
}: {
    environment: any;
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
        id: environment.id,
        name: environment.name,
        key: environment.key,
    });

    // Form submission handler
    const handleUpdateEnvironment = (e: React.FormEvent) => {
        e.preventDefault();
        put(
            route("environments.update", {
                environment: environment,
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
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Open dialog and reset form data
    const handleOpenDialog = () => {
        setData({
            id: environment.id,
            name: environment.name,
            key: environment.key,
        });
        setOpen(true);
    };

    return (
        <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" onClick={handleOpenDialog}>
                        <Pencil />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Environment</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Are you sure you want to update this environment?
                    </DialogDescription>
                    <form onSubmit={handleUpdateEnvironment}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="areaCode">
                                    Environment Key
                                </Label>
                                <Input
                                    id="Key"
                                    name="key"
                                    placeholder="Enter key"
                                    value={data.key}
                                    onChange={handleInputChange}
                                    className={errors.key ? "is-invalid" : ""}
                                />
                                {errors.key && (
                                    <span className="error">{errors.key}</span>
                                )}
                                <Label htmlFor="areaCode">
                                    Environment Name
                                </Label>
                                <Input
                                    id="key"
                                    name="name"
                                    placeholder="Enter environment name"
                                    value={data.name}
                                    onChange={handleInputChange}
                                    className={errors.name ? "is-invalid" : ""}
                                />
                                {errors.name && (
                                    <span className="error">{errors.name}</span>
                                )}
                            </div>

                            <br />
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

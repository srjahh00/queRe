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

export default function UpdateUser({ user }: { user: any }) {
    const [open, setOpen] = useState(false);
    const {
        data,
        setData,
        post,
        put,
        delete: deleteRequest,
        errors,
    } = useForm({
        id: "",
        name: "",
        email: "",
        allow_login: false,
        environment_id: "",
    });

    // Form submission handler
    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        put(
            route("environments.update", {
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
            id: user.id,
            name: user.name,
            email: user.email,
            allow_login: user.allow_login,
            environment_id: user.environment_id,
        });
        setOpen(true);
    };
    console.log(user);

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
                        <DialogTitle>Update Environment</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Are you sure you want to update this environment?
                    </DialogDescription>
                    <form onSubmit={handleUpdateUser}>
                        {/* !! TODO : Update user */}
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

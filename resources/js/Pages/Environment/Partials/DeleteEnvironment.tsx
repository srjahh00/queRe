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
import { useForm } from "@inertiajs/react";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function DeleteEnvironment({ id }: { id: any }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, delete: deleteRequest, errors } = useForm();

    // Form submission handler
    const handleDeleteEnvironment = (e: React.FormEvent) => {
        e.preventDefault();
        deleteRequest(
            route("environments.destroy", {
                id: id,
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

    // Open dialog and reset form data
    const handleOpenDialog = () => {
        setData({ id: id });
        setOpen(true);
    };

    return (
        <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive" onClick={handleOpenDialog}>
                        <Trash2 />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Environment</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Are you sure you want to delete this environment?
                        <br />
                        <small>
                            Deleting Environment will delete all user's
                            environment using this
                        </small>
                    </DialogDescription>
                    <form onSubmit={handleDeleteEnvironment}>
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

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

export default function CancelRental({
    rental_id,
    id,
}: {
    rental_id: any;
    id: any;
}) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, errors } = useForm();

    // Form submission handler
    const handleCancelRental = (e: React.FormEvent) => {
        e.preventDefault();
        post(
            route("sms.cancel", {
                sms: id,
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
        setData({ id: rental_id, rental_id: rental_id });
        setOpen(true);
    };

    return (
        <div className="flex justify-end w-full">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive" onClick={handleOpenDialog}>
                        <Trash2 />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rental Cancellation</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Are you sure you want to cancel this rental?
                    </DialogDescription>
                    <form onSubmit={handleCancelRental}>
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

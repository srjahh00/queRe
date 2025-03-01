import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import { SendHorizonalIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateRental() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, errors } = useForm({
        areaCode: "",
    });

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("sms.store"), {
            onSuccess: () => {
                setOpen(false);
            },
            onError: (errors: any) => {
                toast.error(errors.message || "An error occurred.");
                console.log("Error updating profile", errors);
            },
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="flex justify-end w-full">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => setOpen(true)}>
                        <SendHorizonalIcon /> Rent Number
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rental Confirmation</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSend}>
                        <Label htmlFor="areaCode">Area Code</Label>
                        <Input
                            id="areaCode"
                            name="areaCode"
                            placeholder="Enter area code"
                            value={data.areaCode}
                            onChange={handleInputChange}
                            className={errors.areaCode ? "is-invalid" : ""}
                        />
                        {errors.areaCode && (
                            <span className="error">{errors.areaCode}</span>
                        )}
                        <br />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Proceed</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

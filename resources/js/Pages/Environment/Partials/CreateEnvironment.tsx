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

export default function CreateEnvironment() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, errors } = useForm({
        key: "",
        name: "",
    });

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("environments.store"), {
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
                        <SendHorizonalIcon /> Create Environment
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rental Confirmation</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSend}>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Enter environment name"
                            value={data.name}
                            onChange={handleInputChange}
                            className={errors.name ? "is-invalid" : ""}
                        />
                        {errors.name && (
                            <span className="error">{errors.name}</span>
                        )}
                        <Label htmlFor="key">Key</Label>
                        <Input
                            id="key"
                            name="key"
                            placeholder="Enter environment key"
                            value={data.key}
                            onChange={handleInputChange}
                            className={errors.key ? "is-invalid" : ""}
                        />
                        {errors.key && (
                            <span className="error">{errors.key}</span>
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

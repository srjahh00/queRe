import { useState, useEffect } from "react";
import DangerButton from "@/Components/DangerButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { toast } from "sonner";
import CreateRental from "./Partials/CreateRental";
import CancelRental from "./Partials/CancelRental";

interface Sms {
    id: any;
    rental_number: string;
    rental_id: string;
    service: string;
    code: string;
    environment_id: string;
    created_at: string;
}

interface DaisySmsProps {
    response: any;
    sms: Sms[];
}

export default function DaisySms({ sms }: DaisySmsProps) {
    const [smsList, setSmsList] = useState<Sms[]>(sms);

    const fetchSmsList = async () => {
        const response = await fetch(route("sms.sms-data"));
        const data = await response.json();
        setSmsList(data);
    };

    fetchSmsList();

    const intervalId = setInterval(fetchSmsList, 3000);

    clearInterval(intervalId);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Daisy SMS
                </h2>
            }
        >
            <Head title="Daisy SMS Service" />

            <Card className="w-full p-4">
                <CardHeader>
                    <CreateRental />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>
                            A list of your recent invoices.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    Rental ID
                                </TableHead>
                                <TableHead>Rental Number</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead className="text-right">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {smsList.map((message: Sms) => (
                                <TableRow key={message.rental_id}>
                                    <TableCell>{message.rental_id}</TableCell>
                                    <TableCell>
                                        {message.rental_number}
                                    </TableCell>
                                    <TableCell>
                                        {message.service ?? " "}
                                    </TableCell>
                                    <TableCell>{message.code ?? " "}</TableCell>
                                    <TableCell className="text-right">
                                        <CancelRental
                                            rental_id={message.rental_id}
                                            id={message.id}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}

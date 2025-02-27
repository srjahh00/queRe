"use client";

import { useState } from "react";
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    Row,
} from "@tanstack/react-table";
import { Card, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/Components/ui/input";
import { Plus, ArrowUpDown, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/Components/ui/checkbox";

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

export default function UsersTable({
    users,
    users_count,
    openModal,
}: {
    users: User[];
    users_count: number;
    openModal: () => void;
}) {
    const [data] = useState(users);
    const [globalFilter, setGlobalFilter] = useState("");

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Name <ArrowUpDown size={16} />
                </Button>
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Email <ArrowUpDown size={16} />
                </Button>
            ),
        },
        {
            accessorKey: "allow_login",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Allow Login <ArrowUpDown size={16} />
                </Button>
            ),
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Created At <ArrowUpDown size={16} />
                </Button>
            ),
        },
    ];

    const table = useReactTable({
        data: users,
        columns,
        state: { globalFilter },
        initialState: {
            sorting: [
                {
                    id: "created_at",
                    desc: true,
                },
            ],
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
    });
    return (
        <Card className="w-full p-4">
            <CardHeader>
                <div className="flex items-center  justify-between w-full">
                    <Input
                        placeholder="Search users..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-1/3"
                    />
                    <Button onClick={openModal} className="w-auto">
                        <Plus size={16} /> Add User
                    </Button>
                </div>
            </CardHeader>

            <Table className="w-full">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="bg-gray-200"
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="p-4">
                                        {cell.column.id === "created_at" ? (
                                            <>
                                                <div className="flex">
                                                    <Calendar
                                                        size={16}
                                                        className="mr-2 text-gray-500"
                                                    />
                                                    {/* Calendar icon */}
                                                    {/* Format the created_at date */}
                                                    {new Intl.DateTimeFormat(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        }
                                                    ).format(
                                                        new Date(
                                                            cell.getValue() as string
                                                        )
                                                    )}
                                                </div>
                                            </>
                                        ) : cell.column.id === "allow_login" ? (
                                            <Checkbox
                                                disabled
                                                checked={
                                                    !!(cell.getValue() as boolean)
                                                }
                                            />
                                        ) : (
                                            flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-4">
                                No results found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <Button
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <span>
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </span>
                <Button
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </Card>
    );
}

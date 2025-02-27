import { Card } from "@/Components/ui/card";
import { Mail, Users } from "lucide-react";

export default function StatisticCard({ balance, users_count }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="w-full">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Mail />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Daisy SMS Balance
                        </p>
                        <p className="text-sm text-muted-foreground">
                            ${balance}
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="w-full">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Users />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Total users
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {users_count}
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="w-full">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Mail />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {" "}
                            TBC - WALA MUNA
                        </p>
                        <p className="text-sm text-muted-foreground">xxx</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

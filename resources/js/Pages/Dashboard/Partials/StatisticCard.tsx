import { Card } from "@/Components/ui/card";
import { Mail, Users } from "lucide-react";

export default function StatisticCard({ balance, users_count, sms }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {balance?.map((item, index) => (
                <Card key={index} className="w-full">
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <Mail />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {item.name} SMS Balance
                            </p>
                            <p className="text-sm text-muted-foreground">
                                ${item.balance}
                            </p>
                        </div>
                    </div>
                </Card>
            ))}

            <Card className="w-full">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Users />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Total users
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {users_count ?? 0}
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="w-full">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Mail />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Total SMS Request
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {sms ?? 0}{" "}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

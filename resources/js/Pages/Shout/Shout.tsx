import echo from "@/Components/utils/echo";
import { useEffect } from "react";
import { toast } from "sonner";

const ShoutListener = () => {
    useEffect(() => {
        const channel = echo.channel("shout");

        channel.listen(".shout.pushed", (event: any) => {
            toast.success(`📢 ${event.message}`);
        });

        return () => {
            channel.unsubscribe();
        };
    }, []);

    return null;
};

export default ShoutListener;

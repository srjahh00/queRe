import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: "pusher",
    key: "0426d2f4d97470af0a16",
    cluster: "ap1",
    forceTLS: true,
});

export default echo;

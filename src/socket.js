import { io } from "socket.io-client";

export const initSocket =  () => {
    const options = {
        'force new connection' : true,
        'reconnectionAttempt' : 'Infinity',
        timeout : 1000000,
        transports : ['websocket'],
    }
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://verseapi-203l.onrender.com";
    return io("wss://verseapi-203l.onrender.com",options);
}

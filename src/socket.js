import { io } from "socket.io-client";

export const initSocket =  () => {
    const options = {
        'force new connection' : true,
        'reconnectionAttempt' : 'Infinity',
        timeout : 1000,
        transports : ['websocket'],
    }
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    return io(backendUrl,options);
}
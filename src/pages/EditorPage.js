import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import MyEditor from "../components/MyEditor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';
import toast from "react-hot-toast";

const EditorPage = () => {

    const [clients, setClients] = useState([]);


    const socketRef = useRef(null);
    const location = useLocation();
    const  { roomId }  = useParams();
    const reactNavigator = useNavigate();
    const codeRef = useRef(null);

    const init = async () => {

        socketRef.current = initSocket();

        socketRef.current.emit(ACTIONS.JOIN,{
            roomId,
            username :  location.state?.username,
        });
        
    }
    useEffect(() => {
        init();
         socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
            if(username !== location.state?.username){
                toast.success(`${username} joined the room`);
                console.log(username);
            }
            setClients(clients);
            console.log("codeChange",codeRef.current);
            socketRef.current.emit(ACTIONS.SYNC_CODE,{code :codeRef.current,socketId});
         })

        socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username}) => {
            toast.success(`${username} left the room`);
            setClients((prev) => {
                return prev.filter(client => client.socketId !== socketId);
            })
        })

        socketRef.current.on('connect_error', (err) => handleErrors(err));
        socketRef.current.on('connect_failed', (err) => handleErrors(err));
        function handleErrors(e) {
            console.log('socket error', e);
            toast.error('Socket connection failed, try again later.');
            reactNavigator('/');
        }
            return () => {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            };
    },[]);

    if (!location.state) {
        return <Navigate to="/" />;
    }

    const copyRoomId = async () => {
        try{
            await navigator.clipboard.writeText(roomId);
            toast.success("Copied to clipboard")
        }catch(e){
            console.log(e);
        }
    }

    const leaveRoom = () => {
        reactNavigator('/');
    }

    return (
        <div className="mainWrap">
            <div className="aside"> 
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImage" src="/codeverse.png" alt="CodeVerse" />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                     {clients.map((client) => (
                          <Client key={client.socketId} username={client.username} />
                     ))}
                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>COPY ROOM ID</button>
                <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
            </div>
            <div className="editorWrap">
                <MyEditor 
                    socketRef = {socketRef} 
                    roomId = {roomId} 
                    onCodeChange = {(code) => {codeRef.current = code}}/>
            </div>
        </div>
    );
};

export default EditorPage;

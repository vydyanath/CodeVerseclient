import React, { useEffect, useRef } from "react";
import ACTIONS from "../Actions";

const MyEditor = ({socketRef,roomId,onCodeChange}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if(!socketRef.current)
        return;
    const handleChange = (event) => {
      console.log("Content changed:", event.target.value);
      onCodeChange(event.target.value);
      socketRef.current.emit(ACTIONS.CODE_CHANGE,{
        roomId,
        code : event.target.value,
    })
    };
    socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
        if(code !== null){
            editorRef.current.value = code;
        }
    });
    editorRef.current.addEventListener("input", handleChange);
    return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return <textarea id="realtimeeditor" ref={editorRef} placeholder="//Code goes here..."></textarea>;
};

export default MyEditor;
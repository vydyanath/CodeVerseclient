import React, { useState, useRef, useCallback } from 'react';
import { useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { CODE_SNIPPETS } from '../codesnippets';
import MyConsole from './MyConsole';
import ACTIONS from '../Actions';
import executeCode from '../execute';
import { LANGUAGE_VERSIONS } from '../languageversions';

const MyCompiler = ({ socketRef, roomId }) => {
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef();
  const [output,setOutput] = useState('');
  const [error,setError] = useState(null);
  const isInitialMount = useRef(true);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleRunCode = () => {
    console.log("Calling server");
    socketRef.current.emit(ACTIONS.RUN_CODE,{roomId});
  };

  const handleLanguageChange = (e) => {
    console.log("clicked")
    setLanguage(e.target.value);
    setValue(CODE_SNIPPETS[e.target.value]);
    console.log(roomId,e.target.value)
    socketRef.current.emit(ACTIONS.CHANGE_LANG, { roomId, language: e.target.value });
  };
  
  const changeLanguage = (lang) => {
    setLanguage(lang);
    setValue(CODE_SNIPPETS[lang]);
  }
  const handleChange = useCallback(
    (newValue) => {
      if (newValue === value) return;  
      setValue(newValue);
      if (!isInitialMount.current) {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code: newValue,
        });
      }
    },
    [value, socketRef, roomId]
  );

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
      if (code !== null && code !== value) {
        setValue(code);
      }      
    });
    socketRef.current.on(ACTIONS.CHANGE_LANG,({language}) => {
      console.log("from client " + language)
      changeLanguage(language);
    })
    socketRef.current.on(ACTIONS.RUN_CODE,()=>{
      fetchOutput();
    })
    return () => {
      socketRef.current.off(ACTIONS.CHANGE_LANG);
      socketRef.current.off(ACTIONS.CODE_CHANGE);
      socketRef.current.off(ACTIONS.RUN_CODE);
    };
  }, [socketRef, value]);

  useEffect(() => {
    isInitialMount.current = false; 
  }, []);
  const fetchOutput = async () => {
    try {
      const result = await executeCode(value,language);
      console.log(LANGUAGE_VERSIONS[language]);
      console.log(value);
      setOutput(result);
    } catch (err) {
      setError('Failed to fetch output');
    }
  };

  return (
    <div
      className="editorWrap"
      style={{ display: 'flex', flexDirection: 'row', height: '100vh', backgroundColor: 'black' }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'black' }}>
        <div style={{ marginBottom: '10px', display: 'flex' }}>
          <select
            value={language}
            onChange={handleLanguageChange}
            style={{
              padding: '10px',
              fontSize: '16px',
              backgroundColor: '#333',
              color: 'white',
              border: '1px solid #444',
              borderRadius: '5px',
              width: '200px',
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
          </select>
          <button
            onClick={handleRunCode}
            style={{
              backgroundColor: '#333',
              margin: '0px 0px 0px 10px',
              color: 'white',
              padding: '10px 20px',
              fontSize: '16px',
              border: '1px solid #444',
              borderRadius: '5px',
            }}
          >
            Run
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex' }}>
          <Editor
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            theme="vs-dark"
            value={value}
            onMount={onMount}
            onChange={(newValue) => handleChange(newValue)}
            height="100%"
            options={{
              fontSize: 16,
            }}
          />
        </div>
      </div>
      <div style={{ flex: 1, marginTop: '40px' }}>
        <MyConsole code={output} />
      </div>
    </div>
  );
};

export default MyCompiler;

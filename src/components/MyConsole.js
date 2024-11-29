import React, { useEffect, useState } from 'react';

export default function MyConsole({ code }) {
  const [output, setOutput] = useState('');
  useEffect(() => {
        setOutput(code)
    },[code]
   )
   
  return (
    <div style={{ display: 'flex', flexDirection: 'column',height:'655px', backgroundColor: 'black' }}>
      <div
        style={{
          backgroundColor: '#1e1e1e',
          color: 'white',
          padding: '20px',
          flex: 1,
          marginTop: '10px',
          marginLeft: '20px',
          marginRight: '20px',
        }}
      >
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

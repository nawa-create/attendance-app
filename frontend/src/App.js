import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkedIn, setCheckedIn] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    setMessage('出勤しました！');
    setCheckedIn(true);
    // 後でAPIと接続
  };

  const handleCheckOut = async () => {
    setMessage('退勤しました！');
    setCheckedIn(false);
    // 後でAPIと接続
  };

  return (
    <div className="App">
      <h1>勤怠管理システム</h1>
      <div className="clock">
        <h2>{currentTime.toLocaleTimeString('ja-JP')}</h2>
        <p>{currentTime.toLocaleDateString('ja-JP')}</p>
      </div>
      
      <div className="buttons">
        <button 
          onClick={handleCheckIn} 
          disabled={checkedIn}
          style={{
            padding: '20px 40px',
            fontSize: '20px',
            margin: '10px',
            backgroundColor: checkedIn ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: checkedIn ? 'not-allowed' : 'pointer'
          }}
        >
          出勤
        </button>
        
        <button 
          onClick={handleCheckOut}
          disabled={!checkedIn}
          style={{
            padding: '20px 40px',
            fontSize: '20px',
            margin: '10px',
            backgroundColor: !checkedIn ? '#ccc' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: !checkedIn ? 'not-allowed' : 'pointer'
          }}
        >
          退勤
        </button>
      </div>
      
      {message && <p style={{fontSize: '18px', marginTop: '20px'}}>{message}</p>}
    </div>
  );
}

export default App;
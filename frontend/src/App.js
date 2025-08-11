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
  try {
    const response = await fetch('/api/CheckIn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
  await response.json();  // dataを削除
  setMessage('出勤打刻完了！');
  setCheckedIn(true);
} else {
      setMessage('エラーが発生しました');
    }
  } catch (error) {
    setMessage('接続エラーが発生しました');
  }
};
const handleCheckOut = async () => {
  try {
    const response = await fetch('/api/CheckOut', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      setMessage(`退勤打刻完了！勤務時間: ${data.workHours}時間`);
      setCheckedIn(false);
    } else {
      setMessage('エラーが発生しました');
    }
  } catch (error) {
    setMessage('接続エラーが発生しました');
  }
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

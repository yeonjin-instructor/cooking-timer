import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const [duration, setDuration] = useState(5 * 60);
  const [remaining, setRemaining] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [minutesInput, setMinutesInput] = useState('5');
  const deadline = useRef(0);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const next = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) { setRunning(false); setFinished(true); }
    };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    document.title = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')} · 요리타이머`;
  }, [remaining]);

  function selectTime(seconds) {
    setRunning(false); setDuration(seconds); setRemaining(seconds); setFinished(false);
    setMinutesInput(String(seconds / 60));
  }
  function applyMinutes() {
    const minutes = Number(minutesInput);
    if (Number.isInteger(minutes) && minutes >= 1 && minutes <= 180) {
      if (minutes * 60 !== duration) selectTime(minutes * 60);
    } else {
      setMinutesInput(String(duration / 60));
    }
  }
  function toggle() {
    if (running) { setRunning(false); return; }
    const seconds = remaining > 0 ? remaining : duration;
    if (seconds === 0) return;
    setRemaining(seconds); setFinished(false);
    deadline.current = Date.now() + seconds * 1000;
    setRunning(true);
  }
  const progress = duration ? (duration - remaining) / duration : 0;

  return (
    <main>
      <header><a className="brand" href="./"><span className="brand-icon">🍳</span> 요리타이머</a><span className="header-note">맛있는 순간을 위한 작은 도우미</span></header>
      <section className="workspace" aria-label="카운트다운 타이머">
        <div className="eyebrow"><span /> A LITTLE TIME, A DELICIOUS MEAL</div>
        <h1>맛있어지는 시간을 재요.</h1>
        <p className="intro">보글보글 라면부터 따끈한 집밥까지, 시간은 맡겨두세요.</p>
        <div className="timer-card">
          <div className="card-top"><span>KITCHEN TIMER</span><span className="status"><i className={running ? 'active' : ''} />{running ? '요리하는 중' : finished ? '시간 완료' : '요리 준비'}</span></div>
          <div className="clock">
            <svg viewBox="0 0 300 300" aria-hidden="true"><circle className="track" cx="150" cy="150" r="137" /><circle className="progress" cx="150" cy="150" r="137" strokeDasharray={861} strokeDashoffset={861 * progress} /></svg>
            <div className="clock-content"><span className="clock-label">{finished ? 'TIME TO TASTE' : 'LET’S COOK'}</span><div className="time" role="timer" aria-label={`남은 시간 ${Math.floor(remaining / 60)}분 ${remaining % 60}초`}>{String(Math.floor(remaining / 60)).padStart(2, '0')}<span>:</span>{String(remaining % 60).padStart(2, '0')}</div><span className="clock-caption">{finished ? '이제 요리 상태를 확인해 보세요.' : running ? '맛있게 익어가는 중이에요.' : '오늘은 어떤 요리를 해볼까요?'}</span></div>
          </div>
          <div className="preset-label">오늘의 요리 <span>눌러서 시간을 선택하세요</span></div>
          <div className="presets" aria-label="요리별 시간 선택">{[{ name: '라면', min: 5, icon: '🍜' }, { name: '밥', min: 10, icon: '🍚' }, { name: '김치찌개', min: 30, icon: '🥘' }].map(({ name, min, icon }) => <button key={min} className={duration === min * 60 ? 'selected' : ''} onClick={() => selectTime(min * 60)} aria-pressed={duration === min * 60}><span className="dish-icon" aria-hidden="true">{icon}</span><strong>{name}</strong><span>{min}분</span></button>)}</div>
          <div className="custom"><label htmlFor="minutes">직접 설정</label><input id="minutes" type="number" min="1" max="180" value={minutesInput} onChange={e => setMinutesInput(e.target.value)} onBlur={applyMinutes} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} /><span>분</span></div>
          <div className="controls"><button className="start" onClick={toggle}><span aria-hidden="true">{running ? 'Ⅱ' : '▶'}</span>{running ? '일시정지' : remaining < duration && remaining > 0 ? '계속하기' : '타이머 시작'}</button><button className="reset" aria-label="타이머 초기화" title="초기화" onClick={() => selectTime(duration)}>↻</button></div>
          <p className="completion" role="status">{finished ? '✓ 설정한 시간이 모두 지났어요!' : '재료를 준비하고, 타이머를 시작해 보세요.'}</p>
        </div>
        <div className="tip"><span>✧</span><p>조리 시간은 재료의 양과 불 세기에 맞춰 조절해 주세요.</p></div>
      </section>
      <footer><span>MADE FOR YOUR KITCHEN.</span><span>오늘도 맛있는 한 끼.</span></footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

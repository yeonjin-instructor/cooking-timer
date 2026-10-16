import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const [duration, setDuration] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
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
    document.title = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')} · 잠깐, 집중`;
  }, [remaining]);

  function selectTime(seconds) {
    setRunning(false); setDuration(seconds); setRemaining(seconds); setFinished(false);
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
      <header><a className="brand" href="./"><span className="brand-icon">◷</span> 잠깐, 집중</a><span className="header-note">하나에 몰입하는 시간</span></header>
      <section className="workspace" aria-label="카운트다운 타이머">
        <div className="eyebrow"><span /> MAKE TIME FOR WHAT MATTERS</div>
        <h1>지금은, 집중할 시간.</h1>
        <p className="intro">잠시 다른 생각은 내려놓고, 한 가지에만 집중해 보세요.</p>
        <div className="timer-card">
          <div className="card-top"><span>FOCUS TIMER</span><span className="status"><i className={running ? 'active' : ''} />{running ? '집중하는 중' : finished ? '집중 완료' : '준비되셨나요?'}</span></div>
          <div className="clock">
            <svg viewBox="0 0 300 300" aria-hidden="true"><circle className="track" cx="150" cy="150" r="137" /><circle className="progress" cx="150" cy="150" r="137" strokeDasharray={861} strokeDashoffset={861 * progress} /></svg>
            <div className="clock-content"><span className="clock-label">{finished ? 'WELL DONE' : 'TIME TO FOCUS'}</span><div className="time" role="timer" aria-label={`남은 시간 ${Math.floor(remaining / 60)}분 ${remaining % 60}초`}>{String(Math.floor(remaining / 60)).padStart(2, '0')}<span>:</span>{String(remaining % 60).padStart(2, '0')}</div><span className="clock-caption">{finished ? '수고했어요. 잠시 쉬어가세요.' : running ? '조금씩, 목표에 가까워지고 있어요.' : '작은 집중이 큰 변화를 만들어요.'}</span></div>
          </div>
          <div className="presets" aria-label="시간 선택">{[5, 15, 25, 50].map(min => <button key={min} className={duration === min * 60 ? 'selected' : ''} onClick={() => selectTime(min * 60)} aria-pressed={duration === min * 60}>{min}분</button>)}</div>
          <div className="custom"><label htmlFor="minutes">직접 설정</label><input id="minutes" type="number" min="1" max="180" value={Math.floor(duration / 60)} onChange={e => { const value = Number(e.target.value); if (Number.isInteger(value) && value >= 1 && value <= 180) selectTime(value * 60); }} /><span>분</span></div>
          <div className="controls"><button className="start" onClick={toggle}><span aria-hidden="true">{running ? 'Ⅱ' : '▶'}</span>{running ? '일시정지' : remaining < duration && remaining > 0 ? '계속하기' : '집중 시작'}</button><button className="reset" aria-label="타이머 초기화" title="초기화" onClick={() => selectTime(duration)}>↻</button></div>
          <p className="completion" role="status">{finished ? '✓ 설정한 시간이 모두 지났어요!' : '서두르지 않아도 괜찮아요. 나만의 속도로.'}</p>
        </div>
        <div className="tip"><span>✧</span><p>집중한 뒤에는 잠깐의 휴식도 잊지 마세요.</p></div>
      </section>
      <footer><span>LESS DISTRACTION, MORE INTENTION.</span><span>오늘도 차근차근.</span></footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

import { useEffect, useRef, useState } from 'react';
import { chatWithAI } from '../../services/api';

const SUGGESTIONS = [
  '내일 3시에 회의 추가해줘',
  '이번 주 빈 시간 알려줘',
  '알고리즘 학습 일정 만들어줘',
  '현재 일정 보여줘',
];

const MAX_HISTORY = 10;

export default function AIChat({ onScheduleChange }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        '안녕하세요! AI 시간표 어시스턴트입니다 🎓\n\n자연어로 일정을 관리해 드립니다.\n\n예시:\n• "내일 3시에 팀 회의 추가해줘"\n• "이번 주 수요일 회의 4시로 변경해줘"\n• "알고리즘 공부 일정 만들어줘"',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [composing, setComposing] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const newUserMsg = { role: 'user', content: msg };
    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);

    try {
      const history = messages.slice(1).slice(-MAX_HISTORY).map((m) => ({ role: m.role, content: m.content }));
      const res = await chatWithAI(msg, history);
      const aiMsg = { role: 'assistant', content: res.data.reply };
      setMessages((prev) => [...prev, aiMsg]);
      onScheduleChange?.();
    } catch (err) {
      const detail = err.response?.data?.detail || 'AI 응답 실패. 다시 시도해주세요.';
      setMessages((prev) => [...prev, { role: 'assistant', content: `⚠️ ${detail}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!composing) send();
    }
  };

  const isDisabled = loading || !input.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: 20, border: '1px solid rgba(195,198,213,0.2)', overflow: 'hidden', boxShadow: '0 4px 24px rgba(24,28,30,0.06)' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(195,198,213,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: '#1a4db2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 20 }}>smart_toy</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 14, color: '#181c1e', letterSpacing: '-0.1px' }}>AI 어시스턴트</div>
            <div style={{ fontSize: 10, color: '#747684', fontWeight: 500 }}>시간표 자동 관리</div>
          </div>
        </div>
        {messages.length > 1 && (
          <button
            onClick={() => setMessages([messages[0]])}
            style={{ background: '#ebeef1', border: 'none', borderRadius: 8, color: '#434653', fontSize: 11, padding: '5px 10px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 600, transition: 'background 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e8eb'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#ebeef1'; }}
          >
            초기화
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, background: '#f7fafd' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === 'user' ? 'msg-user' : 'msg-ai'}
            style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%', display: 'flex', alignItems: 'flex-end', gap: 8 }}
          >
            {msg.role === 'assistant' && (
              <div style={{ width: 28, height: 28, borderRadius: 9, background: '#1a4db2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 16 }}>smart_toy</span>
              </div>
            )}
            <div style={{
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
              background: msg.role === 'user' ? '#1a4db2' : '#fff',
              border: msg.role === 'user' ? 'none' : '1px solid rgba(195,198,213,0.2)',
              color: msg.role === 'user' ? '#fff' : '#181c1e',
              fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap',
              boxShadow: msg.role === 'user' ? '0 4px 16px rgba(26,77,178,0.25)' : '0 1px 4px rgba(24,28,30,0.05)',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg-ai" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: '#1a4db2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 16 }}>smart_toy</span>
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: '#fff', border: '1px solid rgba(195,198,213,0.2)', display: 'flex', gap: 5, alignItems: 'center', boxShadow: '0 1px 4px rgba(24,28,30,0.05)' }}>
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 14px 10px', display: 'flex', gap: 6, flexWrap: 'wrap', background: '#f7fafd' }}>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s)}
              style={{ padding: '5px 12px', fontSize: 12, border: '1px solid rgba(179,197,255,0.6)', borderRadius: 9999, cursor: 'pointer', background: '#fff', color: '#1a4db2', whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#ebeef1'; e.currentTarget.style.borderColor = '#1a4db2'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(179,197,255,0.6)'; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(195,198,213,0.2)', display: 'flex', gap: 8, background: '#fff' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          onKeyDown={handleKeyDown}
          placeholder="메시지 입력 (Enter: 전송, Shift+Enter: 줄바꿈)"
          rows={2}
          style={{ flex: 1, padding: '9px 12px', border: '1px solid rgba(195,198,213,0.4)', borderRadius: 12, fontSize: 13, resize: 'none', fontFamily: "'Inter', sans-serif", outline: 'none', background: '#f7fafd', color: '#181c1e', transition: 'border-color 0.15s, box-shadow 0.15s' }}
          onFocus={(e) => { e.target.style.borderColor = '#1a4db2'; e.target.style.boxShadow = '0 0 0 2px rgba(26,77,178,0.15)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(195,198,213,0.4)'; e.target.style.boxShadow = 'none'; }}
        />
        <button
          onClick={() => send()}
          disabled={isDisabled}
          style={{ padding: '0 16px', background: isDisabled ? '#ebeef1' : '#1a4db2', color: isDisabled ? '#747684' : '#fff', border: 'none', borderRadius: 12, cursor: isDisabled ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13, flexShrink: 0, transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isDisabled ? 'none' : '0 4px 12px rgba(26,77,178,0.2)' }}
          onMouseEnter={(e) => { if (!isDisabled) { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
        </button>
      </div>
    </div>
  );
}

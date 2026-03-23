import { useEffect, useRef, useState } from 'react';
import { chatWithAI } from '../../services/api';

const SUGGESTIONS = [
  '오늘 빈 시간 알려줘',
  '월요일 오전 수업 추가해줘',
  '이번 주 일정 요약해줘',
  '시험 일정 알려줘',
];

export default function AIChat({ onScheduleChange }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '안녕하세요! SKEMA AI 어시스턴트입니다. 시간표 관리를 도와드릴게요. 자연어로 말씀해 주세요.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await chatWithAI(msg, newMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
      if (res.data.schedule_changed) onScheduleChange?.();
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '오류가 발생했습니다. 다시 시도해 주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const val = input.trim();
      if (!val || loading) return;
      setInput('');
      if (textareaRef.current) textareaRef.current.value = '';
      send(val);
    }
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      borderRadius: 20,
      border: '1px solid rgba(195,198,213,0.2)',
      boxShadow: '0 4px 24px rgba(24,28,30,0.06)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 18px',
        borderBottom: '1px solid rgba(195,198,213,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: '#1a4db2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 18 }}>smart_toy</span>
        </div>
        <div>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 14, color: '#181c1e', lineHeight: 1.1 }}>SKEMA 어시스턴트</div>
          <div style={{ fontSize: 11, color: '#747684', marginTop: 1 }}>AI 일정 관리</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#f0fdf4', borderRadius: 9999, border: '1px solid rgba(5,150,105,0.2)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} />
          <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>온라인</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 26, height: 26, borderRadius: 8, background: '#1a4db2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 8, alignSelf: 'flex-end', marginBottom: 2 }}>
                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 14 }}>smart_toy</span>
              </div>
            )}
            <div style={{
              maxWidth: '76%',
              padding: '10px 14px',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? '#1a4db2' : '#f1f4f7',
              color: m.role === 'user' ? '#fff' : '#181c1e',
              fontSize: 13,
              lineHeight: 1.6,
              fontFamily: "'Inter', sans-serif",
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: '#1a4db2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 14 }}>smart_toy</span>
            </div>
            <div style={{ padding: '10px 16px', background: '#f1f4f7', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{
                padding: '6px 12px',
                border: '1.5px solid rgba(179,197,255,0.6)',
                borderRadius: 9999,
                background: '#fff',
                color: '#1a4db2',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#dae1ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid rgba(195,198,213,0.2)',
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="메시지를 입력하세요... (Shift+Enter: 줄바꿈)"
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            border: '1.5px solid #e5e8eb',
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            outline: 'none',
            background: '#f7fafd',
            color: '#181c1e',
            lineHeight: 1.5,
            maxHeight: 100,
            overflowY: 'auto',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#1a4db2'; e.target.style.boxShadow = '0 0 0 2px rgba(26,77,178,0.15)'; }}
          onBlur={(e) => { e.target.style.borderColor = '#e5e8eb'; e.target.style.boxShadow = 'none'; }}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: loading || !input.trim() ? '#b3c5ff' : '#1a4db2',
            border: 'none',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s',
            boxShadow: loading || !input.trim() ? 'none' : '0 4px 12px rgba(26,77,178,0.3)',
          }}
          onMouseEnter={(e) => { if (!loading && input.trim()) { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'scale(1.05)'; } }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 18 }}>send</span>
        </button>
      </div>
    </div>
  );
}

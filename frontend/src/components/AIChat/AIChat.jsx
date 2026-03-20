import { useEffect, useRef, useState } from 'react';
import { chatWithAI } from '../../services/api';

const SUGGESTIONS = [
  '내일 3시에 회의 추가해줘',
  '이번 주 빈 시간 알려줘',
  '알고리즘 학습 일정 만들어줘',
  '현재 일정 보여줘',
];

// Max history to send (last N message pairs to avoid huge payloads)
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
  const [sendHovered, setSendHovered] = useState(false);
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
      // Build history to send: all messages except the initial greeting + the new user msg
      const history = messages
        .slice(1)          // skip initial greeting
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role, content: m.content }));

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
    <div
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        background: 'white', borderRadius: 16, border: '1px solid #E4E1F7',
        overflow: 'hidden', boxShadow: '0 4px 16px rgba(99,102,241,0.12)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          backgroundImage: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          fontWeight: 700, fontSize: 14, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span>🤖 AI 시간표 어시스턴트</span>
        {messages.length > 1 && (
          <button
            onClick={() => setMessages([messages[0]])}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6,
              color: 'white', fontSize: 11, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            대화 초기화
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1, overflowY: 'auto', padding: '12px 14px',
          display: 'flex', flexDirection: 'column', gap: 10,
          background: '#FAFAFF',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === 'user' ? 'msg-user' : 'msg-ai'}
            style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%', display: 'flex', alignItems: 'flex-end', gap: 6 }}
          >
            {msg.role === 'assistant' && (
              <div style={{
                width: 28, height: 28, borderRadius: 10, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0,
              }}>🤖</div>
            )}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'white',
                backgroundImage: msg.role === 'user' ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'none',
                border: msg.role === 'user' ? 'none' : '1px solid #EDE9FE',
                color: msg.role === 'user' ? 'white' : '#1E1B4B',
                fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                boxShadow: msg.role === 'user' ? '0 3px 12px rgba(99,102,241,0.35)' : '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg-ai" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 10, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0,
            }}>🤖</div>
            <div style={{
              padding: '12px 16px', borderRadius: '4px 16px 16px 16px',
              background: 'white', border: '1px solid #EDE9FE',
              display: 'flex', gap: 5, alignItems: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
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
        <div style={{ padding: '0 14px 10px', display: 'flex', gap: 6, flexWrap: 'wrap', background: '#FAFAFF' }}>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s)}
              style={{
                padding: '5px 10px', fontSize: 12, border: '1px solid #C4B5FD',
                borderRadius: 20, cursor: 'pointer', background: '#F5F3FF', color: '#6366F1',
                whiteSpace: 'nowrap', fontFamily: 'inherit',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid #E4E1F7', display: 'flex', gap: 8, background: 'white' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          onKeyDown={handleKeyDown}
          placeholder="메시지 입력 (Enter: 전송, Shift+Enter: 줄바꿈)"
          rows={2}
          style={{
            flex: 1, padding: '8px 12px', border: '1.5px solid #E4E1F7', borderRadius: 8,
            fontSize: 13, resize: 'none', fontFamily: 'inherit', outline: 'none',
            background: '#FAFAFF', color: '#1E1B4B',
          }}
        />
        <button
          onClick={() => send()}
          disabled={isDisabled}
          onMouseEnter={() => setSendHovered(true)}
          onMouseLeave={() => setSendHovered(false)}
          style={{
            padding: '0 14px',
            background: isDisabled ? 'linear-gradient(135deg, #DDD6FE, #C4B5FD)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            backgroundImage: isDisabled ? 'linear-gradient(135deg, #DDD6FE, #C4B5FD)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            color: 'white', border: 'none', borderRadius: 8,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            fontWeight: 700, fontSize: 13, flexShrink: 0,
            opacity: sendHovered && !isDisabled ? 0.88 : 1,
            transform: sendHovered && !isDisabled ? 'translateY(-1px)' : 'none',
            transition: 'opacity 0.15s, transform 0.15s', fontFamily: 'inherit',
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

interface AIChatProps {
  onClose?: () => void;
}

export function AIChat({ onClose }: AIChatProps) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '안녕하세요! 저는 시간표 관리 AI 어시스턴트입니다. 일정 추가, 수정, 삭제, 빈 시간 찾기 등을 도와드릴게요. 무엇을 도와드릴까요?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post<{ response: string }>('/ai/chat', {
        message: text,
        messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      // Refresh schedules in case AI modified them
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    } catch {
      toast.error('AI 응답 중 오류가 발생했습니다');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold">AI 어시스턴트</p>
            <p className="text-xs text-gray-400">일정 관리를 도와드립니다</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 text-xs font-bold mr-2 mt-1 flex-shrink-0">
                  AI
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-xl px-3 py-2 text-sm',
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                )}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 text-xs font-bold mr-2 mt-1 flex-shrink-0">
                AI
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea
            placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none text-sm min-h-[80px]"
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="self-end bg-indigo-600 hover:bg-indigo-700"
            size="sm"
          >
            전송
          </Button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { ChatMessage, Settings } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism';
import { format } from 'date-fns';

interface MessageListProps {
  messages: ChatMessage[];
  settings: Settings;
}

interface CodeProps {
  node: any;
  inline: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function MessageList({ messages, settings }: MessageListProps) {
  const codeTheme = (themes as any)[settings.codeTheme] || themes.oneDark;

  return (
    <div className="space-y-6 py-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-4 p-4 rounded-lg ${
            message.role === 'assistant'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-gray-700'
          }`}
        >
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'assistant'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-white'
              }`}
            >
              {message.role === 'assistant' ? 'AI' : 'U'}
            </div>
          </div>

          {/* Message Content */}
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span className="font-medium">
                {message.role === 'assistant' ? 'Assistant' : 'You'}
              </span>
              <span>
                {format(new Date(message.timestamp || Date.now()), 'HH:mm:ss')}
              </span>
            </div>

            {/* Content */}
            <div 
              className="prose prose-invert max-w-none"
              style={{ fontSize: `${settings.fontSize}px` }}
            >
              {settings.markdown ? (
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: CodeProps) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="relative group">
                          <div className="absolute -top-4 right-0 text-xs text-gray-400">
                            {match[1]}
                          </div>
                          <SyntaxHighlighter
                            style={codeTheme}
                            language={match[1]}
                            PreTag="div"
                            className="!my-0 !bg-gray-900 rounded-lg"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
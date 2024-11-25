import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, Settings, Save, Trash2, Code2, Terminal, Loader2, Settings2 } from 'lucide-react';
import { ChatMessage, Settings as SettingsType, ExportFormat } from './types';
import MessageList from './components/MessageList';
import SettingsPanel from './components/SettingsPanel';
import Footer from './components/Footer';
import { Toaster, toast } from 'react-hot-toast';
import { useHotkeys } from 'react-hotkeys-hook';
import { saveAs } from 'file-saver';
import { AnimatePresence } from 'framer-motion';
import { formatConversationContent, generatePDF, getFileExtension } from './utils/exportUtils';

const API_URL = 'http://localhost:3000';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SettingsType>({
    theme: 'dark',
    fontSize: 14,
    notifications: true,
    sound: true,
    markdown: true,
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    top_p: 1.0,
    max_tokens: null,
    presence_penalty: 0,
    frequency_penalty: 0,
    stream: true,
    language: 'pt-br',
    codeTheme: 'oneDark'
  });
  const [markdownEnabled, setMarkdownEnabled] = useState(settings.markdown);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts
  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    saveConversation();
  });
  useHotkeys('esc', () => {
    setShowSettings(false);
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('chat-settings');

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('chat-settings', JSON.stringify(settings));
  }, [settings]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const newMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          message: inputMessage,
          config: {
            model: settings.model,
            temperature: settings.temperature,
            top_p: settings.top_p,
            max_tokens: settings.max_tokens,
            presence_penalty: settings.presence_penalty,
            frequency_penalty: settings.frequency_penalty,
            stream: settings.stream,
            language: settings.language
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.content,
        timestamp: data.timestamp || new Date().toISOString(),
        id: Date.now().toString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (settings.sound) {
        new Audio('/message.mp3').play().catch(console.error);
      }
      
      if (settings.notifications && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('New message received');
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.name === 'AbortError') {
        toast.error('Request timed out. Please try again.');
      } else if (error.message.includes('API key')) {
        toast.error('Invalid API key. Please check your configuration.');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, settings]);

  const clearHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/clear`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear history');
      }
      
      setMessages([]);
      toast.success('Chat history cleared');
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Failed to clear history');
    }
  };

  const saveConversation = async (format: ExportFormat = 'json') => {
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
      const fileName = `chat-export-${timestamp}${getFileExtension(format)}`;

      if (format === 'pdf') {
        const pdfBlob = generatePDF(messages);
        saveAs(pdfBlob, fileName);
      } else {
        const content = formatConversationContent(messages, format);
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, fileName);
      }

      toast.success('Chat exported successfully!');
    } catch (error) {
      console.error('Error exporting chat:', error);
      toast.error('Failed to export chat. Please try again.');
    }
  };

  const handleSettingsUpdate = (newSettings: SettingsType) => {
    setSettings(newSettings);
    localStorage.setItem('chat-settings', JSON.stringify(newSettings));
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage, adjustTextareaHeight]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className={`${settings.theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {/* Aside - Sidebar */}
          <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
            {/* Logo/Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Code2 className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-semibold text-white">DevChat</h1>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
              <button
                onClick={() => {
                  const format = window.prompt(
                    'Choose export format (json, md, txt, pdf):',
                    'json'
                  ) as ExportFormat;
                  
                  if (format && ['json', 'md', 'txt', 'pdf'].includes(format)) {
                    saveConversation(format);
                  } else if (format) {
                    toast.error('Invalid format selected. Please try again.');
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>Save Chat</span>
              </button>

              <button
                onClick={clearHistory}
                className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear History</span>
              </button>
            </nav>

            {/* Settings Footer */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings2 className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 relative overflow-hidden bg-gray-900">
            <div className="absolute inset-0 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <div className="h-full flex flex-col max-w-4xl mx-auto">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth">
                    <MessageList 
                      messages={messages}
                      settings={settings}
                    />
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-gray-700 p-4 sticky bottom-0 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
                    <form onSubmit={handleSubmit} className="flex gap-4 max-w-4xl mx-auto">
                      <div className="flex-1 relative">
                        <div className="absolute left-4 top-4">
                          <Terminal className="w-5 h-5 text-gray-400" />
                        </div>
                        <textarea
                          ref={textareaRef}
                          value={inputMessage}
                          onChange={(e) => {
                            setInputMessage(e.target.value);
                            adjustTextareaHeight();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSubmit(e);
                            } else if (e.key === 'Enter' && e.shiftKey) {
                              adjustTextareaHeight();
                            }
                          }}
                          placeholder="Ask me anything about coding... (Enter to send, Shift+Enter for new line)"
                          className="w-full bg-gray-800 text-gray-100 rounded-lg pl-12 pr-4 py-3 min-h-[56px] max-h-[300px] overflow-y-auto resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                          style={{ height: 'auto' }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-4 py-2 flex items-center gap-2 transition-colors text-white h-[56px]"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
        {/* Floating Panels */}
        <AnimatePresence>
          {showSettings && (
            <SettingsPanel
              settings={settings}
              onUpdate={handleSettingsUpdate}
              onClose={() => setShowSettings(false)}
            />
          )}
        </AnimatePresence>

        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default App;
export type MessageRole = 'user' | 'assistant' | 'system';

export type ModelType = 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo' | 'o1-preview' | 'o1-mini';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: string;
  id: string;
}

export interface CodeBlock {
  code: string;
  language: string;
  fileName?: string;
}

export type TemplateCategory = 
  | 'Project Setup'
  | 'Design Patterns'
  | 'Testing'
  | 'Documentation'
  | 'DevOps'
  | 'Database'
  | 'API'
  | 'Security'
  | 'Performance'
  | 'Custom';

export interface Settings {
  theme: 'light' | 'dark';
  fontSize: number;
  notifications: boolean;
  sound: boolean;
  markdown: boolean;
  model: ModelType;
  temperature: number;
  top_p: number;
  max_tokens: number | null;
  presence_penalty: number;
  frequency_penalty: number;
  stream: boolean;
  language: 'pt-br' | 'en';
  codeTheme: string;
}

export type ExportFormat = 'json' | 'md' | 'txt' | 'pdf';

export interface ConversationExport {
  id: string;
  title: string;
  messages: ChatMessage[];
  tags: string[];
  settings: Settings;
  createdAt: string;
  updatedAt: string;
  format: ExportFormat;
}

export interface ChatConfig {
  model: ModelType;
  temperature: number;
  top_p: number;
  presence_penalty: number;
  frequency_penalty: number;
  language: string;
}
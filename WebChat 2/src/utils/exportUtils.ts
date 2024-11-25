import { ChatMessage, ExportFormat } from '../types';
import { format as formatDate } from 'date-fns';
import jsPDF from 'jspdf';

export const formatConversationContent = (
  messages: ChatMessage[],
  format: ExportFormat
): string => {
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDate(new Date(timestamp), 'HH:mm:ss');
    } catch (error) {
      return timestamp;
    }
  };

  switch (format) {
    case 'json':
      return JSON.stringify(messages, null, 2);

    case 'md':
      return messages
        .map((msg) => {
          const role = msg.role === 'assistant' ? 'Assistant' : 'You';
          const time = formatTimestamp(msg.timestamp);
          return `### ${role} (${time})\n\n${msg.content}\n\n---\n`;
        })
        .join('\n');

    case 'txt':
      return messages
        .map((msg) => {
          const role = msg.role === 'assistant' ? 'Assistant' : 'You';
          const time = formatTimestamp(msg.timestamp);
          return `[${time}] ${role}:\n${msg.content}\n\n`;
        })
        .join('');

    case 'pdf':
      return messages
        .map((msg) => {
          const role = msg.role === 'assistant' ? 'Assistant' : 'You';
          const time = formatTimestamp(msg.timestamp);
          return `[${time}] ${role}:\n${msg.content}\n\n`;
        })
        .join('');

    default:
      return '';
  }
};

export const generatePDF = (messages: ChatMessage[]): Blob => {
  const doc = new jsPDF();
  const content = formatConversationContent(messages, 'txt');
  
  // Configurações de fonte e margens
  doc.setFont('helvetica');
  doc.setFontSize(10);
  
  const splitText = doc.splitTextToSize(content, 180);
  let yPosition = 20;
  
  // Adiciona título
  doc.setFontSize(16);
  doc.text('Chat Export', 15, 15);
  doc.setFontSize(10);
  
  splitText.forEach((line: string) => {
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 15, yPosition);
    yPosition += 5;
  });
  
  return doc.output('blob');
};

export const getFileExtension = (format: ExportFormat): string => {
  switch (format) {
    case 'json':
      return '.json';
    case 'md':
      return '.md';
    case 'txt':
      return '.txt';
    case 'pdf':
      return '.pdf';
    default:
      return '';
  }
};

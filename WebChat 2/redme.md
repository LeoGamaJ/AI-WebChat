# WebChat with OpenAi

![DevChat Logo](https://img.shields.io/badge/DevChat-AI%20Assistant-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

DevChat is a modern, AI-powered code assistant that helps developers with coding tasks, debugging, and technical discussions. Built with React and TypeScript, it provides a sleek, user-friendly interface for interacting with various Large Language Models.


![WebChat screem](./assets/screem.png)


## 🚀 Features

- 💬 Real-time chat interface with AI
- 🎨 Beautiful, responsive UI with dark/light mode
- 🔧 Multiple LLM model support
- 💾 Chat history export (JSON, MD, TXT, PDF)
- ⚡ Fast and efficient code highlighting
- ⚙️ Customizable settings
- 🔄 Markdown support for better formatting

## 🛠️ Technologies Used

- **Frontend:**
  - React 18
  - TypeScript
  - TailwindCSS
  - Lucide Icons
  - Framer Motion
  - React Hot Toast

- **Backend:**
  - Node.js
  - Express
  - OpenAI API

- **Development Tools:**
  - Vite
  - ESLint
  - PostCSS
  - npm

## 🤖 Supported AI Models

- GPT-4o
- GPT-4o-mini
- GPT-4
- GPT-4-Turbo
- GPT-3.5 Turbo
- o1-preview
- o1-mini

## 🚀 Getting Started

1. **Clone the repository**

2. **Install dependencies**
   \`\`\`bash
   # Install frontend dependencies
   npm install

   # Install server dependencies
   cd server
   npm install
   \`\`\`

3. **Configure environment variables**
   Create a \`.env\` file in the server directory:
   \`\`\`env
   OPENAI_API_KEY=your_api_key_here
   PORT=3000
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   # Start the backend server
   cd server
   npm run dev

   # In another terminal, start the frontend
   cd ..
   npm run dev
   \`\`\`

5. **Open the application**
   Navigate to \`http://localhost:5173\` in your browser

## 💡 Usage

1. **Chat Interface:**
   - Type your message in the input field
   - Press Enter to send (Shift+Enter for new line)
   - Code blocks are automatically highlighted

2. **Settings:**
   - Click the settings icon to open the settings panel
   - Customize theme, font size, and AI model
   - Toggle markdown support and notifications

3. **Export Conversations:**
   - Click the "Save Chat" button
   - Choose your preferred format (JSON, MD, TXT, PDF)
   - Files are automatically downloaded
  
![WebChat save](./assets/screem_save.png)

## ⚙️ Configuration Options

- **Font Size:** Adjustable text size
- **AI Model:** Selection of available LLMs
- **Temperature:** Adjust response creativity (0.0 - 1.0)
- **Max Tokens:** Control response length
- **Language:** Set preferred response language

  ![WebChat settings](./assets/screem_settings.png)


## 🔒 Security

- API keys are stored securely in environment variables
- CORS is configured for secure client-server communication
- All external requests are validated and sanitized

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License 

## 👤 Author

Leo Gama
- GitHub: [@LeoGamaJ](https://github.com/LeoGamaJ)
- Email: leo@leogama.cloud 
- LinkedIn: (https://www.linkedin.com/in/leonardo-gama-jardim/)

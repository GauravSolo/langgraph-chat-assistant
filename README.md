# AI Chat Assistant

A modern, full-stack AI chat application built with Next.js, LangGraph, and Cerebras LLM. Features a clean, responsive UI with real-time chat capabilities and web search integration via Tavily.

## 🚀 Features

- **AI-Powered Chat**: Conversational AI assistant powered by Cerebras (Llama-3.3-70b)
- **Web Search Integration**: Real-time web search capabilities via Tavily Search
- **Modern UI**: Clean, responsive chat interface with dark mode support
- **Message History**: Persistent conversation history with auto-scroll
- **Tool Calling**: Agent can dynamically use search tools based on user queries
- **TypeScript**: Fully typed codebase for better developer experience
- **Next.js App Router**: Built with Next.js 16 App Router for optimal performance

## 🏗️ Architecture

### Overview

This application follows a layered architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Components (UI/Form.tsx)                      │  │
│  │  - User Interface                                    │  │
│  │  - Message Rendering                                 │  │
│  │  - State Management                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP POST
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/chat/route.ts                                  │  │
│  │  - Request Handler                                   │  │
│  │  - Message Transformation                            │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  agent.service.ts                                    │  │
│  │  - Agent Invocation                                  │  │
│  │  - Thread Management                                 │  │
│  │  - Response Processing                               │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Agent Layer (LangGraph)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  assistant.agent.ts                                  │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │  StateGraph Workflow                         │   │  │
│  │  │  ┌──────────┐     ┌──────────┐              │   │  │
│  │  │  │  Agent   │────▶│ ToolNode │              │   │  │
│  │  │  │  (LLM)   │◀────│ (Tavily) │              │   │  │
│  │  │  └──────────┘     └──────────┘              │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │  - LLM: Cerebras (Llama-3.3-70b)                    │  │
│  │  - Tools: Tavily Search                             │  │
│  │  - Memory: MemorySaver (Checkpointer)               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Flow

1. **User Input** → React component (`Form.tsx`) captures user message
2. **API Request** → Frontend service (`chat.service.ts`) sends POST to `/api/chat`
3. **API Handler** → Next.js route handler processes request and transforms message
4. **Agent Service** → Service layer invokes LangGraph agent with message context
5. **Agent Processing** → LangGraph workflow:
   - Agent node processes message with LLM
   - Conditional routing: if tool calls needed → ToolNode
   - ToolNode executes Tavily search if required
   - Loop back to agent with tool results
   - Return final response when complete
6. **Response** → Response flows back through layers to UI

### Key Architectural Decisions

- **Layered Architecture**: Clear separation between UI, API, services, and agents
- **LangGraph StateGraph**: Enables complex agent workflows with tool calling
- **Memory Checkpointer**: Maintains conversation context across requests
- **Service Layer**: Abstracts agent complexity from API routes
- **Type Safety**: Full TypeScript implementation for reliability

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons

### Backend / AI
- **LangGraph 1.0.15** - Agent workflow framework
- **LangChain Core 1.1.12** - LLM abstraction
- **Cerebras LLM** - Llama-3.3-70b model
- **Tavily Search** - Web search tool integration

### Development
- **pnpm** - Package manager
- **ESLint** - Code linting
- **TypeScript** - Type checking

## 📁 Project Structure

```
src/
├── agents/              # LangGraph agent definitions
│   └── assistant.agent.ts    # Main agent workflow with LLM and tools
│
├── app/                 # Next.js App Router
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # Chat API endpoint
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
│
├── components/          # React components
│   └── ui/
│       └── Form.tsx          # Chat UI component
│
├── services/            # Business logic layer
│   ├── agent.service.ts      # Agent invocation service
│   └── chat.service.ts       # Frontend API service
│
└── utils/               # Utility functions (reserved for future use)
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **pnpm** (or npm/yarn)
- **API Keys**:
  - Cerebras API key
  - Tavily API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   CEREBRAS_API_KEY=your_cerebras_api_key_here
   TAVILY_API_KEY=your_tavily_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📡 API Documentation

### POST /api/chat

Send a chat message to the AI assistant.

**Request:**
```typescript
{
  message: string | {
    role: "user" | "assistant",
    content: string
  }
}
```

**Response:**
```typescript
{
  message: string
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the weather today?"}'
```

## 🔄 Agent Workflow

The LangGraph agent implements the following workflow:

1. **Agent Node**: Receives user message and processes with LLM
2. **Conditional Routing**: 
   - If LLM decides tools are needed → route to ToolNode
   - Otherwise → return response (end)
3. **Tool Node**: Executes Tavily search if needed
4. **Loop**: Tool results return to Agent node for final processing
5. **Response**: Final message returned to user

This enables the agent to:
- Answer questions directly
- Search the web when needed
- Combine search results with reasoning
- Maintain conversation context

## 🎨 Features in Detail

### Chat Interface

- **Message Bubbles**: Distinct styling for user and assistant messages
- **Avatar Icons**: Visual indicators for message senders
- **Auto-scroll**: Automatically scrolls to latest messages
- **Loading States**: Animated typing indicator during AI processing
- **Dark Mode**: Automatic dark mode support
- **Responsive Design**: Works on desktop and mobile devices

### Agent Capabilities

- **Natural Language Understanding**: Powered by Llama-3.3-70b
- **Web Search**: Can search the internet for current information
- **Context Awareness**: Maintains conversation history
- **Tool Selection**: Dynamically decides when to use search tools

## 🔧 Configuration

### Agent Configuration

Edit `src/agents/assistant.agent.ts` to customize:

- **LLM Model**: Change model or provider
- **Temperature**: Adjust creativity (0.0-1.0)
- **Max Tokens**: Limit response length
- **Tools**: Add or modify available tools

### UI Configuration

Edit `src/components/ui/Form.tsx` to customize:

- **Styling**: Modify Tailwind classes
- **Layout**: Adjust chat container dimensions
- **Features**: Add new UI features

## 🐛 Troubleshooting

### Common Issues

1. **500 Error on Chat**
   - Check that API keys are set in `.env.local`
   - Verify API keys are valid
   - Check server console for detailed errors

2. **Agent Not Using Tools**
   - Ensure Tavily API key is configured
   - Check agent logs for tool call decisions
   - Verify tool configuration in agent file

3. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `pnpm install`
   - Check Node.js version compatibility

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CEREBRAS_API_KEY` | API key for Cerebras LLM service | Yes |
| `TAVILY_API_KEY` | API key for Tavily search service | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [LangChain](https://github.com/langchain-ai/langchain) - LLM framework
- [LangGraph](https://github.com/langchain-ai/langgraph) - Agent workflows
- [Next.js](https://nextjs.org/) - React framework
- [Cerebras](https://www.cerebras.net/) - LLM provider
- [Tavily](https://tavily.com/) - Search API

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangChain Documentation](https://js.langchain.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Built with ❤️ using Next.js and LangGraph**

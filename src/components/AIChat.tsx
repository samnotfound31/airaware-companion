import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  text: string;
  from: "user" | "assistant";
  timestamp: string;
}

interface AIChatProps {
  isFloating?: boolean;
}

export default function AIChat({ isFloating = false }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isFloating);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to Socket.IO server
    // IMPORTANT: Replace with your actual backend URL
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("auth_token") || "",
      },
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected");
      setIsConnected(true);
      // Emit join event with user ID if logged in
      const userId = localStorage.getItem("user_id");
      if (userId) {
        socket.emit("join", { userId });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setIsConnected(false);
    });

    socket.on("assistant_message", (data: { text: string; timestamp: string }) => {
      console.log("Received assistant message:", data);
      const newMessage: Message = {
        id: Date.now().toString(),
        text: data.text,
        from: "assistant",
        timestamp: data.timestamp,
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsSending(false);
      
      // Increment unread count if chat is collapsed
      if (isFloating && !isExpanded) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [isFloating, isExpanded]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !isConnected) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      from: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    // Send to backend via Socket.IO
    socketRef.current.emit("user_message", {
      userId: localStorage.getItem("user_id"),
      text: input,
      meta: {
        lat: 0, // TODO: Add actual user location
        lon: 0,
      },
    });

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setUnreadCount(0);
    }
  };

  // Floating launcher (collapsed state)
  if (isFloating && !isExpanded) {
    return (
      <button
        onClick={toggleExpanded}
        className="fixed bottom-6 right-6 z-50 glass-card rounded-full p-4 hover:scale-110 transition-transform"
        aria-label="Open AI chat"
      >
        <MessageSquare className="w-6 h-6 text-accent" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  // Main chat pane
  return (
    <div
      className={`${
        isFloating
          ? "fixed bottom-6 right-6 w-96 max-h-[600px] z-50 shadow-2xl"
          : "w-full h-full"
      } glass-card rounded-3xl flex flex-col overflow-hidden animate-slide-up`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
            AI
          </div>
          <div>
            <h3 className="font-bold text-sm">AI Agent</h3>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "Online" : "Connecting..."}
            </p>
          </div>
        </div>
        {isFloating && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpanded}
            className="rounded-full"
            aria-label="Minimize chat"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            Start a conversation with your AI assistant
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.from === "user"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className="text-xs opacity-60 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={!isConnected || isSending}
            aria-label="Chat message input"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected || isSending}
            size="icon"
            className="rounded-full w-12 h-12 shrink-0 self-end"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

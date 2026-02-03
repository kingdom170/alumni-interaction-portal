"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { alumniData, type ChatMessage } from "@/lib/data"
import { useParams } from "next/navigation"

export default function ChatPage() {
  const params = useParams()
  const alumniId = Number.parseInt(params.alumniId as string)
  const alumni = alumniData.find((a) => a.id === alumniId)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "alumni",
      message: "Hi! Thanks for reaching out. How can I help you with your career?",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      sender: "user",
      message: "Hi! I'm interested in transitioning to software development. Can you give me some advice?",
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: "3",
      sender: "alumni",
      message:
        "First, I'd recommend building a strong foundation in programming. Start with one language like Python or JavaScript. Then work on real projects and contribute to open source.",
      timestamp: new Date(Date.now() - 3400000),
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: ChatMessage = {
        id: String(messages.length + 1),
        sender: "user",
        message: inputMessage,
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
      setInputMessage("")

      // Simulate alumni response after 1 second
      setTimeout(() => {
        const responses = [
          "That's a great question! Let me share my experience...",
          "I'm glad you asked. Here's what worked for me...",
          "Great point! You should also consider...",
          "That's exactly what I did at your stage...",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        const alumniResponse: ChatMessage = {
          id: String(messages.length + 2),
          sender: "alumni",
          message: randomResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, alumniResponse])
      }, 1000)
    }
  }

  if (!alumni) {
    return <div>Alumni not found</div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar userType="user" />

      <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4 md:p-6">
          <div className="flex items-center gap-4">
            <div className="text-3xl">{alumni.image}</div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{alumni.name}</h1>
              <p className="text-sm text-muted-foreground">
                {alumni.profession} at {alumni.company}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card border border-border text-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4 md:p-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask a career-related question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={handleSendMessage} className="px-6">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

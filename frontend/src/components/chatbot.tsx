import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatDots } from '@vectopus/atlas-icons-react'
interface Message {
    sender: 'user' | 'bot'
    text: string
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState<string>('')
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const sendMessage = async () => {
        if (!input.trim()) return
        const userMessage: Message = { sender: 'user', text: input }
        setMessages([...messages, userMessage])
        setInput('')

        try {
            const response = await fetch(
                'https://dsu1qzfodk.execute-api.eu-central-1.amazonaws.com/api-v1/chat/ask',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: input }),
                }
            )
            const data = await response.json()
            const botMessage: Message = { sender: 'bot', text: data.answer }
            setMessages((prev) => [...prev, botMessage])
        } catch {
            const errorMessage: Message = {
                sender: 'bot',
                text: 'Sorry, something went wrong.',
            }
            setMessages((prev) => [...prev, errorMessage])
        }
    }

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage()
        }
    }

    return (
        <>
            <button
                className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
                onClick={() => setIsOpen(true)}
            >
                <ChatDots size={24} />
            </button>

            {isOpen && (
                <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-lg w-96 min-h-96 max-h-96 flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-semibold">
                            City Guide Chatbot
                        </h2>
                        <button onClick={() => setIsOpen(false)}>X</button>
                    </div>
                    <ScrollArea className="flex-1 p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-2 flex ${
                                    msg.sender === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                <span
                                    className={`px-3 py-1 rounded ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                    </ScrollArea>
                    <div className="flex p-4 border-t">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleEnter}
                            placeholder="Ask about the city..."
                            className="flex-1 mr-2"
                        />
                        <Button onClick={sendMessage}>Send</Button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Chatbot

'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'

// Import ShadCN UI components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
//import { Spinner } from '@/components/ui/spinner'

interface ChatMessage {
    chat_id: string
    message: string
    sent_from: string
    send_to?: string
    message_id: string
    timestamp: string
    action?: string
}

interface ChatHistoryResponse {
    chat_history: ChatMessage[]
}

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [messageInput, setMessageInput] = useState('')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Extract chat_id from URL parameters
    const params = useParams()
    const chatId = params?.chat_id || 'default_chat'

    // Hardcoded user email
    const userEmail = 'karlojakopov@gmail.com'

    useEffect(() => {
        const fetchChatHistory = async () => {
            const token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmxvamFrb3BvdkBnbWFpbC5jb20iLCJleHAiOjE3MzEwMDE3ODh9.cyK5SrYIi6fqH58MwleUCHnCAdlsclqb2ytg-xG4xbs' // TODO: Securely manage your Bearer JWT token
            const historyUrl = `https://klgbtzqxah.execute-api.eu-central-1.amazonaws.com/api-v1/chat/history?chat_id=${chatId}`

            try {
                const response = await fetch(historyUrl, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error(
                        `Error fetching chat history: ${response.statusText}`
                    )
                }

                const data: ChatHistoryResponse = await response.json()

                // **Sort messages by timestamp in ascending order**
                const sortedMessages = data.chat_history.sort(
                    (a, b) =>
                        new Date(a.timestamp).getTime() -
                        new Date(b.timestamp).getTime()
                )

                setMessages(sortedMessages)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(
                    err.message ||
                        'An unknown error occurred while fetching chat history.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchChatHistory()
    }, [chatId])

    useEffect(() => {
        // Initialize WebSocket connection after fetching history
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmxvamFrb3BvdkBnbWFpbC5jb20iLCJleHAiOjE3MzEwMDE3ODh9.cyK5SrYIi6fqH58MwleUCHnCAdlsclqb2ytg-xG4xbs' // TODO: Securely manage your Bearer JWT token
        const wsUrl = `wss://l5lzelphya.execute-api.eu-central-1.amazonaws.com/api-v1/?x-access-token=${token}`

        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
            console.log('Connected to chat WebSocket')
            // Optionally, send a message to join the chat room
            const joinPayload = {
                action: 'join',
                chat_id: chatId,
                sent_from: userEmail,
            }
            ws.send(JSON.stringify(joinPayload))
        }

        ws.onmessage = (event) => {
            // **Append new message and ensure chronological order**
            const newMessage = {
                message: event.data,
                sent_from: '',
                chat_id: '',
                message_id: 'newMessage',
                timestamp: new Date().toISOString(),
            }
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, newMessage]
                return updatedMessages.sort(
                    (a, b) =>
                        new Date(a.timestamp).getTime() -
                        new Date(b.timestamp).getTime()
                )
            })
        }

        ws.onclose = () => console.log('Disconnected from chat WebSocket')

        setSocket(ws)

        return () => ws.close()
    }, [chatId, userEmail])

    useEffect(() => {
        // Scroll to the bottom when messages update
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = () => {
        if (
            socket &&
            socket.readyState === WebSocket.OPEN &&
            messageInput.trim()
        ) {
            const messagePayload: ChatMessage = {
                action: 'sendmessage',
                message: messageInput.trim(),
                chat_id: chatId as string,
                sent_from: userEmail,
                send_to: '', // Set appropriately if needed
                message_id: generateUUID(), // Implement a UUID generator or use a library
                timestamp: new Date().toISOString(),
            }
            socket.send(JSON.stringify(messagePayload))
            setMessages((prev) => {
                const updatedMessages = [...prev, messagePayload]
                // **Ensure messages remain sorted after sending**
                return updatedMessages.sort(
                    (a, b) =>
                        new Date(a.timestamp).getTime() -
                        new Date(b.timestamp).getTime()
                )
            }) // Append locally
            setMessageInput('') // Clear input field
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage()
        }
    }

    /*if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <Spinner />
            </div>
        )
    }*/

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-red-500">
                <p>{error}</p>
                <Button
                    onClick={() => router.push('/chat/rooms')}
                    className="mt-4"
                >
                    Back to Rooms
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-gray-800 shadow">
                <h1 className="text-2xl font-semibold">Chat Room: {chatId}</h1>
                <Button
                    variant="destructive"
                    onClick={() => {
                        // Handle logout or other actions
                        localStorage.removeItem('jwt_token')
                        router.push('/login')
                    }}
                    className="bg-red-500 hover:bg-red-600"
                >
                    Logout
                </Button>
            </header>

            {/* Messages Area */}
            <main className="flex-1 p-4 overflow-y-auto">
                <Card className="bg-gray-800 shadow-lg">
                    <CardContent className="flex flex-col space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.message_id}
                                className={`flex ${
                                    msg.sent_from !== userEmail
                                        ? 'justify-start'
                                        : 'justify-end'
                                }`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                                        msg.sent_from !== userEmail
                                            ? 'bg-gray-700 text-gray-100'
                                            : 'bg-blue-600 text-white'
                                    } transition-all duration-300 ease-in-out`}
                                >
                                    <p className="text-sm">{msg.message}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="block text-xs text-right opacity-75">
                                            {msg.sent_from}
                                        </span>
                                        <span className="block text-xs text-right opacity-50 ml-2">
                                            {new Date(
                                                msg.timestamp
                                            ).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </CardContent>
                </Card>
            </main>

            {/* Input Area */}
            <footer className="p-4 bg-gray-800 shadow">
                <div className="mt-4 flex space-x-2">
                    <Input
                        type="text"
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!messageInput.trim()}
                        className={`flex-shrink-0 px-4 py-2 rounded-md ${
                            !messageInput.trim()
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        } text-white transition-colors duration-200`}
                    >
                        Send
                    </Button>
                </div>
            </footer>
        </div>
    )
}

// Utility function to generate UUID (if not using a library)
function generateUUID() {
    // Public Domain/MIT
    let d = new Date().getTime() //Timestamp
    let d2 = (performance && performance.now && performance.now() * 1000) || 0 //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            let r = Math.random() * 16 //random number between 0 and 16
            if (d > 0) {
                r = (d + r) % 16 | 0
                d = Math.floor(d / 16)
            } else {
                r = (d2 + r) % 16 | 0
                d2 = Math.floor(d2 / 16)
            }
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
        }
    )
}

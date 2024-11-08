'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

// Import ShadCN UI components
import { Button } from '@/components/ui/Button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card'
//import { Spinner } from '@/components/ui/Spinner'

// Utility function for conditional class names
import { cn } from '@/lib/utils'

interface ChatRoom {
    chat_id: string
    connections: string[]
    users: string[]
}

interface RoomsResponse {
    rooms: ChatRoom[]
}

export default function RoomsList() {
    const [rooms, setRooms] = useState<ChatRoom[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRooms = async () => {
            const token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcmxvamFrb3BvdkBnbWFpbC5jb20iLCJleHAiOjE3MzEwMDE3ODh9.cyK5SrYIi6fqH58MwleUCHnCAdlsclqb2ytg-xG4xbs'

            try {
                const response = await fetch(
                    'https://klgbtzqxah.execute-api.eu-central-1.amazonaws.com/api-v1/chat/rooms',
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                )

                if (!response.ok) {
                    throw new Error(
                        `Error fetching rooms: ${response.statusText}`
                    )
                }

                const data: RoomsResponse = await response.json()
                setRooms(data.rooms)
            } catch (err: any) {
                setError(err.message || 'An unknown error occurred.')
            } finally {
                setLoading(false)
            }
        }

        fetchRooms()
    }, [])

    /*if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <Spinner />
      </div>
    )
  }*/

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
                <p>{error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                Active Chat Rooms
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <Link href={`/chat/${room.chat_id}`} key={room.chat_id}>
                        <Card className="cursor-pointer hover:shadow-xl transition-shadow duration-200">
                            <CardHeader>
                                <CardTitle>
                                    {room.users.join(', ') || 'Unnamed Room'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">
                                    Chat ID: {room.chat_id}
                                </p>
                                <p className="text-sm">Connections:</p>
                                <ul className="list-disc list-inside text-gray-400">
                                    {room.connections.map((email, index) => (
                                        <li key={index}>{email}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
            {rooms.length === 0 && (
                <p className="text-center text-gray-400 mt-4">
                    No active chat rooms available.
                </p>
            )}
        </div>
    )
}

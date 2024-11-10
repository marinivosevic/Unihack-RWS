'use client'

import TicketForm from '@/components/TicketForm'
import TicketTable from '@/components/TicketTable'
import { Card } from '@/components/ui/card'
import React from 'react'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

import { Spinner } from '@nextui-org/spinner'

interface Ticket {
    id: string
    sender: string
    city: string
    ticket: string
    published_at: string
    picture?: string
}

function Page() {
    const [createModal, setCreateModal] = React.useState(false)
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = React.useState<boolean>(true)

    const getAllTickets = async () => {
        const API_URL = process.env.NEXT_PUBLIC_SUPPORT_API
        const token = Cookies.get('token')
        const city = Cookies.get('city')

        try {
            const response = await fetch(
                `${API_URL}/support/received/${city}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            const data = await response.json()
            setTickets(data.tickets)
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        setLoading(true)
        getAllTickets()
    }, [])

    const handleResolve = async (ticketId: string) => {
        setLoading(true)
        console.log('Resolving ticket:', ticketId)
        const API_URL = process.env.NEXT_PUBLIC_SUPPORT_API
        const token = Cookies.get('token')

        try {
            const response = await fetch(`${API_URL}/support/${ticketId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error('Failed to resolve ticket')
            }

            const data = await response.json()
            console.log(data)

            const updatedTickets = tickets.filter(
                (ticket) => ticket.id !== ticketId
            )
            setTickets(updatedTickets)
            setLoading(false)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-start text-white">
                    Tickets
                </h1>

                <button
                    className="bg-quinterny-500 hover:bg-quinterny-400 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setCreateModal(true)}
                >
                    Create +
                </button>
            </div>
            {loading ? (
                <div className="flex items-center space-x-2 text-white m-4">
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <Spinner color="secondary" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                    <span>Loading tickets...</span>
                </div>
            ) : (
                <TicketTable tickets={tickets} onResolve={handleResolve} />
            )}

            {createModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Card className="w-[450px] h-[400px] bg-primary-950/60 border-0 flex items-center justify-start p-8 relative">
                        <button
                            className="absolute bottom-5 left-7 bg-red-500 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setCreateModal(false)}
                        >
                            Close
                        </button>
                        <TicketForm
                            onClose={() => {
                                setCreateModal(false)
                                setLoading(true)
                                getAllTickets()
                            }}
                        />
                    </Card>
                </div>
            )}
        </div>
    )
}

export default Page

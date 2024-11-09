// components/TicketTable.tsx
'use client'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

interface TicketTableProps {
    sender: string
    city: string
    ticket: string
    id: string
    timestamp?: string
    picture?: string // Fixed typo from 'pricture' to 'picture'
}

function TicketTable() {
    const [tickets, setTickets] = useState<TicketTableProps[]>([])

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
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getAllTickets()
    }, [])

    return (
        <div className="w-full bg-white border border-primary-900 shadow-sm shadow-zinc-400 rounded-lg p-2 mt-4 overflow-auto">
            <table className="w-full">
                <thead className="bg-primary-400">
                    <tr className="rounded-lg">
                        <th className="text-left p-4 rounded-tl-lg rounded-bl-lg text-txt-100 font-jakarta font-medium text-md">
                            Ticket ID
                        </th>
                        <th className="text-left p-4 text-txt-100 font-jakarta font-medium text-md">
                            Sender
                        </th>
                        <th className="text-left p-4 text-txt-100 font-jakarta font-medium text-md">
                            City
                        </th>
                        <th className="text-left p-4 text-txt-100 font-jakarta font-medium text-md">
                            Ticket
                        </th>
                        <th className="text-left p-4 text-txt-100 font-jakarta font-medium text-md">
                            Created At
                        </th>
                        <th className="text-left p-4 rounded-tr-lg rounded-br-lg text-txt-100 font-jakarta font-medium text-md">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <tr className="hover:border-b border-primary-900 hover:cursor-pointer">
                            <td className="p-4">{ticket.id}</td>
                            <td className="p-4">{ticket.sender}</td>
                            <td className="p-4">{ticket.city}</td>
                            <td className="p-4">{ticket.ticket}</td>
                            <td className="p-4">{ticket.timestamp}</td>
                            <td className="p-4 flex items-center">
                                <button>Resolve</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TicketTable

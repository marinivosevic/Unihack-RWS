// components/TicketTable.tsx

'use client'

import React from 'react'

interface Ticket {
    id: string
    sender: string
    city: string
    ticket: string
    published_at: string
    picture?: string
}

interface TicketTableProps {
    tickets: Ticket[]
    onResolve: (id: string) => void
}

const TicketTable: React.FC<TicketTableProps> = ({ tickets, onResolve }) => {
    const [modal, setModal] = React.useState(false)
    const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(
        null
    )

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket)
        setModal(true)
    }

    return (
        <>
            {modal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-primary-900 p-4 rounded-lg">
                        <h2 className="text-xl text-white font-jakarta font-medium">
                            Ticket Details
                        </h2>
                        <p className="text-white mt-2">
                            <span className="font-bold">Ticket ID:</span>{' '}
                            {selectedTicket?.id}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                            <button
                                onClick={() => setModal(false)}
                                className="mt-4 bg-white text-primary-900 px-4 py-2 rounded-lg"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    onResolve(selectedTicket?.id!)
                                    setModal(false)
                                }}
                                className="mt-4 bg-primary-500 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
                            >
                                Set as resolved
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                            <th className="text-left p-4 rounded-tr-lg rounded-br-lg text-txt-100 font-jakarta font-medium text-md">
                                Created At
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-4 text-center text-sm text-gray-500"
                                >
                                    No tickets submitted yet.
                                </td>
                            </tr>
                        ) : (
                            tickets.map((ticket) => (
                                <tr
                                    onClick={() => handleTicketClick(ticket)}
                                    key={ticket.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                >
                                    {/* Ticket ID */}
                                    <td className="p-4 text-sm text-gray-900">
                                        #{ticket.id}
                                    </td>

                                    {/* Sender */}
                                    <td className="p-4 text-sm text-gray-500 max-w-xs">
                                        <div
                                            className="truncate"
                                            title={ticket.sender}
                                        >
                                            {ticket.sender}
                                        </div>
                                    </td>

                                    {/* City */}
                                    <td className="p-4 text-sm text-gray-500 max-w-xs">
                                        <div
                                            className="truncate"
                                            title={ticket.city}
                                        >
                                            {ticket.city}
                                        </div>
                                    </td>

                                    {/* Ticket */}
                                    <td className="p-4 text-sm text-gray-500 max-w-lg">
                                        <div
                                            className="truncate"
                                            title={ticket.ticket}
                                        >
                                            {ticket.ticket}
                                        </div>
                                    </td>

                                    {/* Created At */}
                                    <td className="p-4 text-sm text-gray-500">
                                        {ticket.published_at}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default TicketTable

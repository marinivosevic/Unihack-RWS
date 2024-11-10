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
                <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center">
                    <div className="bg-quinterny-500 p-4 rounded-lg">
                        <h2 className="text-xl text-white font-jakarta font-medium">
                            Ticket Details
                        </h2>
                        <p className="text-white mt-2">
                            <span className="font-bold">Ticket ID:</span>{' '}
                            {selectedTicket?.id}
                        </p>
                        <p className="text-white mt-2">
                            <span className="font-bold">Sender:</span>{' '}
                            {selectedTicket?.sender}
                        </p>
                        <p className="text-white mt-2">
                            <span className="font-bold">Ticket:</span>{' '}
                            {selectedTicket?.ticket}
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
            <div className="w-full bg-black border border-primary-900 shadow-sm shadow-zinc-400 rounded-lg p-2 mt-4 overflow-auto">
                <table className="w-full">
                    <thead className="bg-quinterny-400">
                        <tr className="rounded-lg">
                            <th className="text-left p-4 rounded-tl-lg rounded-bl-lg text-white font-jakarta font-medium text-md">
                                Ticket ID
                            </th>
                            <th className="text-left p-4 text-white font-jakarta font-medium text-md">
                                Sender
                            </th>
                            <th className="text-left p-4 text-white font-jakarta font-medium text-md">
                                City
                            </th>
                            <th className="text-left p-4 text-white font-jakarta font-medium text-md">
                                Ticket
                            </th>
                            <th className="text-left p-4 rounded-tr-lg rounded-br-lg text-white font-jakarta font-medium text-md">
                                Created At
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-4 text-center text-sm text-white"
                                >
                                    No tickets submitted yet.
                                </td>
                            </tr>
                        ) : (
                            tickets.map((ticket) => (
                                <tr
                                    onClick={() => handleTicketClick(ticket)}
                                    key={ticket.id}
                                    className="hover:bg-primary-900 cursor-pointer"
                                >
                                    {/* Ticket ID */}
                                    <td className="p-4 text-sm text-white border-b-2 border-gray-800">
                                        #{ticket.id}
                                    </td>

                                    {/* Sender */}
                                    <td className="p-4 text-sm text-white max-w-xs border-b-2 border-gray-800">
                                        <div
                                            className="truncate"
                                            title={ticket.sender}
                                        >
                                            {ticket.sender}
                                        </div>
                                    </td>

                                    {/* City */}
                                    <td className="p-4 text-sm text-white max-w-xs border-b-2 border-gray-800">
                                        <div
                                            className="truncate"
                                            title={ticket.city}
                                        >
                                            {ticket.city}
                                        </div>
                                    </td>

                                    {/* Ticket */}
                                    <td className="p-4 text-sm text-white max-w-lg border-b-2 border-gray-800">
                                        <div
                                            className="truncate"
                                            title={ticket.ticket}
                                        >
                                            {ticket.ticket}
                                        </div>
                                    </td>

                                    {/* Created At */}
                                    <td className="p-4 text-sm text-white border-b-2 border-gray-800">
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

'use client'

import TicketForm from '@/components/TicketForm'
import TicketTable from '@/components/TicketTable'
import { Card } from '@/components/ui/card'
import React from 'react'

function Page() {
    const [createModal, setCreateModal] = React.useState(false)

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-start text-white">
                    Tickets
                </h1>

                <button
                    className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setCreateModal(true)}
                >
                    Create +
                </button>
            </div>

            <TicketTable />

            {createModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Card className="w-[450px] h-[400px] flex items-center justify-start p-8 relative">
                        <button
                            className="absolute bottom-5 left-7 bg-red-500 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setCreateModal(false)}
                        >
                            Close
                        </button>
                        <TicketForm />
                    </Card>
                </div>
            )}
        </div>
    )
}

export default Page

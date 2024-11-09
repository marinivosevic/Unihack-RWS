import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function TicketForm() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-start text-white mb-8">
                Submit your ticket
            </h1>
            <div className="grid w-full max-w-sm items-center gap-1.5 mt-5">
                <Label htmlFor="ticket" className="text-white font-medium">
                    Ticket
                </Label>
                <Textarea
                    className="bg-gray-300 placeholder:text-black/40"
                    placeholder="Enter the ticket details"
                />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 my-5">
                <Label htmlFor="picture" className="text-white font-medium">
                    Picture
                </Label>
                <Input
                    id="picture"
                    type="file"
                    className="bg-gray-300 placeholder:text-black/40"
                />
            </div>
        </div>
    )
}

export default TicketForm

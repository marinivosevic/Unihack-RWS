// components/TicketForm.tsx

'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Cookies from 'js-cookie'
import { z } from 'zod'
import { ticketSchema } from '@/schemas/ticketSchema'

interface TicketFormProps {
    onClose: () => void
}

interface Ticket {
    id: string
    sender: string
    city: string
    ticket: string
    published_at: string
    picture?: string
}

function TicketForm({ onClose }: TicketFormProps) {
    const city = Cookies.get('city') || 'Unknown' // Fallback if city is not set

    // Form state
    const [formData, setFormData] = useState({
        ticket: '',
        picture: null as File | null,
    })

    // Validation errors
    const [errors, setErrors] = useState({
        ticket: '',
        picture: '',
    })

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, files } = e.target as HTMLInputElement

        if (name === 'picture' && files) {
            setFormData((prev) => ({ ...prev, picture: files[0] }))
            // Clear previous error
            setErrors((prev) => ({ ...prev, picture: '' }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
            // Clear previous error
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    // Convert image file to Base64
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                if (typeof reader.result === 'string') resolve(reader.result)
                else reject('Failed to convert image to Base64.')
            }
            reader.onerror = (error) => reject(error)
        })
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitSuccess(false)
        setErrors({ ticket: '', picture: '' })

        try {
            // Validate form data
            const validatedData = ticketSchema.parse({
                ticket: formData.ticket,
                picture: formData.picture,
            })

            // Convert image to Base64 if present
            let base64Image = ''
            if (validatedData.picture) {
                base64Image = await convertToBase64(validatedData.picture)
            }

            // Create a new ticket object
            const newTicket = {
                city,
                ticket: validatedData.ticket,
                picture: base64Image.replace(/^data:image\/\w+;base64,/, ''),
            }

            // Submit to API
            const API_URL = process.env.NEXT_PUBLIC_SUPPORT_API
            const token = Cookies.get('token')

            const response = await fetch(`${API_URL}/support`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newTicket),
            })

            if (!response.ok) {
                throw new Error('Failed to submit ticket')
            }

            const data = await response.json()
            console.log('Ticket created:', data)

            // Reset form
            setFormData({ ticket: '', picture: null })
            setSubmitSuccess(true)
            // Close the modal
            onClose()
        } catch (err) {
            if (err instanceof z.ZodError) {
                // Map Zod errors to form errors
                const fieldErrors: { [key: string]: string } = {}
                err.errors.forEach((error) => {
                    const fieldName = error.path[0]
                    fieldErrors[fieldName] = error.message
                })
                setErrors((prev) => ({ ...prev, ...fieldErrors }))
            } else {
                console.error('Submission Error:', err)
                alert('Failed to submit the ticket. Please try again.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            className="w-full flex flex-col"
            onSubmit={handleSubmit}
            noValidate
        >
            <h1 className="text-3xl font-bold text-start text-white mb-2">
                Submit your ticket
            </h1>
            <h2 className="text-base font-light text-start text-white/70 mb-8">
                Enter the details of your ticket
            </h2>

            {/* Ticket Details */}
            <div className="grid w-full max-w-sm items-center gap-1.5 mt-5">
                <Label htmlFor="ticket" className="text-white font-medium">
                    Ticket
                </Label>
                <Textarea
                    id="ticket"
                    name="ticket"
                    value={formData.ticket}
                    onChange={handleChange}
                    className={`bg-gray-300 placeholder:text-black/40 ${
                        errors.ticket ? 'border border-red-500' : ''
                    }`}
                    placeholder="Enter the ticket details"
                    required
                />
                {errors.ticket && (
                    <span className="text-red-500 text-sm">
                        {errors.ticket}
                    </span>
                )}
            </div>

            {/* Picture Upload */}
            <div className="grid w-full max-w-sm items-center gap-1.5 my-5">
                <Label htmlFor="picture" className="text-white font-medium">
                    Picture
                </Label>
                <Input
                    id="picture"
                    name="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className={`bg-gray-300 placeholder:text-black/40 ${
                        errors.picture ? 'border border-red-500' : ''
                    }`}
                />
                {errors.picture && (
                    <span className="text-red-500 text-sm">
                        {errors.picture}
                    </span>
                )}
            </div>

            {/* Submit Button */}
            <button
                className={`${
                    isSubmitting
                        ? 'bg-quinterny-300 cursor-not-allowed'
                        : 'bg-quinterny-500 hover:bg-quinterny-600'
                } text-white font-bold self-end py-2 px-4 rounded mt-4`}
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>

            {/* Success Message */}
            {submitSuccess && (
                <div className="mt-4 text-green-500 font-semibold">
                    Ticket submitted successfully!
                </div>
            )}
        </form>
    )
}

export default TicketForm

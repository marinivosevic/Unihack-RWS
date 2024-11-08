// components/Form.tsx
'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Checkbox } from '@/components/CheckBox' // Import your custom Checkbox component

// Define Zod schema
const formSchema = z.object({
    num_rooms: z.number().min(1, 'Number of rooms must be at least 1'),
    num_people: z.number().min(1, 'Number of people must be at least 1'),
    housearea: z.number().min(1, 'House area must be a positive number'),
    is_ac: z.boolean(),
    is_tv: z.boolean(),
    is_flat: z.boolean(),
    ave_monthly_income: z.number().min(0, 'Income cannot be negative'),
    num_children: z.number().min(0, 'Number of children cannot be negative'),
    is_urban: z.boolean(),
})

type FormData = z.infer<typeof formSchema> // Infer TypeScript type from schema

export default function Form() {
    const [formData, setFormData] = useState<FormData>({
        num_rooms: 0,
        num_people: 0,
        housearea: 0,
        is_ac: false,
        is_tv: false,
        is_flat: false,
        ave_monthly_income: 0,
        num_children: 0,
        is_urban: false,
    })

    const [error, setError] = useState<z.ZodIssue[] | null>(null)
    const [result, setResult] = useState<any | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : Number(value) || value,
        }))
    }

    const handleCheckboxChange = (name: keyof FormData, checked: boolean) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked,
        }))
    }

    const getPrediction = async (data: FormData) => {
        setLoading(true)
        const API_URL = process.env.NEXT_PUBLIC_BILL_API

        const submitData = {
            num_rooms: data.num_rooms,
            num_people: data.num_people,
            housearea: data.housearea,
            is_ac: data.is_ac ? 1 : 0,
            is_tv: data.is_tv ? 1 : 0,
            is_flat: data.is_flat ? 1 : 0,
            ave_monthly_income: data.ave_monthly_income,
            num_children: data.num_children,
            is_urban: data.is_urban ? 1 : 0,
        }

        const response = await fetch(`${API_URL}/bill/electricity/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submitData),
        })

        const result = await response.json()
        console.log(result)
        setResult(result.predictionResult.toFixed(2))
        setLoading(false)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const parseResult = formSchema.safeParse(formData)

        if (!parseResult.success) {
            setError(parseResult.error.errors)
            return
        }

        setError(null)
        // handle valid data (submit to server or further processing)
        getPrediction(formData)
    }

    return (
        <>
            {result && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
                    <div className="w-3/4 max-w-lg h-auto bg-primary-600 flex flex-col items-center justify-center p-10 rounded-2xl shadow-lg transform transition-all duration-300 ease-in-out scale-100">
                        <h1 className="text-4xl font-bold text-center text-white mb-6">
                            Prediction Result
                        </h1>
                        <p className="text-white font-semibold text-center text-2xl mb-6">
                            Electricity Bill Prediction: {result} €
                        </p>
                        <button
                            className="bg-primary-500 hover:bg-primary-700 text-white p-3 w-1/3 rounded-lg mt-8 transition-all duration-200 ease-in-out transform hover:scale-105"
                            onClick={() => setResult(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <form
                className="flex flex-col space-y-4 h-auto"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col w-1/2 space-y-2 h-auto">
                    <label className="text-white">Number of Rooms:</label>
                    <input
                        className="p-2 rounded-md bg-gray-300 border border-white shadow-sm shadow-white"
                        type="number"
                        name="num_rooms"
                        value={formData.num_rooms}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col w-1/2 space-y-2 h-auto">
                    <label className="text-white">Number of People:</label>
                    <input
                        className="p-2 rounded-md bg-gray-300 border border-white shadow-sm shadow-white"
                        type="number"
                        name="num_people"
                        value={formData.num_people}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col w-1/2 space-y-2 h-auto">
                    <label className="text-white">House Area (sq m):</label>
                    <input
                        className="p-2 rounded-md bg-gray-300 border border-white shadow-sm shadow-white"
                        type="number"
                        name="housearea"
                        value={formData.housearea}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-row w-1/2 space-x-2 h-auto">
                    <label className="text-white">Air Conditioning:</label>
                    <Checkbox
                        checked={formData.is_ac}
                        onCheckedChange={(checked) =>
                            handleCheckboxChange('is_ac', checked as boolean)
                        }
                        className="m-1 bg-white"
                    />
                </div>
                <div className="flex flex-row w-1/2 space-x-2 h-auto">
                    <label className="text-white">TV:</label>
                    <Checkbox
                        checked={formData.is_tv}
                        onCheckedChange={(checked) =>
                            handleCheckboxChange('is_tv', checked as boolean)
                        }
                        className="m-1 bg-white"
                    />
                </div>
                <div className="flex flex-row w-1/2 space-x-2 h-auto">
                    <label className="text-white">Do you live in a flat:</label>
                    <Checkbox
                        checked={formData.is_flat}
                        onCheckedChange={(checked) =>
                            handleCheckboxChange('is_flat', checked as boolean)
                        }
                        className="m-1 bg-white"
                    />
                </div>
                <div className="flex flex-col w-1/2 space-y-2 h-auto">
                    <label className="text-white">
                        Average Monthly Income(€):
                    </label>
                    <input
                        className="p-2 rounded-md bg-gray-300 border border-white shadow-sm shadow-white"
                        type="number"
                        name="ave_monthly_income"
                        value={formData.ave_monthly_income}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col w-1/2 space-y-2 h-auto">
                    <label className="text-white">Number of Children:</label>
                    <input
                        className="p-2 rounded-md bg-gray-300 border border-white shadow-sm shadow-white"
                        type="number"
                        name="num_children"
                        value={formData.num_children}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-row w-1/2 space-x-2 h-auto">
                    <label className="text-white">
                        Do you live in an urban area:
                    </label>
                    <Checkbox
                        checked={formData.is_urban}
                        onCheckedChange={(checked) =>
                            handleCheckboxChange('is_urban', checked as boolean)
                        }
                        className="m-1 bg-white"
                    />
                </div>

                {error && (
                    <div>
                        <p>Validation Errors:</p>
                        <ul>
                            {error.map((err, index) => (
                                <li key={index}>{err.message}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    className="bg-primary-500 text-white p-2 rounded-md w-1/4 self-start mt-5"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </form>
        </>
    )
}

// FILE: page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table' // Adjust the import path based on your project setup
import Cookies from 'js-cookie'

// Define the User type based on API response
interface User {
    id: number
    first_name: string
    last_name: string
    email: string
}

// Define the API response type
interface ApiResponse {
    users: User[]
}

const Page = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Replace with your actual API endpoint

        const fetchUserData = async () => {
            try {
                const token = Cookies.get('token')
                const response = await fetch(
                    'https://lrpedwzxrl.execute-api.eu-central-1.amazonaws.com/api-v1/profile/info/public',
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (!response.ok) {
                    throw new Error(
                        `Error: ${response.status} ${response.statusText}`
                    )
                }

                const data = await response.json()
                console.log(data.info)
                setUsers(data.info)
                console.log(users)
                setLoading(false)
            } catch (err) {
                setError((err as Error).message)
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    return (
        <div className="min-h-screen  p-8">
            <h1 className="text-3xl font-bold text-center text-white mb-6">
                User Profile
            </h1>

            {loading && (
                <div className="flex justify-center items-center">
                    <svg
                        className="animate-spin h-8 w-8 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                    <span className="ml-2 text-gray-600">Loading...</span>
                </div>
            )}

            {error && (
                <div className="text-center text-red-500">
                    <p>Failed to load user data.</p>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="overflow-x-auto">
                    <Table className="min-w-full  shadow-md rounded-xl">
                        <TableHeader className="bg-quinterny-500 ">
                            <TableRow>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    First Name
                                </TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Last Name
                                </TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Email
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                key={users.first_name}
                                className="hover:bg-primary-900"
                            >
                                <TableCell className="px-6 py-4 whitespace-nowrap text-white">
                                    {users.first_name}
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-white">
                                    {users.last_name}
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-blue-600">
                                    {users.email}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}

export default Page

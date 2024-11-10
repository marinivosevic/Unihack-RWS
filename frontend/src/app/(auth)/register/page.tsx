'use client'

import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/userContext'
import { logo, login } from '@/constants/images' // Ensure you have the onboarding image
import Image from 'next/image'
import CircularProgress from '@mui/joy/CircularProgress'
import Link from 'next/link'
import Cookies from 'js-cookie'

const RegisterSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password too short')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
})

const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
}

interface FormData {
    first_name: string
    last_name: string
    email: string
    password: string
    confirmPassword: string
}

export default function RegisterPage() {
    const { setUser } = useUser() // Get setUser from context
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null) // Error state
    const API_URL = process.env.NEXT_PUBLIC_USER_API_URL

    const handleSubmit = async (values: FormData) => {
        setIsSubmitting(true)
        setFormError(null) // Reset error state

        const formData = {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            password: values.password,
        }

        try {
            const response = await fetch(`${API_URL}/authentication/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            console.log('Success:', data)

            // Store the token in cookies with security options
            Cookies.set('token', data.token, {
                expires: 7, // Expires in 7 days
                secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
                sameSite: 'strict', // To prevent CSRF
            })

            // Store the user data in context and navigate to dashboard
            setUser(data) // Set user data
            router.push('/login') // Redirect to the dashboard
            setIsSubmitting(false)
        } catch (error: any) {
            console.error('Error:', error)
            setIsSubmitting(false)

            // Set a user-friendly error message
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setFormError(error.response.data.message)
            } else {
                setFormError('An unexpected error occurred. Please try again.')
            }
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-primary-950">
            {/* Left Side - Register Form */}
            <div className="md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-primary-300/10 backdrop-blur-xl rounded-lg shadow-lg py-10 px-8 border border-white/20">
                    <div className="text-center mb-8">
                        <Image
                            src={logo}
                            alt="Logo"
                            className="w-20 h-20 mx-auto mb-4"
                            width={80}
                            height={80}
                        />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-quinterny-400 to-quinterny-700 bg-clip-text text-transparent">
                            UrbanPulse
                        </h1>
                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={RegisterSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-6">
                                {/* First Name */}
                                <div>
                                    <label
                                        htmlFor="first_name"
                                        className="block text-sm font-medium text-white"
                                    >
                                        First Name
                                    </label>
                                    <Field
                                        type="text"
                                        name="first_name"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage
                                        name="first_name"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block text-sm font-medium text-white"
                                    >
                                        Last Name
                                    </label>
                                    <Field
                                        type="text"
                                        name="last_name"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage
                                        name="last_name"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-white"
                                    >
                                        Email
                                    </label>
                                    <Field
                                        type="email"
                                        name="email"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-white"
                                    >
                                        Password
                                    </label>
                                    <Field
                                        type="password"
                                        name="password"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-white"
                                    >
                                        Confirm Password
                                    </label>
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Display Form Error */}
                                {formError && (
                                    <div className="text-red-500 text-sm text-center">
                                        {formError}
                                    </div>
                                )}

                                {/* Submit Button */}
                                {isSubmitting ? (
                                    <div className="flex justify-center items-center">
                                        <CircularProgress />
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center">
                                        <button
                                            type="submit"
                                            className="
                                                bg-gradient-to-t from-quinterny-600 to-quinterny-900
                                                text-white 
                                                px-4 py-2 
                                                rounded 
                                                transform 
                                                transition 
                                                duration-300 
                                                ease-in-out 
                                                hover:scale-110
                                            "
                                        >
                                            Register
                                        </button>
                                    </div>
                                )}
                            </Form>
                        )}
                    </Formik>

                    {/* Additional Links */}
                    <div className="text-center mt-4">
                        <Link
                            href="/login"
                            className="text-sm bg-quinterny-300 bg-clip-text text-transparent hover:bg-quinterny-600 duration-300"
                        >
                            Already have an account? Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="md:w-1/2 hidden md:flex items-center justify-center">
                <Image
                    src={login} // Replace with your image import
                    alt="Register"
                    className="object-cover rounded-lg"
                    width={600} // Adjust width and height as needed
                    height={800}
                    priority // Optional: Prioritize loading
                />
            </div>
        </div>
    )
}

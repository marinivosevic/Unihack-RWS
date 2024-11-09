'use client'

import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/userContext'
import { logo, login } from '@/constants/images' // Ensure you have the login image
import Image from 'next/image'
import CircularProgress from '@mui/joy/CircularProgress'
import Link from 'next/link'
import Cookies from 'js-cookie'

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
})

const initialValues = {
    email: '',
    password: '',
}

interface FormData {
    email: string
    password: string
}

export default function LoginPage() {
    const { setUser } = useUser() // Get setUser from context
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const API_URL = process.env.NEXT_PUBLIC_USER_API_URL

    const handleSubmit = async (values: FormData) => {
        setIsSubmitting(true)
        const formData: FormData = {
            email: values.email,
            password: values.password,
        }

        try {
            const response = await fetch(`${API_URL}/authentication/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()
            console.log(data)

            // Store the token in cookies with a secure flag
            Cookies.set('token', data.token, {
                expires: 7, // Expires in 7 days
                secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
                sameSite: 'strict', // To prevent CSRF
            })
            Cookies.set('isAdmin', data.isAdmin, {
                expires: 7,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            })
            // Store the user data in context
            setUser(data)
            router.push('/Map')
            setIsSubmitting(false)
        } catch (error) {
            console.error('Error:', error)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-primary-950">
            {/* Left Side - Login Form */}
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
                        <h1 className="text-3xl font-bold text-blue-500">
                            UrbanPulse
                        </h1>
                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={LoginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-6">
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
                                {isSubmitting ? (
                                    <div className="flex justify-center items-center">
                                        <CircularProgress />
                                    </div>
                                ) : (
                                    <div className="flex justify-center gap-4 items-center">
                                        <button
                                            type="submit"
                                            className="
                                                bg-gradient-to-t from-gradient-100 via-gradient-100 to-primary-400 
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
                                            Login
                                        </button>
                                        <Link href="https://lrpedwzxrl.execute-api.eu-central-1.amazonaws.com/api-v1/authentication/login/third-party?type_of_service=google">
                                            <button
                                                type="submit"
                                                className="
                                                    bg-gradient-to-t from-gradient-100 via-gradient-100 to-primary-400
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
                                                Login with google
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </Form>
                        )}
                    </Formik>
                    <div className="text-center mt-4">
                        <Link
                            href="/register"
                            className="text-sm text-blue-500 hover:text-blue-700"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="md:w-1/2 hidden md:flex items-center justify-center">
                <Image
                    src={login} // Replace with your image import
                    alt="login"
                    className="object-cover rounded-lg"
                    width={600} // Adjust width and height as needed
                    height={800}
                />
            </div>
        </div>
    )
}

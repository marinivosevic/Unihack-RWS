'use client'

import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

import * as images from '@/constants/images'
import NavBar from '@/components/NavBar'

function Page() {
    const router = useRouter()

    const handleGetStarted = () => {
        console.log('Get Started')
        router.push('/login')
    }

    return (
        <>
            <NavBar />
            <div className="w-full min-h-screen flex flex-row justify-center bg-primary-950">
                {/* Hero */}
                <div className="flex flex-col items-center w-1/2 p-12 mt-23">
                    <Image
                        src={images.noviLogo}
                        alt="Novi Logo"
                        width={160}
                        height={160}
                        className="mb-4"
                    />
                    <h1 className="text-5xl text-center font-bold text-white">
                        Welcome to{' '}
                        <span className="bg-gradient-to-r from-quinterny-400 to-quinterny-700 bg-clip-text text-transparent">
                            UrbanPulse
                        </span>
                    </h1>
                    <h2 className="text-xl font-bold text-center text-white mt-4">
                        Transforming Urban Living Through Innovation and
                        Connectivity
                    </h2>
                    <button
                        onClick={handleGetStarted}
                        className="
                    bg-gradient-to-t from-quinterny-500 via-blue-950 to-quinterny-700 text-white
                    font-bold text-lg rounded-lg py-2 px-4 mt-12 w-1/4 z-50                                                 
                    transform 
                    transition 
                    duration-300 
                    ease-in-out 
                    hover:scale-110"
                    >
                        Get Started
                    </button>
                </div>
                <Image
                    src={images.onboarding}
                    alt="onboard"
                    className="absolute top-52"
                />
            </div>
        </>
    )
}

export default Page

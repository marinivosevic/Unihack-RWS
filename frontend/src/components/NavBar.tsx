'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import * as images from '@/constants/images'

function NavBar() {
    const pathname = usePathname()

    return (
        <div className="w-full h-16 bg-primary-950 flex justify-between items-center px-5 py-2">
            {/* Left Side - Logo and Brand Name */}
            <div className="flex flex-row items-center mt-2">
                <Image src={images.logo} alt="Logo" width={60} height={60} />
                <h1 className="text-3xl font-bold text-white ml-2">
                    UrbanPulse
                </h1>
            </div>

            {/* Right Side - Conditional "Login" Link */}
            {pathname === '/' && (
                <div className="mr-8">
                    <Link
                        href="/login"
                        className="text-white font-bold hover:text-primary-500 transition-colors duration-300"
                    >
                        Login
                    </Link>
                </div>
            )}
        </div>
    )
}

export default NavBar

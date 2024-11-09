// components/Sidebar.tsx

'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa' // Using react-icons for icons
import Image from 'next/image'
import * as images from '@/constants/images'
import Cookies from 'js-cookie'

const Sidebar: React.FC = () => {
    const pathname = usePathname()

    const navLinks = [
        { name: 'Home', href: '/dashboard', icon: <FaHome /> },
        {
            name: 'Bill prediction',
            href: '/dashboard/bill_prediction',
            icon: <FaUser />,
        },
        { name: 'Profile', href: '/dashboard/profile', icon: <FaUser /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <FaCog /> },
    ]

    const logout = () => {
        Cookies.remove('token')
        window.location.href = '/login'
    }

    return (
        <div className="w-64 h-screen bg-primary-900/20 text-white flex flex-col">
            {/* Logo or Brand Name */}
            <div className="flex flex-row items-center justify-start h-16 border-b border-primary-800 px-2">
                <Image src={images.logo} alt="Logo" width={40} height={40} />
                <span className="text-2xl font-bold ml-2">UrbanPulse</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2 relative">
                {navLinks.map((link) => (
                    <Link key={link.name} href={link.href}>
                        <p
                            className={`flex items-center p-2 rounded hover:bg-primary-800 transition-colors ${
                                pathname === link.href ? 'bg-primary-800' : ''
                            }`}
                        >
                            <span className="mr-3">{link.icon}</span>
                            {link.name}
                        </p>
                    </Link>
                ))}
                <button onClick={logout} className="absolute bottom-2 w-[85%]">
                    <p className="flex items-center p-2 rounded hover:bg-primary-800 transition-colors w-full">
                        <span className="mr-3">
                            <FaSignOutAlt />
                        </span>
                        Logout
                    </p>
                </button>
            </nav>
        </div>
    )
}

export default Sidebar

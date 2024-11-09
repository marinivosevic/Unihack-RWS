'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
const Page = () => {
    const router = useRouter()
    const isAdmin = Cookies.get('isAdmin')
    if (isAdmin === 'false') {
        router.push('/login')
    }

    return isAdmin === 'false' ? (
        <div> Redirecting...</div>
    ) : (
        <div>
            <h1> Add News </h1>
        </div>
    )
}

export default Page

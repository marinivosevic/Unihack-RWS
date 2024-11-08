import React from 'react'

import * as images from '@/app/constants/images'
import Image from 'next/image'

function NavBar() {
    return (
        <div className="w-full h-16 bg-primary-950 flex justify-between items-center px-5 py-2">
            <div className="flex flex-row items-center mt-2">
                <Image src={images.logo} alt="Logo" width={60} height={60} />
                <h1 className="text-3xl font-bold text-white ml-2">
                    UrbanPulse
                </h1>
            </div>
            <div className="mr-8">
                <a
                    href="/login"
                    className="text-white font-bold hover:text-primary-500"
                >
                    Login
                </a>
            </div>
        </div>
    )
}

export default NavBar

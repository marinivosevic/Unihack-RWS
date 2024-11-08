import Image from 'next/image'
import React from 'react'

import * as images from '@/app/constants/images'

function Page() {
    return (
        <div className="w-full min-h-screen flex flex-row">
            <Image
                src={images.onboarding}
                alt="onboard"
                className="absolute bottom-0 mt-5"
            />
        </div>
    )
}

export default Page

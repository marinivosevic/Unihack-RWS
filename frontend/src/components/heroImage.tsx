// components/HeroImage.tsx

import React from 'react'
import Image from 'next/image'

interface HeroImageProps {
    imageSrc: string
    title: string
    content: string
}

const HeroImage: React.FC<HeroImageProps> = ({ imageSrc, title, content }) => {
    console.log(imageSrc)
    return (
        <div className=" rounded-xl flex flex-row  p-5 mr-5">
            <Image
                src={`data:image/jpeg;base64,/${imageSrc.replace(/^dataimage\/jpegbase64\//, '')}`}
                alt="Hero"
                className="h-auto object-cover rounded-xl"
                width={800}
                height={400}
            />
            <div>
                <h1 className="text-center text-white text-3xl mt-4 ml-4 font-bold ">
                    {title}
                </h1>
                <p className=" text-white   mt-4 ml-4 text-lg">{content}</p>
                <div>
                    <p className="text-op text-lg mt-4 ml-4 text-quinterny-600 hover:text-quinterny-400">
                        {' '}
                        Show more...
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HeroImage

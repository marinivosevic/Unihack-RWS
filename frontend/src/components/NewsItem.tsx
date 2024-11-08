// components/NewsItem.tsx

import React from 'react'

interface NewsItemProps {
    id: number
    title: string
    description: string
    city: string
    pictures: string[] // Array of base64-encoded images
}

const NewsItem: React.FC<NewsItemProps> = ({
    id,
    title,
    description,
    city,
    pictures,
}) => {
    return (
        <div className="p-4 border rounded-md shadow-md bg-white">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-gray-600">{description}</p>
            <p className="text-gray-500 text-sm">City: {city}</p>
            <div className="flex space-x-2 mt-4 overflow-x-auto">
                {pictures.map((image, index) => {
                    // Sanitize each image source to ensure the correct prefix
                    const imageSrc = `data:image/jpeg;base64,/${image.replace(/^dataimage\/jpegbase64\//, '')}`
                    console.log(imageSrc)
                    return (
                        <img
                            key={index}
                            src={imageSrc}
                            alt={`News image ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-md"
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default NewsItem

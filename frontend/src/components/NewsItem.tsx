// components/NewsItem.tsx

import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from './ui/carousel'
import Link from 'next/link'

interface NewsItemProps {
    id: number
    title: string
    description: string
    city: string
    pictures: string[] // Array of base64-encoded images
}
const formatText = (text: string) => {
    const formattedText = text
        .replace(/&nbsp;/g, '\n')
        .split('\n')
        .join('<br />')
    return { __html: formattedText }
}
const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}
const NewsItem: React.FC<NewsItemProps> = ({
    id,
    title,
    description,
    city,
    pictures,
}) => {
    return (
        <Link href={`/dashboard/${id}`}>
            <div className="p-6 border rounded-lg shadow-lg bg-gray-50 w-full mx-auto">
                <Carousel className="w-full relative rounded-lg overflow-hidden">
                    <CarouselContent className="relative">
                        {pictures.map((image, index) => (
                            <CarouselItem key={index} className="w-full">
                                <img
                                    key={index}
                                    src={`data:image/jpeg;base64,/${image.replace(/^dataimage\/jpegbase64\//, '')}`}
                                    alt={`News image ${index + 1}`}
                                    className="w-full h-72 object-cover border border-gray-300 rounded-lg shadow-md"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Carousel Controls */}
                    <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors" />
                    <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors" />
                </Carousel>

                {/* Card Text Content */}
                <h2 className="text-3xl font-bold mt-6 text-gray-800">
                    {title}
                </h2>
                <p>{truncateText(description, 100)}</p>
                <p className="text-gray-500 text-sm mt-2">City: {city}</p>
            </div>
        </Link>
    )
}

export default NewsItem

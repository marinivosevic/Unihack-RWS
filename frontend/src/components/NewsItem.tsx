// components/NewsCard.tsx

import React from 'react'
import { FaTags } from 'react-icons/fa'
import { Badge } from '../components/ui/badge'
interface NewsCardProps {
    title: string
    description: string
    imageSrc: string
    tag: string
}

const NewsCard: React.FC<NewsCardProps> = ({
    title,
    description,
    imageSrc,
    tag,
}) => {
    const fallbackImage = '/default-news.jpg' // Ensure this image exists in your public folder

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = fallbackImage
    }

    return (
        <div className="bg-primary-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:cursor-pointer">
            <img
                src={`data:image/jpeg;base64,/${imageSrc.replace(/^dataimage\/jpegbase64\//, '')}`}
                alt={title}
                className="w-full h-32 object-cover"
                onError={handleError}
            />
            <div className="p-2">
                <div className="flex items-center mb-1">
                    <Badge>
                        <FaTags className="text-white mr-1" />
                        <span className="text-xs text-gray-300">{tag}</span>
                    </Badge>
                </div>
                <h2 className="text-lg font-semibold text-white mb-1">
                    {title}
                </h2>
                <p className="text-xs text-gray-300 line-clamp-2">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default NewsCard

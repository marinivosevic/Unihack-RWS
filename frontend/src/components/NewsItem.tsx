import React, { useState } from 'react'
import { FaTags } from 'react-icons/fa'
import { Badge } from '@/components/ui/badge'
import { Trash } from '@vectopus/atlas-icons-react'
import Cookies from 'js-cookie'
import DeletePostDialog from '../components/deleteDialog'

interface NewsCardProps {
    title: string
    description: string
    imageSrc: string
    tag: string
    id: string
}

const NewsCard: React.FC<NewsCardProps> = ({
                                               title,
                                               description,
                                               imageSrc,
                                               tag,
                                               id,
                                           }) => {
    const fallbackImage = '/default-news.jpg' // Ensure this image exists in your public folder
    const isAdmin = Cookies.get('isAdmin')
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = fallbackImage
    }

    const handleDelete = async (id: string) => {
        const token = Cookies.get('token')
        try {
            const response = await fetch(
                `https://m0nb0pkuyg.execute-api.eu-central-1.amazonaws.com/api-v1/news/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`)
            }

            // Update the state to remove the deleted item
            if (response.ok) {
                console.log('Deleted successfully')
                window.location.reload()
            }
        } catch (err) {
            console.error('Failed to delete the news item:', err)
        }
    }

    const confirmDelete = () => {
        handleDelete(id)
        setIsDialogOpen(false)
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
                <h2 className="text-lg font-semibold text-white mb-1">{title}</h2>
                <p className="text-xs text-gray-300 line-clamp-2">{description}</p>
            </div>

            {isAdmin === 'true' && (
                <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                        className="bg-white rounded-full p-3 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                            e.stopPropagation() // Stop event propagation
                            setIsDialogOpen(true)
                        }}
                    >
                        <Trash />
                    </button>
                    <DeletePostDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        onConfirm={confirmDelete}
                    />
                </div>
            )}
        </div>
    )
}

export default NewsCard

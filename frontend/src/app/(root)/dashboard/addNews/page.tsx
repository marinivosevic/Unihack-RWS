'use client'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
const Page = () => {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tag, setTag] = useState('Tag')
    const [pictures, setPictures] = useState<string[]>([])
    const [loading, isLoading] = useState(false)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const fileArray = Array.from(files)
            fileArray.forEach((file) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    if (reader.result && typeof reader.result === 'string') {
                        let base64String = reader.result as string
                        // Ensure the base64 string ends with '='
                        if (!base64String.endsWith('=')) {
                            base64String += '='
                        }
                        setPictures((prev) => [...prev, base64String])
                    }
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const city = Cookies.get('city')
        const token = Cookies.get('token')
        /* const pictures = [
            'data:image/png;base64,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',
        ] */
        try {
            isLoading(true)
            const data = { title, description, tag, pictures }
            console.log(data)
            const response = await fetch(
                `https://m0nb0pkuyg.execute-api.eu-central-1.amazonaws.com/api-v1/news/${city}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                }
            )
            console.log(response)
            if (response.ok) {
                console.log('News added successfully')
                router.push('/dashboard')
            }
        } catch (error) {
            console.log(error)
        } finally {
            isLoading(false)
        }
    }
    const isAdmin = Cookies.get('isAdmin')
    if (isAdmin === 'false') {
        router.push('/login')
    }

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold text-center text-white mb-8">
                Add News Article
            </h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
                <div className="space-y-2 h-auto">
                    <label className="block mb-2">Title</label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="p-2 rounded-md text-black bg-gray-300 border border-white shadow-sm shadow-white"
                    />
                </div>
                <div className="space-y-2 h-auto">
                    <label className="block mb-2 mt-5">Content</label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={12} // Sets the minimum number of rows
                        className="p-5 rounded-md bg-gray-300 border text-black border-white shadow-sm shadow-white resize-none" // Optional: `resize-none` disables resizing
                    />
                </div>
                <label className="block mb-2 mt-4">Tags</label>
                <div className="mb-4 mt-4 space-y-2 h-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{tag}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Select Tag</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={tag}
                                onValueChange={setTag}
                            >
                                <DropdownMenuRadioItem value="Construction">
                                    Construction
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Information">
                                    Information
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="News">
                                    News
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Electricity">
                                    Electricity
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Water">
                                    Water
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Maintenance">
                                    Maintenance
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Health">
                                    Health
                                </DropdownMenuRadioItem>

                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="mb-4 mt-4">
                    <label className="block mb-2">Upload Images</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                        {pictures.map((pic, index) => (
                            <img
                                key={index}
                                src={pic.replace(/=+$/, '')}
                                alt={`Upload Preview ${index}`}
                                className="w-32 h-32 object-cover"
                            />
                        ))}
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    {loading ? 'Submitting...' : 'Add News'}
                </Button>
            </form>
        </div>
    )
}

export default Page

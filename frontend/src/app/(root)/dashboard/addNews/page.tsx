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
    const [tags, setTags] = useState<string[]>([])
    const [pictures, setPictures] = useState<string[]>([])
    const [city, setCity] = useState('')

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const fileArray = Array.from(files)
            fileArray.forEach((file) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    if (reader.result && typeof reader.result === 'string') {
                        setPictures((prev) => [
                            ...prev,
                            reader.result as string,
                        ])
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
            router.push('/news')
        }
    }
    const isAdmin = Cookies.get('isAdmin')
    if (isAdmin === 'false') {
        router.push('/login')
    }

    return (
        <div className="text-white">
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
                <label className="block mb-2">Title</label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mb-4"
                />
                <label className="block mb-2">Content</label>
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mb-4"
                />
                <label className="block mb-2">Tags</label>
                <div className="mb-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{tag}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                                Panel Position
                            </DropdownMenuLabel>
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
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="mb-4">
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
                                src={pic}
                                alt={`Upload Preview ${index}`}
                                className="w-32 h-32 object-cover"
                            />
                        ))}
                    </div>
                </div>
                <label className="block mb-2">City</label>
                <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="mb-4"
                />
                <Button type="submit" className="w-full">
                    Add News
                </Button>
            </form>
        </div>
    )
}

export default Page

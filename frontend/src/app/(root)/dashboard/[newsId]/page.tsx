// page.tsx
'use client'
import React, { useEffect, useState } from 'react'

import Cookies from 'js-cookie'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

interface NewsItemProps {
    id: number
    title: string
    description: string
    pictures: string[]
    city: string
    publishedAt: string
}

interface ParamsItem {
    params: {
        newsId: string
    }
}

const NewsPost: React.FC<ParamsItem> = ({ params }) => {
    const [news, setNews] = useState<NewsItemProps | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (params.newsId) {
            const fetchNews = async () => {
                const API_URL = process.env.NEXT_PUBLIC_NEWS_API
                const token = Cookies.get('token')
                try {
                    const response = await fetch(
                        `${API_URL}/news/id/${params.newsId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                    const data = await response.json()
                    console.log(data.news.pictures[0])
                    setNews(data.news)
                } catch (error) {
                    console.error('Error fetching news:', error)
                } finally {
                    setLoading(false)
                }
            }
            fetchNews()
        }
    }, [params.newsId])

    if (loading)
        return <p className="text-center mt-10 text-gray-500">Loading...</p>
    if (!news)
        return <p className="text-center mt-10 text-red-500">News not found</p>
    function goBack() {
        window.history.back()
    }
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl text-gray-300">
            <Button
                variant="ghost"
                className="mb-4 flex items-center"
                onClick={() => goBack()}
            >
                <ChevronLeftIcon className="h-5 w-5 mr-2 text-gray-300" />
                Back to News
            </Button>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-gray-100">
                        {news.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                        {new Date(news.publishedAt).toLocaleDateString()} |{' '}
                        {news.city}
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        {news.pictures.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {news.pictures.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative w-full h-64"
                                    >
                                        <img
                                            key={index}
                                            src={`data:image/jpeg;base64,/${news.pictures[0].replace(/^dataimage\/jpegbase64\//, '')}`}
                                            alt={`News image ${index + 1}`}
                                            className=" w-[36rem]  object-cover border border-gray-300 rounded-lg shadow-md"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div
                        className="prose prose-lg text-gray-200"
                        dangerouslySetInnerHTML={{
                            __html: formatText(news.description),
                        }}
                    ></div>
                </CardContent>
            </Card>
        </div>
    )
}

// Helper function to format text with line breaks and spaces
const formatText = (text: string) => {
    const formattedText = text
        .replace(/&nbsp;/g, ' ')
        .split('\n')
        .join('<br />')
    return formattedText
}

export default NewsPost

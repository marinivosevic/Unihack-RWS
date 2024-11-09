// app/dashboard/page.tsx

'use client'

import React, { useEffect, useState } from 'react'
import WeatherWidget from '@/components/WeatherWidget'
import Cookies from 'js-cookie'
import NewsItem from '@/components/NewsItem'
import { Progress } from '@/components/ui/progress'
import Chatbot from '@/components/chatbot'
import HeroImage from '@/components/heroImage'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@/components/ui/dialog'
interface NewsItemProps {
    city: string
    description: string
    id: number
    title: string
    pictures: string[]
    tag: string
}

const DashboardHome: React.FC = () => {
    const city = Cookies.get('city')
    const [loading, setLoading] = useState(true)
    const [loaderValue, setLoaderValue] = useState(0)
    const [news, setNews] = useState<NewsItemProps[]>([])
    const [selectedNews, setSelectedNews] = useState<NewsItemProps | null>(null)

    const getAllNews = async () => {
        setLoading(true)
        setLoaderValue(20)
        const API_URL = process.env.NEXT_PUBLIC_NEWS_API
        const token = Cookies.get('token')

        try {
            const response = await fetch(`${API_URL}/news/${city}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            setLoaderValue(60)
            const data = await response.json()
            setNews(data.news)
            setLoaderValue(100)
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getAllNews()
    }, [])

    const openModal = (newsItem: NewsItemProps) => {
        setSelectedNews(newsItem)
    }

    return (
        <div>
            {/* Weather Widget at the Top */}
            <div className="mb-6 items-center ml-28">
                <WeatherWidget />
            </div>
            <div className="flex">
                <h1 className="text-5xl font-bold text-white mb-2">
                    Latest News
                </h1>
            </div>
            {/* Hero Image */}
            {news.length > 0 && news[0].pictures.length > 0 && (
                <HeroImage
                    imageSrc={news[0].pictures[0]}
                    title={news[0].title}
                    content={news[0].description}
                />
            )}
            <hr className="mt-5 w-full opacity-55" />
            <h1 className="text-3xl font-semibold text-start text-white mx-4 mt-4">
                News
            </h1>
            {loading && <Progress value={loaderValue} className="w-full" />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {news.map((item) => (
                    <Dialog key={item.id} onOpenChange={() => openModal(item)}>
                        <DialogTrigger asChild>
                            <span className="cursor-pointer hover:ring-2 hover:ring-purple-500 transition">
                                <NewsItem
                                    title={item.title}
                                    description={item.description}
                                    imageSrc={item.pictures[0]}
                                    tag={item.tag}
                                />
                            </span>
                        </DialogTrigger>
                        {selectedNews && (
                            <DialogContent className="w-full max-w-2xl p-4 bg-white rounded-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">
                                        {selectedNews.title}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {selectedNews.description}
                                    </DialogDescription>
                                </DialogHeader>
                                <Carousel className="w-full h-64 mt-4">
                                    <CarouselContent>
                                        {selectedNews.pictures.map(
                                            (pic, index) => (
                                                <CarouselItem key={index}>
                                                    <img
                                                        src={pic}
                                                        alt={`Image ${index}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </CarouselItem>
                                            )
                                        )}
                                    </CarouselContent>
                                    <CarouselPrevious>
                                        Previous
                                    </CarouselPrevious>
                                    <CarouselNext>Next</CarouselNext>
                                </Carousel>
                                <DialogClose asChild>
                                    <button className="mt-4 btn btn-primary">
                                        Close
                                    </button>
                                </DialogClose>
                            </DialogContent>
                        )}
                    </Dialog>
                ))}
            </div>
            <div>
                <Chatbot />
            </div>
        </div>
    )
}

export default DashboardHome

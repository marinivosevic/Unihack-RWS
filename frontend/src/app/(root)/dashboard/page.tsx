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
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface NewsItemProps {
    city: string
    description: string
    id: string
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
    const [isDialogOpen, setIsDialogOpen] = useState(false)

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
            console.log(data.news)
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
        setIsDialogOpen(true)
    }

    const closeModal = () => {
        setIsDialogOpen(false)
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
                    onShowMore={() => openModal(news[0])}
                />
            )}
            <hr className="mt-5 w-full opacity-55" />
            <h1 className="text-3xl font-semibold text-start text-white mx-4 mt-4">
                News
            </h1>
            {loading && <Progress value={loaderValue} className="w-full" />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {news.map((item) => (
                    <Dialog
                        key={item.id}
                        open={isDialogOpen}
                        onOpenChange={closeModal}
                    >
                        <DialogTrigger asChild>
                            <span className="cursor-pointer hover:ring-2 hover:ring-purple-500 transition">
                                <NewsItem
                                    title={item.title}
                                    description={item.description}
                                    imageSrc={item.pictures[0]}
                                    tag={item.tag}
                                    id={item.id}
                                />
                            </span>
                        </DialogTrigger>

                        {selectedNews && (
                            <DialogContent className="w-full max-w-3xl p-6 bg-white rounded-lg">
                                <DialogHeader>
                                    <Carousel className="w-full h-80 mt-4">
                                        <CarouselContent>
                                            {selectedNews.pictures.map(
                                                (pic, index) => (
                                                    <CarouselItem key={index}>
                                                        <Image
                                                            src={`data:image/jpeg;base64,/${pic.replace(/^dataimage\/jpegbase64\//, '').replace(/=+$/, '')}`}
                                                            alt={`Image ${index}`}
                                                            className="w-full h-64 object-contain"
                                                            width={800}
                                                            height={400}
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
                                    <DialogTitle className="text-2xl font-bold mt-4">
                                        {selectedNews.title}
                                    </DialogTitle>
                                    <DialogDescription className="mt-2 max-h-64 overflow-y-auto">
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: selectedNews.description.replace(
                                                    /\n/g,
                                                    '<br />'
                                                ),
                                            }}
                                        />
                                    </DialogDescription>
                                </DialogHeader>

                                <DialogClose asChild>
                                    <Button className="mt-4 btn btn-primary">
                                        Close
                                    </Button>
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

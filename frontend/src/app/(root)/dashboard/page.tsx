// app/dashboard/page.tsx

'use client'

import React, { useEffect } from 'react'
import WeatherWidget from '@/components/WeatherWidget'
import Cookies from 'js-cookie'
import NewsItem from '@/components/NewsItem'
import { Progress } from '@/components/ui/progress'
import Chatbot from '@/components/chatbot'
import HeroImage from '@/components/heroImage'
interface NewsItemProps {
    city: string
    description: string
    id: number
    title: string
    pictures: string[] // Array of base64-encoded images
    tag: string
}

const DashboardHome: React.FC = () => {
    const city = Cookies.get('city')
    const [loading, setLoading] = React.useState<boolean>(true)
    const [loaderValue, setLoaderValue] = React.useState<number>(0)
    const [news, setNews] = React.useState<NewsItemProps[]>([])

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
            console.log(data)
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

    return (
        <div>
            {/* Weather Widget at the Top */}
            <div className="mb-6 items-center ml-28">
                <WeatherWidget />
            </div>
            <div className=" flex ">
                <h1 className=" text-5xl font-bold text-white mb-2 ">
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
            <hr className=" mt-5 w-full opacity-55 " />
            <h1 className="text-3xl font-semibold text-start text-white mx-4 mt-4">
                News
            </h1>
            {loading && <Progress value={loaderValue} className="w-full" />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {news.map((item, index) => (
                    <NewsItem
                        key={index}
                        title={item.title}
                        description={item.description}
                        imageSrc={item.pictures[0]}
                        tag={item.tag} // Ensure each news item has a 'tag' field
                    />
                ))}
            </div>
        </div>
    )
}

export default DashboardHome

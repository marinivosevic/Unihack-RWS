// app/dashboard/page.tsx

'use client'

import React, { useEffect } from 'react'
import WeatherWidget from '@/components/WeatherWidget'
import Cookies from 'js-cookie'
import NewsItem from '@/components/NewsItem'
import { Progress } from '@/components/ui/progress'

interface NewsItemProps {
    city: string
    description: string
    id: number
    title: string
    pictures: string[] // Array of base64-encoded images
}

const DashboardHome: React.FC = () => {
    const city = 'Petrinja'
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
            setTimeout(() => {
                setLoading(false)
            }, 500)
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
            <div className="mb-6 items-center ml-8">
                <WeatherWidget />
            </div>
            <h1 className="text-3xl font-semibold text-start text-white mx-4 mt-4">
                News
            </h1>
            {loading && <Progress value={loaderValue} className="w-full" />}
            <div className="grid grid-cols-1 gap-4 p-4">
                {news.map((item) => (
                    <NewsItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        city={item.city}
                        pictures={item.pictures} // Pass base64-encoded images
                    />
                ))}
            </div>
        </div>
    )
}

export default DashboardHome

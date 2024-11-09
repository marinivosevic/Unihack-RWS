// components/WeatherWidget.tsx

'use client'

import React, { useEffect, useState, useCallback } from 'react'
import DailyForecastItem from '@/components/DailyForecastItem'
import { fetchCoordinates, WeatherData } from '@/utils/weatherUtils'
import Cookies from 'js-cookie'

const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const API_KEY = process.env.NEXT_PUBLIC_OPEN_WEATHER_KEY
    const CITY = Cookies.get('city') || 'Rijeka'
    const UNITS = 'metric'
    const COUNT = 40

    const fetchWeather = useCallback(async () => {
        try {
            if (!API_KEY) {
                throw new Error('API key is missing')
            }

            const coords = await fetchCoordinates(CITY, API_KEY)
            if (!coords) {
                throw new Error('Failed to retrieve coordinates')
            }

            const { lat, lon } = coords

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}&cnt=${COUNT}`
            )

            if (!response.ok) {
                throw new Error('Failed to fetch weather data')
            }

            const data = await response.json()
            const timezoneOffset = data.city.timezone

            const filteredWeather: WeatherData[] = filterDailyForecasts(
                data.list,
                data.city.name,
                timezoneOffset
            )

            setWeather(filteredWeather)
        } catch (err: any) {
            setError(err.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }, [API_KEY])

    useEffect(() => {
        fetchWeather()
    }, [fetchWeather])

    const filterDailyForecasts = (
        list: any[],
        cityName: string,
        timezoneOffset: number
    ): WeatherData[] => {
        const dailyMap: { [date: string]: WeatherData } = {}

        list.forEach((entry) => {
            const date = new Date((entry.dt + timezoneOffset) * 1000)
            const dateKey = date.toISOString().split('T')[0]
            const targetHour = 12
            const entryHour = date.getHours()
            const diff = Math.abs(entryHour - targetHour)

            if (
                !dailyMap[dateKey] ||
                diff < Math.abs(dailyMap[dateKey].hour! - targetHour)
            ) {
                dailyMap[dateKey] = {
                    temperature: entry.main.temp,
                    description: entry.weather[0].description,
                    icon: entry.weather[0].icon,
                    city: cityName,
                    id: entry.weather[0].id,
                    dateTime: date.toLocaleString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    hour: entryHour,
                }
            }
        })

        return Object.values(dailyMap)
            .map(({ hour, ...rest }) => rest)
            .slice(0, 5)
    }

    if (loading) {
        return (
            <div className="flex items-center space-x-2 text-white">
                <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                </svg>
                <span>Loading weather...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center space-y-2 text-red-500">
                <span>Error: {error}</span>
                <button
                    onClick={() => {
                        setLoading(true)
                        setError(null)
                        fetchWeather()
                    }}
                    className="px-4 py-2 bg-red-700 text-white rounded"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="flex space-x-8 overflow-x-auto p-4 snap-x snap-mandatory">
            {weather.map((day, index) => (
                <DailyForecastItem
                    key={index}
                    day={day}
                    style={{
                        animation: `fadeInSlideUp 0.5s ease forwards`,
                        animationDelay: `${index * 0.2}s`,
                        animationFillMode: 'forwards', // Ensure final state is retained
                        animationTimingFunction: 'ease',
                        animationIterationCount: 1,
                    }}
                />
            ))}
        </div>
    )
}

export default WeatherWidget

// utils/weatherUtils.tsx

import React from 'react'
import {
    WiDaySunny,
    WiCloudy,
    WiRain,
    WiThunderstorm,
    WiSnow,
    WiFog,
    WiDayCloudy,
    WiNightClear,
    WiNightCloudy,
    WiNightRain,
    WiNightThunderstorm,
    WiNightSnow,
    WiNightFog,
} from 'react-icons/wi'

export interface WeatherData {
    temperature: number
    description: string
    icon: string
    city: string
    id: number
    dateTime: string
    hour?: number
}

export const getWeatherIcon = (
    id: number,
    isDay: boolean,
    size: number = 50
) => {
    let color = 'text-white' // Default color

    if (id >= 200 && id <= 232) {
        color = 'text-yellow-300'
        return <WiThunderstorm size={size} className={color} />
    } else if (id >= 300 && id <= 321) {
        color = 'text-blue-400'
        return <WiRain size={size} className={color} />
    } else if (id >= 500 && id <= 531) {
        color = 'text-blue-400'
        return <WiRain size={size} className={color} />
    } else if (id >= 600 && id <= 622) {
        color = 'text-blue-200'
        return <WiSnow size={size} className={color} />
    } else if (id >= 700 && id <= 781) {
        color = 'text-gray-400'
        return <WiFog size={size} className={color} />
    } else if (id === 800) {
        color = isDay ? 'text-yellow-300' : 'text-gray-300'
        return isDay ? (
            <WiDaySunny size={size} className={color} />
        ) : (
            <WiNightClear size={size} className={color} />
        )
    } else if (id >= 801 && id <= 804) {
        color = isDay ? 'text-gray-300' : 'text-gray-300'
        return isDay ? (
            <WiDayCloudy size={size} className={color} />
        ) : (
            <WiNightCloudy size={size} className={color} />
        )
    } else {
        // Default icon
        return <WiDaySunny size={size} className={color} />
    }
}

// Function to fetch coordinates for a given city
export const fetchCoordinates = async (
    city: string,
    apiKey: string
): Promise<{ lat: number; lon: number } | null> => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
                city
            )}&limit=1&appid=${apiKey}`
        )

        if (!response.ok) {
            throw new Error('Failed to fetch coordinates')
        }

        const data = await response.json()

        if (data.length === 0) {
            throw new Error('No coordinates found for the specified city')
        }

        return { lat: data[0].lat, lon: data[0].lon }
    } catch (error) {
        console.error(error)
        return null
    }
}

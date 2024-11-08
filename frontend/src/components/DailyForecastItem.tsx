// components/DailyForecastItem.tsx

'use client'

import React from 'react'
import { WeatherData } from '@/utils/weatherUtils'
import { getWeatherIcon } from '@/utils/weatherUtils'

interface DailyForecastItemProps {
    day: WeatherData
}

const DailyForecastItem: React.FC<DailyForecastItemProps> = ({ day }) => {
    const isDay = day.icon.endsWith('d')

    return (
        <div className="flex flex-col items-center space-y-2 bg-primary-300/20 border-[0.5px] border-white backdrop-blur-lg rounded-lg p-4 w-40 snap-start">
            {/* Date */}
            <h3 className="text-lg font-semibold text-white">{day.dateTime}</h3>

            {/* Weather Icon */}
            <div className="text-white">
                {getWeatherIcon(day.id, isDay, 50)}
            </div>

            {/* Temperature */}
            <p className="text-xl font-bold text-white">
                {Math.round(day.temperature)}°C
            </p>

            {/* Description */}
            <p className="text-sm capitalize text-white">{day.description}</p>
        </div>
    )
}

export default DailyForecastItem

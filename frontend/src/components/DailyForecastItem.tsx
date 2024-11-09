// components/DailyForecastItem.tsx

'use client'

import React from 'react'
import { WeatherData } from '@/utils/weatherUtils'
import { getWeatherIcon } from '@/utils/weatherUtils'

interface DailyForecastItemProps {
    day: WeatherData
    style?: React.CSSProperties
}

const DailyForecastItem: React.FC<DailyForecastItemProps> = ({
    day,
    style,
}) => {
    const isDay = day.icon.endsWith('d')

    return (
        <div
            className="flex flex-col items-center space-y-2 bg-primary-300/20 border-[0.5px] border-white backdrop-blur-lg rounded-lg p-4 w-40 snap-start opacity-0 translate-y-4" // Initial state: hidden and shifted
            style={style}
        >
            <h3 className="text-lg font-semibold text-white">{day.dateTime}</h3>
            <div className="text-white">
                {getWeatherIcon(day.id, isDay, 50)}
            </div>
            <p className="text-xl font-bold text-white">
                {Math.round(day.temperature)}°C
            </p>
            <p className="text-sm capitalize text-white">{day.description}</p>
        </div>
    )
}

export default DailyForecastItem

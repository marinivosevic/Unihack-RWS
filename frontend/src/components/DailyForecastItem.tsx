// components/DailyForecastItem.tsx

'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { WeatherData, getWeatherIcon } from '@/utils/weatherUtils'

interface DailyForecastItemProps {
    day: WeatherData
    style?: React.CSSProperties
}

const DailyForecastItem: React.FC<DailyForecastItemProps> = ({
    day,
    style,
}) => {
    const isDay = day.icon.endsWith('d')
    const icon = getWeatherIcon(day.id, isDay, 50)
    return (
        <div
            className="flex flex-col items-center space-y-2 bg-primary-300/20 border-[0.5px] backdrop-blur-lg rounded-lg p-4 w-40 snap-start opacity-0 translate-y-4"
            style={style}
        >
            <h3 className="text-lg font-semibold text-white">{day.dateTime}</h3>
            <div className="text-white">
                <img
                    src={typeof icon === 'string' ? icon : ''}
                    alt={day.description}
                    width={50}
                    height={50}
                />
            </div>
            <p className="text-xl font-bold text-white">
                {Math.round(day.temperature)}°C
            </p>
            <p className="text-sm capitalize text-white">{day.description}</p>
        </div>
    )
}

export default DailyForecastItem

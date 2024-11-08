// app/dashboard/page.tsx

'use client'

import React from 'react'
import WeatherWidget from '@/components/WeatherWidget'

const DashboardHome: React.FC = () => {
    return (
        <div>
            {/* Weather Widget at the Top */}
            <div className="mb-6 items-center ml-8">
                <WeatherWidget />
            </div>
            <h1 className="text-2xl font-semibold mb-4 text-white">
                Welcome to Your Dashboard
            </h1>
            <p className="text-gray-300">
                Navigate using the sidebar to access different sections of your
                dashboard.
            </p>
        </div>
    )
}

export default DashboardHome

// app/dashboard/page.tsx

'use client'

import React from 'react'

const DashboardHome: React.FC = () => {
    return (
        <div>
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

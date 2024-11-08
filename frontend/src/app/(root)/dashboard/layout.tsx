// app/dashboard/layout.tsx

'use client'

import React from 'react'
import Sidebar from '@/components/SideBar'

interface DashboardLayoutProps {
    children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-primary-950">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Main Content Area */}
                <main className="flex-1 p-6">
                    {/* Page Content */}
                    {children}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout

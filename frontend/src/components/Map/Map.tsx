// File: src/components/Map/Map.tsx

'use client'
import React, { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useRouter } from 'next/navigation' // Import useRouter
import balkan from '../../app/utils/custom.geo.json'

const Map = () => {
    const router = useRouter() // Initialize router
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

    return (
        <div
            className="bg-primary-700"
            style={{ display: 'flex', justifyContent: 'center' }}
        >
            <ComposableMap
                projection="geoMercator"
                width={800}
                height={600}
                projectionConfig={{
                    scale: 1650,
                    center: [21.0, 41.5],
                }}
                fill="#284a80"
                stroke="black"
                stroke-width={0.25}
            >
                <Geographies geography={balkan}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const countryName = geo.properties.name
                            const isSelected = selectedCountry === countryName

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onClick={() => {
                                        setSelectedCountry(countryName)
                                        console.log(countryName)
                                        router.push(`/country/${countryName}`)
                                    }}
                                    style={{
                                        default: {
                                            fill: isSelected
                                                ? '#6fb6eb'
                                                : '#deeefb',
                                            outline: 'none',
                                        },
                                        hover: {
                                            fill: '#e34400', //? todO : color
                                            outline: 'none',
                                        },
                                        pressed: {
                                            fill: '#E42',
                                            outline: 'none',
                                        },
                                    }}
                                />
                            )
                        })
                    }
                </Geographies>
            </ComposableMap>
        </div>
    )
}

export default Map

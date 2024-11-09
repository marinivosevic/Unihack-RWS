// File: src/components/Map/Map.tsx

'use client'
import React, { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useRouter } from 'next/navigation'
import balkan from '../../app/utils/custom.geo.json'

const Map = () => {
    const router = useRouter()
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
    const [tooltip, setTooltip] = useState<{ visible: boolean; name: string }>({
        visible: false,
        name: '',
    })

    return (
        <div
            className="bg-primary-950 relative"
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <h1 className="text-4xl text-white flex justify-center items-center mb-4">
                Choose your country
            </h1>
            {tooltip.visible && (
                <div
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '5px 10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#fff',
                        borderRadius: '4px',
                        pointerEvents: 'none',
                        fontSize: '14px',
                    }}
                >
                    {tooltip.name}
                </div>
            )}

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
                strokeWidth={0.45}
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
                                    onMouseEnter={() =>
                                        setTooltip({
                                            visible: true,
                                            name: countryName,
                                        })
                                    }
                                    onMouseLeave={() =>
                                        setTooltip({ visible: false, name: '' })
                                    }
                                    style={{
                                        default: {
                                            fill: isSelected
                                                ? '#a6a7fb'
                                                : '#deeefb',
                                            outline: 'none',
                                            transition: 'transform 0.3s ease',
                                        },
                                        hover: {
                                            fill: '#8077f6',
                                            outline: 'none',
                                            transform:
                                                'scale(1.01) translateY(-5px)',
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

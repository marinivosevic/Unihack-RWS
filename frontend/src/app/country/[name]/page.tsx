'use client'
import React, { useEffect, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import croatiaGeo from '../../../app/utils/Croatia.geo.json'
import serbiaGeo from '../../../app/utils/Serbia.geo.json'
import romaniaGeo from '../../../app/utils/Romania.geo.json'
interface CountryMapProps {
    params: {
        name: string
    }
}

const CountryMap: React.FC<CountryMapProps> = ({ params }) => {
    useEffect(() => {
        console.log(params.name)
    }, [params.name])

    const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

    const geographies =
        params.name.toLowerCase() === 'croatia' ? croatiaGeo : serbiaGeo

    return (
        <div className="bg-primary-800" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ComposableMap
                    projection="geoMercator"
                    width={800}
                    height={600}
                    projectionConfig={{
                        scale: 3200,
                        center:
                            params.name.toLowerCase() === 'croatia'
                                ? [16.5, 43]
                                : [21.0, 41.5],
                    }}
                    stroke="black"
                    stroke-width={0.25}
                >
                    <Geographies geography={geographies}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const countryName = geo.properties.name
                                const isSelected =
                                    selectedCountry === countryName

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onClick={() => {
                                            setSelectedCountry(countryName)
                                            console.log(countryName)
                                            // Add your routing logic here
                                        }}
                                        onMouseEnter={() => {
                                            setHoveredCountry(countryName)
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredCountry(null)
                                        }}
                                        style={{
                                            default: {
                                                fill: isSelected
                                                    ? '#6fb6eb'
                                                    : '#deeefb',
                                                outline: 'none',
                                            },
                                            hover: {
                                                fill: '#e34400',
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
            {hoveredCountry && (
                <div
                    style={{
                        position: 'absolute',
                        top: 10,
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
                    {hoveredCountry}
                </div>
            )}
        </div>
    )
}

export default CountryMap

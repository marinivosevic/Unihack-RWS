'use client'
import React, { useEffect, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import croatiaGeo from '../../../app/utils/Croatia.geo.json'
import serbiaGeo from '../../../app/utils/Serbia.geo.json'
import romaniaGeo from '../../../app/utils/Romania.geo.json'
import Cookies from 'js-cookie'

interface CountryMapProps {
    params: {
        name: string
    }
}

interface SupportedCities {
    [region: string]: string[]
}

const supportedCities: SupportedCities = {
    'Primorsko-goranska': ['Rijeka'],
    Zagreb: ['Zagreb'],
    Timis: ['Timisoara'],
    // Add more regions and their supported cities here
}

const CountryMap: React.FC<CountryMapProps> = ({ params }) => {
    useEffect(() => {
        console.log(params.name)
    }, [params.name])

    const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
    let geographies
    const countryName = params.name
    if (countryName === 'Croatia') {
        geographies = croatiaGeo
    } else if (countryName === 'Serbia') {
        geographies = serbiaGeo
    } else if (countryName === 'Romania') {
        geographies = romaniaGeo
    }

    const cities = selectedCountry ? supportedCities[selectedCountry] || [] : []

    const handleCLick = (city: string) => {
        Cookies.set('city', city)
        window.location.href = '/dashboard'
    }

    return (
        <div
            className="bg-primary-800"
            style={{ position: 'relative', display: 'flex' }}
        >
            <div
                className="bg-primary-800 relative"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'end',
                    alignItems: 'end',
                    flex: 1,
                }}
            >
                <h1 className="text-4xl text-white flex justify-end items-end mb-4 mr-12">
                    Choose your Region
                </h1>
                <ComposableMap
                    projection="geoMercator"
                    width={800}
                    height={600}
                    projectionConfig={{
                        scale:
                            params.name.toLowerCase() === 'romania'
                                ? 2500
                                : 3200,
                        center:
                            params.name.toLowerCase() === 'croatia'
                                ? [18.5, 43]
                                : params.name.toLowerCase() === 'serbia'
                                  ? [25.0, 43.0]
                                  : [27.5, 44.0],
                    }}
                    stroke="black"
                    strokeWidth={0.25}
                >
                    <Geographies geography={geographies}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const regionName = geo.properties.name
                                const isSelected =
                                    selectedCountry === regionName

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onClick={() => {
                                            setSelectedCountry(regionName)
                                            console.log(regionName)
                                        }}
                                        onMouseEnter={() => {
                                            setHoveredCountry(regionName)
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
            {selectedCountry && (
                <div
                    style={{
                        width: '200px',
                        padding: '20px',
                        backgroundColor: '#f0f0f0',
                        height: '600px',
                        overflowY: 'auto',
                    }}
                >
                    <h2 className="text-2xl mb-4">Supported Cities</h2>
                    <ul>
                        {cities.map((city) => (
                            <li key={city} className="mb-2">
                                <button onClick={() => handleCLick(city)}>
                                    {city}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
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

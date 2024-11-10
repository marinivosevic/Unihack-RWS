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
    } else {
        return (
            <div className="bg-primary-950">
                <div className=" text-white flex items-center justify-center">
                    Country not currently supported
                </div>
            </div>
        )
    }

    const cities = selectedCountry ? supportedCities[selectedCountry] || [] : []

    const handleClick = (city: string) => {
        Cookies.set('city', city)
        window.location.href = '/dashboard'
    }

    return (
        <div className="bg-primary-800">
            <div
                className="bg-primary-950 "
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <div className=" flex flex-col">
                    <div>
                        <h1 className="text-5xl text-white flex justify-start items-end mb-4 mt-16 ml-12 mr-12">
                            Choose your Region
                        </h1>
                    </div>
                    <div>
                        {selectedCountry && (
                            <div
                                style={{
                                    width: '250px',
                                    marginLeft: '20px',
                                    padding: '20px',
                                    height: '600px',
                                    overflowY: 'auto',
                                }}
                            >
                                <h2 className="text-3xl mb-4 ml-2 text-white">
                                    Supported Cities
                                </h2>
                                <ol>
                                    {cities.map((city) => (
                                        <li
                                            key={city}
                                            className="mb-3 ml-2 text-xl text-quinterny-500"
                                        >
                                            <button
                                                onClick={() =>
                                                    handleClick(city)
                                                }
                                            >
                                                {city}
                                            </button>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                </div>
                <ComposableMap
                    projection="geoMercator"
                    width={800}
                    height={600}
                    projectionConfig={{
                        scale:
                            params.name.toLowerCase() === 'romania'
                                ? 2500
                                : 3500,
                        center:
                            params.name.toLowerCase() === 'croatia'
                                ? [18.5, 44]
                                : params.name.toLowerCase() === 'serbia'
                                  ? [25.0, 43.0]
                                  : [27.5, 44.0],
                    }}
                    stroke="black"
                    strokeWidth={0.45}
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
                                                    ? '#a6a7fb'
                                                    : '#deeefb',
                                                outline: 'none',
                                                transition:
                                                    'transform 0.3s ease',
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

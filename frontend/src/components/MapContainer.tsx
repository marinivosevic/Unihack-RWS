// Install dependencies
// Run in your terminal:
// npm install react-simple-maps d3
'use client'
import React, { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const geoUrl =
    'https://raw.githubusercontent.com/deldersveld/topojson/master/continents/europe_balkan.json'

const BalkanMap = () => {
    const [selectedCountry, setSelectedCountry] = useState(null)

    return (
        <ComposableMap>
            <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: any[] }) =>
                    geographies.map((geo) => {
                        const isSelected =
                            selectedCountry === geo.properties.NAME
                        return (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                onClick={() =>
                                    setSelectedCountry(geo.properties.NAME)
                                }
                                style={{
                                    default: {
                                        fill: isSelected ? '#F53' : '#D6D6DA',
                                        outline: 'none',
                                    },
                                    hover: {
                                        fill: '#999',
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
    )
}

export default BalkanMap

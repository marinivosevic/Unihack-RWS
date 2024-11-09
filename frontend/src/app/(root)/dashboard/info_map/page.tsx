'use client'
import React, { useState } from 'react'
import { Map, Marker } from 'pigeon-maps'
import {
    BusFront,
    Trash,
    ElectricBatteryCharge,
} from '@vectopus/atlas-icons-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import Cookies from 'js-cookie'

export default function MyMap() {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const cityCoordinates: Record<string, [number, number]> = {
        Rijeka: [45.3271, 14.4422],
        Zagreb: [45.815, 15.9819],
        Timisoara: [45.7489, 21.2087],
    }
    type CityName = keyof typeof cityCoordinates
    const city = (Cookies.get('city') || 'Rijeka') as CityName

    const handleSelectChange = (value: string) => {
        setSelectedType(value)
    }

    return (
        <>
            <div className="z-50 absolute top-24 right-12 bg-white h-auto w-auto rounded-lg shadow-sm shadow-zinc-400 flex items-center justify-center">
                <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select info type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/50">
                        <SelectGroup>
                            <SelectLabel>Types</SelectLabel>
                            <SelectItem value="bus">Busses</SelectItem>
                            <SelectItem value="trash">Trash Cans</SelectItem>
                            <SelectItem value="charger">
                                SuperChargers
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Map
                height={950}
                defaultCenter={cityCoordinates[city]}
                defaultZoom={11}
            >
                {selectedType === 'bus' && (
                    <Marker width={25} anchor={cityCoordinates[city]}>
                        <div className="pin-icon">
                            <div className="icon-container">
                                <BusFront color="#2c56a1" weight="bold" />
                            </div>
                        </div>
                    </Marker>
                )}
                {selectedType === 'trash' && (
                    <Marker width={25} anchor={cityCoordinates[city]}>
                        <div className="pin-icon">
                            <div className="icon-container">
                                <Trash color="#04900b" weight="bold" />
                            </div>
                        </div>
                    </Marker>
                )}
                {selectedType === 'charger' && (
                    <Marker width={25} anchor={cityCoordinates[city]}>
                        <div className="pin-icon">
                            <div className="icon-container">
                                <ElectricBatteryCharge
                                    color="#e7c700"
                                    size={24}
                                    weight="bold"
                                />
                            </div>
                        </div>
                    </Marker>
                )}
            </Map>
        </>
    )
}

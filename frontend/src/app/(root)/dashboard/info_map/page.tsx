'use client'
import React, { useState } from 'react'
import { Map, Marker } from 'pigeon-maps'
import { BusFront, Trash } from '@vectopus/atlas-icons-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export default function MyMap() {
    const [selectedType, setSelectedType] = useState<string | null>(null)

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
            <Map height={950} defaultCenter={[50.879, 4.6997]} defaultZoom={11}>
                {selectedType === 'bus' && (
                    <Marker width={25} anchor={[50.879, 4.6997]}>
                        <BusFront color="#2c56a1" weight="bold" />
                    </Marker>
                )}
                {selectedType === 'trash' && (
                    <Marker width={25} anchor={[50.872, 4.6997]}>
                        <Trash color="#04900b" weight="bold" />
                    </Marker>
                )}
            </Map>
        </>
    )
}

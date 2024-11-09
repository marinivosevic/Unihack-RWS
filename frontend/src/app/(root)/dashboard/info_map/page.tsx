'use client'
import React from 'react'
import { Map, Marker, Overlay } from 'pigeon-maps'
import { BusFront } from '@vectopus/atlas-icons-react'

export default function MyMap() {
    return (
        <Map height={300} defaultCenter={[50.879, 4.6997]} defaultZoom={11}>
            <Marker width={25} anchor={[50.879, 4.6997]}>
                <BusFront color="#2c56a1" weight="bold" />
            </Marker>
        </Map>
    )
}

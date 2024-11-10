'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { Map, Marker, Overlay } from 'pigeon-maps'
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
import ContainersJson from '@/constants/container.json'
import apiClient from '../../../utils/apiClient' // Adjust the path as needed
import { RacStatusPublic } from '../../../utils/apiClient' // Import the interface if needed

// Define the interface for trash can records
interface TrashCan {
    _id: number
    'GRAD-OPINA': string
    NASELJE: string
    'M_O ODBOR': string
    'NAZIV ULICE': string
    KBR: string
    KBR_DOD: string
    VRSTA_POSUDE: string
    'INV.BR.': number
    VOLUMEN: number
    LOKACIJA: string
    POSTOLJE: string
    'VRSTA OTPADA': string
    'TIP POSUDE': string
    'KORISNIK POSUDE': string
    X: string
    Y: string
}

// Define the structure for Containers data
interface ContainersData {
    result: {
        records: TrashCan[]
    }
}

// Assert the type of the imported JSON data
const Containers = ContainersJson as ContainersData

// Define the interface for Parking data
interface Parking {
    parking_name: string
    slobodno: number
    kapacitet: number
    lokacija?: {
        // Made optional
        lat: number
        lng: number
    }
    highest_cijena: number
    vrijeme_naplate: ParkingPaymentTime[]
    live_status: boolean
}

interface ParkingAPIResponse {
    parking_name: string
    category: string
    link: string
    parking_data: {
        parking_id: number
        kapacitet: number
        live_status: boolean
        status_sustava: string
        slobodno: number
        arhiva_dokumenata: boolean
        last_update_date: string
        last_update_time: string
        lokacija?: {
            // Made optional
            lat: number
            lng: number
        }
        vrijeme_naplate: {
            dani_i_sati: string
            vrijeme_start: string
            vrijeme_kraj: string
        }[]
        cijena: {
            termin: string
            cijena: number
        }[]
        placanje: {
            nacin_placanja: string
        }[]
        ogranicenje_vremena: string
        napomene: string
        info_contact: {
            telefon: string
            info_napomene: string
        }[]
    }
}

interface ParkingPaymentTime {
    dani_i_sati: string
    vrijeme_start: string
    vrijeme_kraj: string
}
interface Charger {
    name: string
    latitude: number
    longitude: number

}

// Helper function to calculate distance between two lat/lng points in meters
const getDistanceFromLatLonInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371e3 // Earth's radius in meters
    const toRadians = (deg: number) => (deg * Math.PI) / 180

    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance
}

export default function MyMap() {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [buses, setBuses] = useState<RacStatusPublic[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [infoModal, setInfoModal] = useState<boolean>(false)

    const [parkingData, setParkingData] = useState<Parking[]>([])
    const [parkingLoading, setParkingLoading] = useState<boolean>(false)
    const [parkingError, setParkingError] = useState<string | null>(null)

    const [selectedParking, setSelectedParking] = useState<Parking | null>(null)
    const [chargers, setChargers] = useState<Charger[]>([])
    const [chargersLoading, setChargersLoading] = useState<boolean>(false)
    const [chargersError, setChargersError] = useState<string | null>(null)
    const cityCoordinates: Record<string, [number, number]> = {
        Rijeka: [45.3271, 14.4422],
        Zagreb: [45.815, 15.9819],
        Timisoara: [45.7489, 21.2087],
    }
    type CityName = keyof typeof cityCoordinates
    const city = (Cookies.get('city') || 'Rijeka') as CityName
    const initialMapCenter = cityCoordinates[city]

    // New state to track the current center and zoom of the map
    const [mapCenter, setMapCenter] =
        useState<[number, number]>(initialMapCenter)
    const [zoom, setZoom] = useState<number>(15) // Initialize zoom state

    const handleSelectChange = (value: string) => {
        setSelectedType(value)
        setSelectedParking(null) // Close any open popups when changing selection
    }

    // Fetch buses
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null

        const fetchBuses = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await apiClient.getAutobusi()
                console.log(response)
                if (!response.err && response.res) {
                    setBuses(response.res)
                    console.log(response.res)
                } else {
                    setError(response.msg || 'Failed to fetch buses.')
                }
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred.')
            } finally {
                setLoading(false)
            }
        }

        if (selectedType === 'bus') {
            // Fetch immediately
            fetchBuses()
            // Set up polling every 10 seconds
            intervalId = setInterval(fetchBuses, 10000)
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [selectedType])

    const fetchChargers = async () => {
        setChargersLoading(true)
        setChargersError(null)
        const city = Cookies.get('city') || 'Rijeka'
        try {
            const response = await fetch(
                `https://67l89bzn2b.execute-api.eu-central-1.amazonaws.com/api-v1/superchargers/${city}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            ) // Adjust API endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch chargers.')
            }
            const data = await response.json()

            setChargers(data.chargers)
        } catch (err: any) {
            setChargersError(err.message || 'An unexpected error occurred.')
        } finally {
            setChargersLoading(false)
        }
    }
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null

        if (selectedType === 'charger') {
            fetchChargers()
            intervalId = setInterval(fetchChargers, 600000) // Poll every 60 seconds
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [selectedType])

    // Fetch parking data
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null

        const fetchParking = async () => {
            setParkingLoading(true)
            setParkingError(null)
            try {
                const response = await fetch(
                    'https://67l89bzn2b.execute-api.eu-central-1.amazonaws.com/api-v1/parking-data',
                    {
                        method: 'GET',
                    }
                )
                if (!response.ok) {
                    throw new Error('Failed to fetch parking data.')
                }
                const data: ParkingAPIResponse[] = await response.json()
                console.log(data)
                // Process and map the data to Parking interface
                const processedData: Parking[] = data
                    .filter((item) => item.parking_data.lokacija) // Filter out entries without lokacija
                    .map((item) => {
                        const highestCijena =
                            item.parking_data.cijena.length > 0
                                ? Math.max(
                                    ...item.parking_data.cijena.map(
                                        (c) => c.cijena
                                    )
                                )
                                : 0 // Default value or handle as needed
                        return {
                            parking_name: item.parking_name,
                            slobodno: item.parking_data.slobodno,
                            kapacitet: item.parking_data.kapacitet,
                            lokacija: item.parking_data.lokacija, // Safe to assign now
                            highest_cijena: highestCijena,
                            vrijeme_naplate: item.parking_data.vrijeme_naplate,
                            live_status:
                                item.parking_data.status_sustava === 'OK'
                                    ? true
                                    : false,
                        }
                    })

                setParkingData(processedData)
            } catch (err: any) {
                setParkingError(err.message || 'An unexpected error occurred.')
            } finally {
                setParkingLoading(false)
            }
        }

        if (selectedType === 'parking') {
            // Fetch immediately
            fetchParking()
            // Set up polling every 30 seconds
            intervalId = setInterval(fetchParking, 30000)
        }

        // Cleanup function to clear the interval
        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [selectedType])

    // Helper function to determine marker color based on availability
    const getParkingMarkerColor = (
        slobodno: number,
        kapacitet: number,
        live_status: boolean
    ): string => {
        if (!live_status) {
            return 'gray'
        }
        const availability = slobodno / kapacitet
        if (availability > 0.7) {
            return 'green'
        } else if (availability > 0.3) {
            return 'orange'
        } else {
            return 'red'
        }
    }

    // Helper function to format working hours
    const formatWorkingHours = (
        vrijeme_naplate: ParkingPaymentTime[]
    ): string => {
        return vrijeme_naplate
            .map((time) => {
                const { dani_i_sati, vrijeme_start, vrijeme_kraj } = time
                let days = ''
                let workingHours = ''

                if (dani_i_sati.includes('Radnim danom')) {
                    days += 'Mon-Fri '
                }
                if (dani_i_sati.includes('Subotom')) {
                    days += 'Sat '
                }
                if (dani_i_sati.includes('nedjeljom')) {
                    days += 'Sun '
                }

                workingHours = `${vrijeme_start} - ${vrijeme_kraj}`

                return `${days.trim()}: ${workingHours}`
            })
            .join('; ')
    }

    // Memoize the filtered trash containers to optimize performance
    const filteredTrashContainers = useMemo(() => {
        const [centerLat, centerLng] = mapCenter
        return Containers.result.records.filter((container) => {
            const latitude = parseFloat(container.Y.replace(',', '.'))
            const longitude = parseFloat(container.X.replace(',', '.'))
            const distance = getDistanceFromLatLonInMeters(
                centerLat,
                centerLng,
                latitude,
                longitude
            )
            return distance <= 500 // 500 meters
        })
    }, [Containers.result.records, mapCenter])

    // Handler to update mapCenter and zoom when the map view changes
    const handleBoundsChanged = ({
                                     center,
                                     zoom,
                                 }: {
        center: [number, number]
        zoom: number
    }) => {
        setMapCenter(center)
        setZoom(zoom) // Update zoom state
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
                            <SelectItem value="parking">Parking</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Map
                height={950}
                center={mapCenter} // Use current map center
                zoom={zoom} // Use current zoom level
                onBoundsChanged={handleBoundsChanged} // Update map center and zoom on view change
            >
                {selectedType === 'bus' &&
                    buses.map((bus) => {
                        if (bus.lat !== undefined && bus.lon !== undefined) {
                            const latitude = bus.lat
                            const longitude = bus.lon
                            return (
                                <Marker
                                    key={`${bus.voznjaBusId}-${bus.voznjaId}`}
                                    width={25}
                                    anchor={[latitude, longitude]}
                                >
                                    <div className="pin-icon">
                                        <div className="icon-container">
                                            <BusFront
                                                color="#2c56a1"
                                                weight="bold"
                                            />
                                        </div>
                                    </div>
                                </Marker>
                            )
                        }
                        return null
                    })}
                {selectedType === 'trash' &&
                    filteredTrashContainers.map((container) => {
                        const latitude = parseFloat(
                            container.Y.replace(',', '.')
                        )
                        const longitude = parseFloat(
                            container.X.replace(',', '.')
                        )

                        return (
                            <Marker
                                key={container._id}
                                width={25}
                                anchor={[latitude, longitude]}
                            >
                                <div className="pin-icon">
                                    <div className="icon-container">
                                        <Trash color="#04900b" weight="bold" />
                                    </div>
                                </div>
                            </Marker>
                        )
                    })}
                {selectedType === 'charger' &&
                    chargers.map((charger) => {
                        const latitude =  charger.latitude
                        const longitude = charger.longitude

                        return(
                            <Marker
                                key={charger.name}
                                width={25}
                                anchor={[longitude, latitude]}
                            >
                                <div className="pin-icon">
                                    <div className="icon-container">
                                        <ElectricBatteryCharge
                                            color="#f7c744"
                                            weight="bold"
                                        />
                                    </div>
                                </div>
                            </Marker>
                        )
                    })}
                {selectedType === 'parking' &&
                    parkingData.map((parking) => {
                        if (!parking.lokacija) return null // Skip if lokacija is undefined

                        const { lat, lng } = parking.lokacija
                        const color = getParkingMarkerColor(
                            parking.slobodno,
                            parking.kapacitet,
                            parking.live_status
                        )
                        return (
                            <Marker
                                key={parking.parking_name}
                                width={25}
                                anchor={[lat, lng]}
                                onClick={() => {
                                    console.log('Parking marker clicked')
                                    setSelectedParking(parking)
                                    setInfoModal(true)
                                }}
                            >
                                <div
                                    className="relative flex items-center justify-center rounded-full cursor-pointer"
                                    style={{ backgroundColor: color }}
                                >
                                    {/* Visible Marker */}
                                    <div
                                        className="w-6 h-6 flex items-center justify-center rounded-full"
                                        style={{ backgroundColor: color }}
                                    ></div>

                                    {/* Invisible Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation() // Prevent triggering the Marker onClick
                                            console.log(
                                                `Parking marker "${parking.parking_name}" was clicked.`
                                            )
                                        }}
                                        className="absolute inset-0 w-full h-full bg-transparent border-none cursor-pointer"
                                        aria-label={`Parking marker at ${parking.parking_name}`}
                                    />
                                </div>
                            </Marker>
                        )
                    })}
                {infoModal && selectedParking && (
                    <Overlay
                        anchor={[
                            selectedParking.lokacija.lat,
                            selectedParking.lokacija.lng,
                        ]}
                        offset={[120, 79]}
                        onClickOutside={() => setInfoModal(false)}
                    >
                        <div className="bg-white p-4 rounded shadow-lg">
                            <h3 className="text-lg font-bold">
                                {selectedParking.parking_name}
                            </h3>
                            <p>
                                <strong>Free Spaces:</strong>{' '}
                                {selectedParking.slobodno}
                            </p>
                            <p>
                                <strong>Capacity:</strong>{' '}
                                {selectedParking.kapacitet}
                            </p>
                            <p>
                                <strong>Highest Price:</strong> €
                                {selectedParking.highest_cijena.toFixed(2)}
                            </p>
                            <p>
                                <strong>Working Hours:</strong>{' '}
                                {formatWorkingHours(
                                    selectedParking.vrijeme_naplate
                                )}
                            </p>
                            <button
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => setInfoModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </Overlay>
                )}
            </Map>
            {/* Optional: Display loading and error states */}
            {selectedType === 'bus' && loading && (
                <div className="absolute top-40 right-12 bg-white p-4 rounded shadow">
                    Loading buses...
                </div>
            )}
            {selectedType === 'bus' && error && (
                <div className="absolute top-40 right-12 bg-red-100 p-4 rounded shadow">
                    {error}
                </div>
            )}
            {selectedType === 'parking' && parkingLoading && (
                <div className="absolute top-40 right-12 bg-white p-4 rounded shadow">
                    Loading parking data...
                </div>
            )}
            {selectedType === 'parking' && parkingError && (
                <div className="absolute top-40 right-12 bg-red-100 p-4 rounded shadow">
                    {parkingError}
                </div>
            )}
        </>
    )
}

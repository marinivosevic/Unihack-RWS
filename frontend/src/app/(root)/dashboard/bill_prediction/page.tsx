import FormElectricity from '@/components/Form'

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-950 p-4">
            <h1 className="text-3xl font-bold text-center text-white mb-8">
                Cost of Living Prediction
            </h1>
            <div className="w-full max-w-md">
                <FormElectricity />
            </div>
        </div>
    )
}

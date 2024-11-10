import Link from 'next/link'
import Image from 'next/image'
interface HeroImageProps {
    imageSrc: string
    title: string
    content: string
    onShowMore: () => void
}

const HeroImage: React.FC<HeroImageProps> = ({
    imageSrc,
    title,
    content,
    onShowMore,
}) => {
    const truncatedContent =
        content.length > 100 ? content.slice(0, 500) + '...' : content

    return (
        <div className="rounded-xl flex flex-row p-5 mr-5">
            <Image
                src={`data:image/jpeg;base64,/${imageSrc.replace(/^dataimage\/jpegbase64\//, '')}`}
                alt="Hero"
                className="h-auto object-cover rounded-xl"
                width={800}
                height={400}
            />
            <div>
                <h1 className="text-center text-white text-3xl mt-4 ml-4 font-bold">
                    {title}
                </h1>
                <p className="text-white mt-4 ml-4 text-lg">
                    {truncatedContent}
                </p>
                <div>
                    <p className="text-op text-lg mt-4 ml-4 text-quinterny-600 hover:text-quinterny-400">
                        <Link href="#" onClick={onShowMore}>
                            Show more...
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HeroImage

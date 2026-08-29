import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';

export default function Gallery() {
    const images = [img1, img3, img4, img2, img5];

    return (
        <div className="px-6 py-8 bg-white">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Gallery</h2>
            <div className="flex flex-wrap justify-center gap-2">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        alt=""
                        className="w-[32%] h-48 object-cover"
                    />
                ))}
            </div>
        </div>
    );
}
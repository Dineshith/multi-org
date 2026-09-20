import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';

export default function Gallery() {
    return (
        <section className="bg-white px-5 md:px-10 py-12">

            {/* Gallery Heading */}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-7">
                Gallery
            </h2>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

                {/* LEFT COLUMN */}
                <div className="grid grid-rows-2 gap-2">
                    <img
                        src={img1}
                        alt="Gallery"
                        className="w-full h-[250px] md:h-[280px] object-cover"
                    />

                    <img
                        src={img2}
                        alt="Gallery"
                        className="w-full h-[250px] md:h-[280px] object-cover"
                    />
                </div>

                {/* CENTER - TALL IMAGE */}
                <div>
                    <img
                        src={img3}
                        alt="Gallery"
                        className="w-full h-[508px] md:h-[568px] object-cover"
                    />
                </div>

                {/* RIGHT COLUMN */}
                <div className="grid grid-rows-2 gap-2">
                    <img
                        src={img4}
                        alt="Gallery"
                        className="w-full h-[250px] md:h-[280px] object-cover"
                    />

                    <img
                        src={img5}
                        alt="Gallery"
                        className="w-full h-[250px] md:h-[280px] object-cover"
                    />
                </div>

            </div>
        </section>
    );
}
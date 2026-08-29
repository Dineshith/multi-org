import buildingPhoto from '../assets/building.webp';

export default function Hero() {
    return (
        <div className="h-80">
            <img
                src={buildingPhoto}
                alt="College building"
                className="w-full h-full object-cover"
            />
        </div>
    );
}
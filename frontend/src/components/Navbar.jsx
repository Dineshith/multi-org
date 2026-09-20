import { Link } from 'react-router-dom';
import logo from '../assets/akshar-logo-transparent.png';

const sisterOrgs = ['Plus Two', 'Sister org 2', 'Sister org 3'];

export default function Navbar() {
    return (
        <nav className="bg-blue-900 text-white flex items-center justify-between px-6 py-3">
            <div className="flex items-center">
    <img
        src={logo}
        alt="अक्षर"
        className="h-16 w-auto object-contain"
    />
</div>

            <div className="flex items-center gap-6 text-sm">
                <Link to="/">Home</Link>
                <Link to="/research">Research</Link>
                <a href="#">eJournals</a>
            </div>

            <div className="flex items-center gap-2">
                <button className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1.5 rounded">
                    Entrance Result 2083
                </button>
                {sisterOrgs.map((org) => (
                    <button key={org} className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1.5 rounded">
                        {org}
                    </button>
                ))}
            </div>
        </nav>
    );
}
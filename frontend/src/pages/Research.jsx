import researchPhoto from '../assets/research.jpg';

const researchData = [
    { topic: 'JOVAC VOL 1', year: '2024-06-30', level: 'nepjol.info', type: 'Journal', writer: 'RIC Community Team' },
    { topic: 'JOVAC VOL 1', year: '2024-06-30', level: 'nepjol.info', type: 'Journal', writer: 'RIC Community Team' },
    { topic: 'JOVAC VOL 1', year: '2024-06-30', level: 'nepjol.info', type: 'Journal', writer: 'RIC Community Team' },
    { topic: 'JOVAC VOL 1', year: '2024-06-30', level: 'nepjol.info', type: 'Journal', writer: 'RIC Community Team' },
    { topic: 'JOVAC VOL 1', year: '2024-06-30', level: 'nepjol.info', type: 'Journal', writer: 'RIC Community Team' },
];

export default function Research() {
    return (
        <div>
            <div className="relative h-64">
                <img src={researchPhoto} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <h1 className="text-white text-4xl font-semibold">Research & Publication</h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto py-8 px-4">
                <table className="w-full text-sm text-center">
                    <thead className="border-b font-medium">
                        <tr>
                            <th className="py-2">Topic</th>
                            <th>Year</th>
                            <th>Level</th>
                            <th>Type</th>
                            <th>Writer</th>
                            <th>File/PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {researchData.map((row, i) => (
                            <tr key={i} className="border-b">
                                <td className="py-2">{row.topic}</td>
                                <td>{row.year}</td>
                                <td className="text-blue-600 underline">{row.level}</td>
                                <td>{row.type}</td>
                                <td>{row.writer}</td>
                                <td><a href="#">View</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
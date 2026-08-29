export default function StatsBar() {
  return (
    <div className="grid grid-cols-4 text-center py-6 bg-white text-gray-900">
      <div>
        <p className="text-2xl font-bold">27</p>
        <p className="text-xs uppercase text-gray-500">Institutions</p>
      </div>
      <div>
        <p className="text-2xl font-bold">05</p>
        <p className="text-xs uppercase text-gray-500">Disciplines</p>
      </div>
      <div>
        <p className="text-2xl font-bold">6.4k+</p>
        <p className="text-xs uppercase text-gray-500">Students</p>
      </div>
      <div>
        <p className="text-2xl font-bold">140+</p>
        <p className="text-xs uppercase text-gray-500">Faculty</p>
      </div>
    </div>
  );
}
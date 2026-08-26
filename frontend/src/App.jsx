import { useState } from 'react';
import './index.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="max-w-xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Multi-Org Project</h1>
        <p className="text-gray-400 mb-8">Vite + React &amp; Express + MySQL</p>

        <div className="p-8 bg-gray-900 rounded-lg border border-gray-700 mb-6">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-5 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium cursor-pointer transition-colors duration-200 mb-4"
          >
            Count is {count}
          </button>
          <p>
            Edit <code className="bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm">frontend/src/App.jsx</code> and{' '}
            <code className="bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm">backend/server.js</code> to start building.
          </p>
        </div>

        <div className="text-sm text-gray-400 flex flex-col gap-2">
          <p><strong>Frontend:</strong> Running on Vite (Port 5173)</p>
          <p><strong>Backend:</strong> Running on Express (Port 5000)</p>
        </div>
      </div>
    </div>
  );
}

export default App;

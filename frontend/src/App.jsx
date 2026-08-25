import { useState } from 'react';
import './index.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>Multi-Org Project</h1>
      <p className="subtitle">Basic MERN Stack Setup (Vite + React & Express)</p>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
        <p>
          Edit <code>frontend/src/App.jsx</code> and <code>backend/server.js</code> to start building.
        </p>
      </div>

      <div className="info">
        <p><strong>Frontend:</strong> Running on Vite (Port 5173)</p>
        <p><strong>Backend:</strong> Running on Express (Port 5000)</p>
      </div>
    </div>
  );
}

export default App;

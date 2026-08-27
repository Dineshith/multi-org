import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <Stats />
      <Gallery />
      <Footer />
    </div>
  );
}

export default App;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/style.css'; 

export default function Header() {
  const navigate = useNavigate(); 

  return (
    <header className="site-header">
      <div className="header-container">
        
    
        <div className="logo-section" onClick={() => navigate('/plus2')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="logo-icon" style={{ fontSize: '24px' }}>🎓</span> 
          <span className="logo-text">अक्षर</span>
        </div>
        
        <nav className="nav-menu">
          <a href="#" className="active" onClick={(e) => { e.preventDefault(); navigate('/plus2'); }}>Home</a>
          <a href="#">About us ⌄</a>
          <a href="#">Resources ⌄</a>
          
          <div className="nav-dropdown">
            <span className="dropdown-trigger">Update ⌄</span>
            <div className="dropdown-content">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/plus2/events'); }}>Event</a>
            </div>
          </div>

          <a href="#">Academic ⌄</a>
          
         
          <div className="nav-dropdown">
            <span className="dropdown-trigger">Courses ⌄</span>
            <div className="dropdown-content">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/plus2/management'); }}>+2 Management</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/plus2/science'); }}>+2 Science</a>
            </div>
          </div>

          <a href="#">Contact</a>
        </nav>
      </div>
    </header>
  );
}
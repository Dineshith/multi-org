import React from 'react';
import Header from '../component/Header'; 
import Footer from '../component/Footer'; 
import '../assets/style.css';

export default function ScienceCourse() {
  return (
    <div className="science-course-page">
      <Header />
      
    
      <div className="course-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="red-line"></div>
          <h1>+2 Science</h1>
          <p>Our +2 science program offers the study of the natural world's behavior and structure through experimentation and observation.</p>
        </div>
      </div>

     
      <div className="course-main-content">
        
     
        <div className="course-intro">
          <h2>Plus Two +2 Level Affiliated to NEB</h2>
          <p className="intro-para">
            Plus Two science course prepares students to specialize in any area of interest within the discipline of science as a whole.<br/>
            Since its inception, Vishwa Adarsha science department has achieved remarkable HSEB results.
          </p>
          
          <p><strong>Course Duration :</strong> 2 Years</p>
          <p><strong>Eligibility Criteria :</strong> Students will be considered eligible for registration based on their SEE's GPA where they must score C+ in English, Math, and Science.</p>
        </div>

      
        <div className="curriculum-section">
          
         
          <div className="curriculum-lists">
            
            <div className="curriculum-year">
              <h3>XI Curriculum</h3>
              <ul>
                <li><span className="check-icon">✔</span> English</li>
                <li><span className="check-icon">✔</span> Physics</li>
                <li><span className="check-icon">✔</span> Chemistry</li>
                <li><span className="check-icon">✔</span> Biology</li>
                <li><span className="check-icon">✔</span> Computer Science</li>
                <li><span className="check-icon">✔</span> Mathematics</li>
              </ul>
            </div>

            <div className="curriculum-year">
              <h3>XII Curriculum</h3>
              <ul>
                <li><span className="check-icon">✔</span> English</li>
                <li><span className="check-icon">✔</span> Physics</li>
                <li><span className="check-icon">✔</span> Chemistry</li>
                <li><span className="check-icon">✔</span> Biology</li>
                <li><span className="check-icon">✔</span> Computer Science</li>
                <li><span className="check-icon">✔</span> Mathematics</li>
              </ul>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
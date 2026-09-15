import React from 'react';
import Header from '../component/Header'; 
import Footer from '../component/Footer'; 
import '../assets/style.css'; 

export default function ManagementCourse() {
  return (
    <div className="science-course-page">
      <Header />
      
   
      <div className="course-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="red-line"></div>
          <h1>+2 Management</h1>
          <p>Our +2 management program offers the study of organizational activities, processes, principles and different types of managerial role.</p>
        </div>
      </div>

    
      <div className="course-main-content">
        
        <div className="course-content-wrapper">
          
         
          <div className="course-text-section">
            <div className="course-intro">
              <h2>Plus Two +2 Level Affiliated to NEB</h2>
              <p className="intro-para">
                Management is what produces tomorrow's businessmen, top global executives, bankers and leaders. The Plus Two program opens up students to the broad range of management and business studies which is much sought for internationally. Vishwa Adarsha management department is acclaimed as the most experienced and efficient team in and around Itahari.
              </p>
              
              <p><strong>Course Duration :</strong> 2 Years</p>
              <p><strong>Eligibility Criteria :</strong> Students will be considered eligible for registration based on their SEE's GPA where they must score C+ in English, Math, and Science.</p>
            </div>

            <div className="curriculum-section">
              <div className="curriculum-year">
                <h3>XI Curriculum</h3>
                <ul>
                  <li><span className="check-icon">✔</span> English</li>
                  <li><span className="check-icon">✔</span> Nepali</li>
                  <li><span className="check-icon">✔</span> Social Studies And Life Skills</li>
                  <li><span className="check-icon">✔</span> Marketing</li>
                  <li><span className="check-icon">✔</span> Business Mathematics</li>
                  <li><span className="check-icon">✔</span> Principle of accounting</li>
                </ul>
              </div>

              <div className="curriculum-year">
                <h3>XII Curriculum</h3>
                <ul>
                  <li><span className="check-icon">✔</span> English</li>
                  <li><span className="check-icon">✔</span> Social Studies And Life Skills</li>
                  <li><span className="check-icon">✔</span> Business studies</li>
                  <li><span className="check-icon">✔</span> Economics</li>
                  <li><span className="check-icon">✔</span> Business maths</li>
                  <li><span className="check-icon">✔</span> Hotel Management</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}
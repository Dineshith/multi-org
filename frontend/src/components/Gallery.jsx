export default function Gallery() {
  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-container">
        <h2 className="gallery-heading">Gallery</h2>

        <div className="gallery-layout">
          {/* Column 1: Two stacked images */}
          <div className="gallery-col gallery-col-stacked">
            <div className="gallery-card">
              <img
                src="/images/gallery-classroom.jpg"
                alt="Students collaborating and studying"
                loading="lazy"
              />
            </div>
            <div className="gallery-card">
              <img
                src="/images/gallery-library.jpg"
                alt="Students in academic hall"
                loading="lazy"
              />
            </div>
          </div>

          {/* Column 2: One tall portrait image */}
          <div className="gallery-col gallery-col-tall">
            <div className="gallery-card gallery-card-tall">
              <img
                src="/images/gallery-lab.jpg"
                alt="Classroom learning environment"
                loading="lazy"
              />
            </div>
          </div>

          {/* Column 3: Two stacked images */}
          <div className="gallery-col gallery-col-stacked">
            <div className="gallery-card">
              <img
                src="/images/gallery-student.jpg"
                alt="Student actively participating in class"
                loading="lazy"
              />
            </div>
            <div className="gallery-card">
              <img
                src="/images/gallery-group.jpg"
                alt="Group of smiling university students"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

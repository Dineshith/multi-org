import React from 'react';
import { Target, BookOpen, Lightbulb, Shield } from 'lucide-react';

const About = () => {
  return (
    <main className="font-sans">
      {/* Hero Section */}
      <section
        className="relative w-full text-white pt-20 pb-28 sm:pt-24 sm:pb-32 px-6 text-center overflow-hidden bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: "url('/images/Student reading books.jpg')" }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-[#051087]/60" />

        {/* Decorative blur blob */}
        <div className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full bg-white/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-[900px] mx-auto flex flex-col items-center justify-center -translate-y-3 sm:-translate-y-5">
          <h1 className="text-[2.2rem] sm:text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.15] mb-5 tracking-[-1px] drop-shadow-lg text-center">
            Empowering Minds, Shaping the Future
          </h1>
          <p className="text-[clamp(1.1rem,1.5vw,1.25rem)] text-white/95 max-w-[700px] mx-auto leading-[1.8] drop-shadow-md font-medium text-center">
            At Akshar Academy, we believe in providing world-class education that not only
            nurtures academic excellence but also builds character, creativity, and leadership.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-[5rem] px-[clamp(1.5rem,4vw,3rem)] bg-[#f8fafc]">
        <div className="max-w-[1200px] mx-auto">

          {/* Chairman Message */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-[2rem] lg:gap-[4rem] items-center bg-white rounded-[24px] p-[1.5rem] sm:p-[2rem] lg:p-[3rem] shadow-[0_10px_40px_rgba(5,16,135,0.06)] mb-[5rem] border border-[#f1f5f9]">
            <div className="relative rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
              <div className="absolute inset-0 border-[4px] border-white/20 rounded-[20px] pointer-events-none z-10" />
              <img
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80"
                alt="Chairman"
                className="w-full h-auto aspect-[16/9] lg:aspect-[4/5] object-cover block"
              />
            </div>
            <div className="relative">
              <h2 className="text-[2.25rem] text-[#051087] font-[800] mb-[1.5rem] relative z-10">
                A Word from Our Chairman
              </h2>
              <p className="text-[1.05rem] text-slate-500 leading-[1.8] mb-[1.5rem] relative z-10">
                "Education is not just about imparting knowledge; it is about inspiring
                a lifelong love for learning. When we started Akshar Academy, our goal
                was simple: to create an environment where every student feels valued,
                challenged, and prepared for the complexities of the modern world."
              </p>
              <p className="text-[1.05rem] text-slate-500 leading-[1.8] mb-[1.5rem] relative z-10">
                "We are proud of our rich history, our dedicated faculty, and most
                importantly, our students who continue to make us proud across the globe."
              </p>
              <div className="mt-[2rem] relative z-10">
                <h4 className="text-[1.2rem] text-slate-800 font-[700]">Dr. Rajeshwor Prasad</h4>
                <p className="text-[#d32f2f] text-[0.9rem] font-[600] uppercase tracking-[1px]">Founder & Chairman</p>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="text-center mb-[3.5rem]">
            <h2 className="text-[2.5rem] text-[#051087] font-[800] mb-[1rem]">Our Core Values</h2>
            <p className="text-slate-500 text-[1.1rem] max-w-[600px] mx-auto">The principles that guide everything we do at Akshar Academy.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2rem] mb-[5rem]">
            {/* Value Card 1 */}
            <div className="group bg-white py-[2.5rem] px-[1.5rem] rounded-[20px] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f1f5f9] hover:-translate-y-[8px] hover:shadow-[0_15px_30px_rgba(5,16,135,0.08)] transition-all duration-300 ease-out">
              <div className="w-[64px] h-[64px] bg-[#051087]/5 rounded-[16px] flex items-center justify-center mx-auto mb-[1.5rem] text-[#051087] group-hover:bg-[#051087] group-hover:text-white transition-colors duration-300">
                <Target className="w-[28px] h-[28px]" />
              </div>
              <h3 className="text-[1.25rem] font-[700] text-slate-800 mb-[0.75rem]">Excellence</h3>
              <p className="text-slate-500 text-[0.95rem] leading-[1.6]">Striving for the highest standards in academics and personal growth.</p>
            </div>

            {/* Value Card 2 */}
            <div className="group bg-white py-[2.5rem] px-[1.5rem] rounded-[20px] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f1f5f9] hover:-translate-y-[8px] hover:shadow-[0_15px_30px_rgba(5,16,135,0.08)] transition-all duration-300 ease-out">
              <div className="w-[64px] h-[64px] bg-[#051087]/5 rounded-[16px] flex items-center justify-center mx-auto mb-[1.5rem] text-[#051087] group-hover:bg-[#051087] group-hover:text-white transition-colors duration-300">
                <BookOpen className="w-[28px] h-[28px]" />
              </div>
              <h3 className="text-[1.25rem] font-[700] text-slate-800 mb-[0.75rem]">Integrity</h3>
              <p className="text-slate-500 text-[0.95rem] leading-[1.6]">Upholding honesty, strong moral principles, and ethical behavior.</p>
            </div>

            {/* Value Card 3 */}
            <div className="group bg-white py-[2.5rem] px-[1.5rem] rounded-[20px] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f1f5f9] hover:-translate-y-[8px] hover:shadow-[0_15px_30px_rgba(5,16,135,0.08)] transition-all duration-300 ease-out">
              <div className="w-[64px] h-[64px] bg-[#051087]/5 rounded-[16px] flex items-center justify-center mx-auto mb-[1.5rem] text-[#051087] group-hover:bg-[#051087] group-hover:text-white transition-colors duration-300">
                <Lightbulb className="w-[28px] h-[28px]" />
              </div>
              <h3 className="text-[1.25rem] font-[700] text-slate-800 mb-[0.75rem]">Innovation</h3>
              <p className="text-slate-500 text-[0.95rem] leading-[1.6]">Encouraging creative thinking and new approaches to problem-solving.</p>
            </div>

            {/* Value Card 4 */}
            <div className="group bg-white py-[2.5rem] px-[1.5rem] rounded-[20px] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f1f5f9] hover:-translate-y-[8px] hover:shadow-[0_15px_30px_rgba(5,16,135,0.08)] transition-all duration-300 ease-out">
              <div className="w-[64px] h-[64px] bg-[#051087]/5 rounded-[16px] flex items-center justify-center mx-auto mb-[1.5rem] text-[#051087] group-hover:bg-[#051087] group-hover:text-white transition-colors duration-300">
                <Shield className="w-[28px] h-[28px]" />
              </div>
              <h3 className="text-[1.25rem] font-[700] text-slate-800 mb-[0.75rem]">Community</h3>
              <p className="text-slate-500 text-[0.95rem] leading-[1.6]">Fostering a safe, inclusive, and supportive environment for everyone.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Stats/Timeline Section */}
      <section className="bg-[#051087] rounded-[24px] py-[3rem] px-[1.5rem] lg:py-[4rem] lg:px-[2rem] relative overflow-hidden mx-auto max-w-[1200px] mb-20">
        <div className="absolute -top-[50%] -left-[10%] w-[120%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2rem] sm:gap-[3rem_2rem] text-center text-white relative z-10">
          <div className="relative z-10">
            <h3 className="text-[3rem] font-[900] text-[#ffb300] mb-[0.5rem]">2010</h3>
            <p className="text-[1rem] font-[600] tracking-[1px] uppercase text-white/80">Established</p>
          </div>
          <div className="relative z-10">
            <h3 className="text-[3rem] font-[900] text-[#ffb300] mb-[0.5rem]">15k+</h3>
            <p className="text-[1rem] font-[600] tracking-[1px] uppercase text-white/80">Alumni</p>
          </div>
          <div className="relative z-10">
            <h3 className="text-[3rem] font-[900] text-[#ffb300] mb-[0.5rem]">50+</h3>
            <p className="text-[1rem] font-[600] tracking-[1px] uppercase text-white/80">Programs</p>
          </div>
          <div className="relative z-10">
            <h3 className="text-[3rem] font-[900] text-[#ffb300] mb-[0.5rem]">100%</h3>
            <p className="text-[1rem] font-[600] tracking-[1px] uppercase text-white/80">Commitment</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;

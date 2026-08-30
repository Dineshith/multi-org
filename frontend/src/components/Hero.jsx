export default function Hero() {
  return (
    <section className="w-full relative overflow-hidden bg-[#0b1329]" id="home">
      <div className="w-full h-[clamp(340px,46vw,680px)] overflow-hidden relative">
        <img
          src="/images/tuimg.png"
          alt="Akshar Academy main campus building"
          loading="eager"
          className="w-full h-full object-cover object-center block"
        />
        <div className="hero-overlay"></div>
      </div>
    </section>
  );
}

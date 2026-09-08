export default function Plus2Hero() {
  return (
    <section className="w-full relative overflow-hidden bg-[var(--color-hero-bg)]">
      <div className="w-full h-[clamp(22rem,50vw,34rem)] overflow-hidden relative">
        <img
          src="https://tse3.mm.bing.net/th/id/OIP.9yGSWWN3ZaGCqVJcC99bOQHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
          alt="Graduates celebrating at Akshar +2"
          loading="eager"
          className="w-full h-full object-cover object-center block"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col justify-center px-[clamp(1.5rem,6vw,6rem)]">
          <h1 className="text-white text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-[1.2] max-w-[40rem] mb-3">
            Trusted by more than 50000+ students
          </h1>
          <p className="text-white/90 text-[1.05rem] italic font-medium">
            "Be a part of this amazing institution"
          </p>
        </div>
      </div>
    </section>
  );
}
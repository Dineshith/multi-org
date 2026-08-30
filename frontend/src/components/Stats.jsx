import { useState, useEffect, useRef } from 'react';

const statsData = [
  {
    number: 27,
    suffix: '',
    title: 'INSTITUTIONS',
    subtitle: 'National',
    padZero: false,
  },
  {
    number: 5,
    suffix: '',
    title: 'DISCIPLINES',
    subtitle: 'Offered',
    padZero: true,
  },
  {
    number: 6.4,
    suffix: 'k+',
    title: 'STUDENTS',
    subtitle: 'Registered',
    isDecimal: true,
  },
  {
    number: 140,
    suffix: '+',
    title: 'FACULTY',
    subtitle: 'Peer oriented',
    padZero: false,
  },
];

function AnimatedNumber({ target, suffix, padZero, isDecimal }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            if (isDecimal) {
              setCount(parseFloat((target * eased).toFixed(1)));
            } else {
              setCount(Math.floor(target * eased));
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, isDecimal]);

  const displayNumber = padZero && count < 10 ? `0${count}` : count;

  return (
    <div ref={ref} className="text-[clamp(2.2rem,3.2vw,3.2rem)] font-extrabold text-[#111827] leading-[1.1] mb-[0.4rem] tabular-nums">
      {displayNumber}{suffix}
    </div>
  );
}

export default function Stats() {
  return (
    <section className="w-full bg-white py-12 px-[clamp(1.25rem,4vw,4rem)] border-b border-[#e2e8f0]" id="stats">
      <div className="max-w-[1350px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div className={`text-center relative py-3 px-4 ${index < statsData.length - 1 ? 'lg:border-r lg:border-[#e2e8f0]' : ''}`} key={index}>
            <AnimatedNumber
              target={stat.number}
              suffix={stat.suffix}
              padZero={stat.padZero}
              isDecimal={stat.isDecimal}
            />
            <div className="text-[clamp(0.8rem,1vw,0.95rem)] font-extrabold text-[#111827] tracking-[0.8px] uppercase mb-[0.2rem]">{stat.title}</div>
            <div className="text-[clamp(0.75rem,0.9vw,0.85rem)] text-[#6b7280] font-normal">{stat.subtitle}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

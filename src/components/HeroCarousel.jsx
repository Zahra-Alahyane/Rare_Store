import React, { useState, useEffect, useRef } from 'react';

const slides = [
  {
    bg: '/images/acc.jpeg',
    title: 'New Arrivals',
    subtitle: 'SPRING/SUMMER 2025 COLLECTION',
    description: 'Discover the latest trends in luxury fashion. Timeless pieces crafted with exceptional attention to detail.',
    overlay: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4))'
  },
  {
    bg: '/images/store.jpg',
    title: 'Haute Couture',
    subtitle: 'ELEGANCE REDEFINED',
    description: 'Exclusive designer pieces that make a statement. Crafted from the finest materials worldwide.',
    overlay: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4))'
  },
  {
    bg: '/images/backk.jpeg',
    title: 'Accessories',
    subtitle: 'COMPLETE YOUR LOOK',
    description: 'Curated accessories that add the perfect finishing touch to any outfit.',
    overlay: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4))'
  }
];

// ✅ Accept onShopNowClick prop
export default function HeroCarousel({ onShopNowClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(autoPlayRef.current);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
  };

  // ✅ Scrolls to BestSellersCarousel via id="best-sellers"
  const scrollToBestSellers = () => {
    const section = document.getElementById('best-sellers');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '600px',
        maxHeight: '900px',
        overflow: 'hidden',
        width: '100%',
        marginBottom: '-120px'
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{
            position: 'absolute', inset: 0,
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            width: '100%', height: '100%'
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${slide.bg})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            width: '100%', height: '100%',
            transform: currentSlide === index ? 'scale(1)' : 'scale(1.1)',
            transition: 'transform 10s ease-out'
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: slide.overlay,
            width: '100%', height: '100%'
          }} />

          <div style={{
            position: 'relative', zIndex: 10, height: '100%',
            display: 'flex', alignItems: 'center',
            maxWidth: '1280px', width: '100%',
            margin: '0 auto', padding: '0 32px', boxSizing: 'border-box'
          }}>
            <div style={{
              maxWidth: '700px', width: '100%',
              animation: currentSlide === index ? 'fadeInUp 1s ease-out' : 'none'
            }}>
              <div style={{
                display: 'inline-block', padding: '8px 24px',
                background: 'rgba(127, 29, 29, 0.3)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '50px',
                fontSize: '12px', letterSpacing: '2px', marginBottom: '24px',
                color: '#fff', fontWeight: 600
              }}>
                {slide.subtitle}
              </div>

              <h2 style={{
                fontSize: 'clamp(48px, 7vw, 84px)', fontWeight: 700,
                marginBottom: '24px', lineHeight: 1.1,
                letterSpacing: '-0.02em', textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}>
                {slide.title}
              </h2>

              <p style={{
                fontSize: 'clamp(16px, 2vw, 20px)', marginBottom: '40px',
                color: '#e5e7eb', lineHeight: 1.8, maxWidth: '600px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}>
                {slide.description}
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {/* ✅ Shop Now → navigates to ProductsPage */}
                <button
                  onClick={onShopNowClick}
                  style={{
                    background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
                    color: '#fff', border: 'none', padding: '18px 48px',
                    fontSize: '14px', letterSpacing: '1.5px', fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.3s ease',
                    borderRadius: '50px', boxShadow: '0 8px 25px rgba(127, 29, 29, 0.4)',
                    textTransform: 'uppercase'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(127, 29, 29, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(127, 29, 29, 0.4)';
                  }}
                >
                  Shop Now
                </button>

                {/* ✅ Explore → scrolls to BestSellersCarousel */}
                <button
                  onClick={scrollToBestSellers}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
                    color: '#fff', border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '18px 48px', fontSize: '14px', letterSpacing: '1.5px',
                    fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease',
                    borderRadius: '50px', textTransform: 'uppercase'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        style={{
          position: 'absolute', left: '32px', top: '50%', transform: 'translateY(-50%)',
          zIndex: 20, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff',
          width: '56px', height: '56px', borderRadius: '50%', cursor: 'pointer',
          transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(127, 29, 29, 0.8)'; e.currentTarget.style.borderColor = 'rgba(127, 29, 29, 1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        style={{
          position: 'absolute', right: '32px', top: '50%', transform: 'translateY(-50%)',
          zIndex: 20, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff',
          width: '56px', height: '56px', borderRadius: '50%', cursor: 'pointer',
          transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(127, 29, 29, 0.8)'; e.currentTarget.style.borderColor = 'rgba(127, 29, 29, 1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      {/* Slide Indicators */}
      <div style={{
        position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, display: 'flex', gap: '12px',
        background: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(10px)',
        padding: '12px 20px', borderRadius: '50px', border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {slides.map((_, index) => (
          <button
            key={index} onClick={() => goToSlide(index)}
            style={{
              width: currentSlide === index ? '40px' : '12px', height: '12px',
              borderRadius: '6px',
              background: currentSlide === index
                ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
                : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer', transition: 'all 0.4s ease',
              boxShadow: currentSlide === index ? '0 4px 15px rgba(127, 29, 29, 0.5)' : 'none'
            }}
          />
        ))}
      </div>

      {/* Wave Divider */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'rotate(180deg)', zIndex: 15 }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '120px' }}>
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#000"/>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#000"/>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#000"/>
        </svg>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
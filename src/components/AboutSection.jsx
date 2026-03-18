import React, { useState } from 'react';

export default function AboutSection({ onExploreClick }) {
  const [hoveredStat, setHoveredStat] = useState(null);

  return (
    <section 
      id="about" 
      style={{ 
        width: '100%', 
        background: 'linear-gradient(180deg, rgb(45, 12, 14) 0%, #0f0f0f 50%, #000 100%)',
        color: '#fff',
        padding: '160px 0 120px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        margin: 0
      }}
    >
      {/* Subtle Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(157, 153, 153, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(127, 29, 29, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>

      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '0 32px',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '100px', position: 'relative' }}>
          <div style={{
            display: 'inline-block',
            padding: '10px 28px',
            background: 'rgba(127, 29, 29, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(127, 29, 29, 0.3)',
            borderRadius: '50px',
            fontSize: '13px',
            letterSpacing: '3px',
            marginBottom: '32px',
            color: '#e3d6d6',
            fontWeight: 600
          }}>
            ABOUT US
          </div>
          
          <h2 style={{ 
            fontSize: 'clamp(44px, 7vw, 76px)', 
            fontWeight: 700, 
            letterSpacing: '-0.03em',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1
          }}>
            Redefining Luxury<br />Fashion
          </h2>
          
          <p style={{
            fontSize: 'clamp(17px, 2vw, 22px)',
            color: '#9ca3af',
            maxWidth: '750px',
            margin: '0 auto',
            lineHeight: 1.8,
            fontWeight: 300
          }}>
            Where timeless elegance meets contemporary innovation. Crafting exceptional pieces for those who dare to stand out.
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          marginBottom: '120px'
        }}>
          {[
            {
              image: '/images/loo.jpeg',
              title: 'Exceptional Craftsmanship',
              description: 'Every piece is meticulously crafted by master artisans using time-honored techniques and premium materials.'
            },
            {
              image: '/images/int.jpeg',
              title: 'Global Inspiration',
              description: 'Drawing inspiration from cultures worldwide, we create designs that transcend borders and celebrate diversity.'
            },
            {
              image: '/images/sus.jpeg',
              title: 'Sustainable Luxury',
              description: 'Committed to ethical practices and eco-friendly materials, luxury fashion that cares for our planet.'
            }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '32px',
                padding: '0',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                height: '420px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.borderColor = 'rgba(127, 29, 29, 0.4)';
                e.currentTarget.style.boxShadow = '0 25px 60px rgba(127, 29, 29, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '32px',
                transition: 'transform 0.5s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                  borderRadius: '32px'
                }}></div>
              </div>
              
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                padding: '40px',
                zIndex: 1
              }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  marginBottom: '16px',
                  color: '#fff',
                  letterSpacing: '-0.01em'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: '#d1d5db',
                  lineHeight: 1.7,
                  fontSize: '16px',
                  fontWeight: 300
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Animated Stats */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.12) 0%, rgba(127, 29, 29, 0.04) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '40px',
          padding: '80px 60px',
          marginBottom: '120px',
          border: '1px solid rgba(127, 29, 29, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '60%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(127, 29, 29, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'float 8s ease-in-out infinite'
          }}></div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '60px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            {[
              { number: '15+', label: 'Years' },
              { number: '50K+', label: 'Customers' },
              { number: '500+', label: 'Products' },
              { number: '30+', label: 'Countries' }
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div style={{ 
                  fontSize: 'clamp(48px, 6vw, 72px)', 
                  fontWeight: 800, 
                  color: hoveredStat === index ? '#ef4444' : '#fff',
                  marginBottom: '12px',
                  transition: 'all 0.4s ease',
                  transform: hoveredStat === index ? 'scale(1.15)' : 'scale(1)',
                  letterSpacing: '-0.02em'
                }}>
                  {stat.number}
                </div>
                <div style={{ 
                  fontSize: '15px', 
                  color: '#9ca3af', 
                  letterSpacing: '3px',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Gallery */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          marginBottom: '120px'
        }}>
          <div style={{
            gridColumn: 'span 8',
            height: '450px',
            background: 'url(/images/atelier.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '32px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.5s ease',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '48px',
              borderRadius: '32px'
            }}>
              <div>
                <h3 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '12px', letterSpacing: '-0.01em' }}>
                  Our Atelier
                </h3>
                <p style={{ color: '#d1d5db', fontSize: '16px', fontWeight: 300 }}>
                  Where magic happens
                </p>
              </div>
            </div>
          </div>

          <div style={{
            gridColumn: 'span 4',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{
              height: '213px',
              backgroundImage: 'url(/images/atelier2.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '32px',
              cursor: 'pointer',
              transition: 'transform 0.5s ease',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            ></div>
            <div style={{
              height: '213px',
              backgroundImage: 'url(/images/atelier3.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '32px',
              cursor: 'pointer',
              transition: 'transform 0.5s ease',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            ></div>
          </div>
        </div>

        {/* Modern CTA */}
        <div style={{
          textAlign: 'center',
          padding: '100px 60px',
          background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.08) 0%, rgba(0, 0, 0, 0.2) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '40px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(127, 29, 29, 0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            animation: 'pulse 6s ease-in-out infinite'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700,
              marginBottom: '28px',
              background: 'linear-gradient(135deg, #fff 0%, #9ca3af 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Ready to Elevate<br />Your Style?
            </h3>
            
            <p style={{
              color: '#9ca3af',
              marginBottom: '48px',
              fontSize: '19px',
              maxWidth: '650px',
              margin: '0 auto 48px',
              lineHeight: 1.7,
              fontWeight: 300
            }}>
              Join thousands of fashion enthusiasts who trust RARE for their luxury wardrobe.
            </p>
            
            <button 
              onClick={onExploreClick}
              style={{
                background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
                color: '#fff',
                border: 'none',
                padding: '20px 56px',
                fontSize: '15px',
                letterSpacing: '2px',
                fontWeight: 700,
                cursor: 'pointer',
                borderRadius: '50px',
                boxShadow: '0 15px 50px rgba(127, 29, 29, 0.4)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 20px 60px rgba(127, 29, 29, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 15px 50px rgba(127, 29, 29, 0.4)';
              }}
            >
              Explore Collections
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 0.5; 
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2); 
            opacity: 0.8; 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </section>
  );
}
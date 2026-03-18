import React, { useState } from 'react';

export default function VideoSection() {
  const [showStory, setShowStory] = useState(false);

  return (
    <>
      <section style={{ 
        position: 'relative', 
        height: '100vh', 
        overflow: 'hidden', 
        background: '#000'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(127, 29, 29, 0.3) 100%)'
        }} />
        
        <div style={{ 
          position: 'relative', 
          zIndex: 2, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center', 
          padding: '32px' 
        }}>
          <h2 style={{ 
            fontSize: '60px', 
            fontWeight: 300, 
            letterSpacing: '0.3em', 
            marginBottom: '24px'
          }}>
            CRAFTED WITH PASSION
          </h2>
          <p style={{ 
            fontSize: '24px', 
            color: '#d1d5db', 
            marginBottom: '32px', 
            maxWidth: '800px'
          }}>
            Every piece tells a story of elegance, quality, and timeless style
          </p>
          <button 
            onClick={() => setShowStory(true)}
            style={{ 
              background: '#7f1d1d', 
              color: '#fff', 
              border: 'none', 
              padding: '16px 32px', 
              fontSize: '14px', 
              letterSpacing: '1.5px', 
              fontWeight: 600, 
              cursor: 'pointer', 
              transition: 'all 0.3s',
              borderRadius: '50px'
            }}
            onMouseOver={(e) => e.target.style.background = '#991b1b'}
            onMouseOut={(e) => e.target.style.background = '#7f1d1d'}
          >
            DISCOVER OUR STORY
          </button>
        </div>

        {/* Bottom Fade Gradient - Change the color to match your next section */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '200px',
          background: 'linear-gradient(to bottom, transparent 0%, #2c0c0c 100%)', // Change #1a1a1a to your next section's color
          zIndex: 3,
          pointerEvents: 'none'
        }} />
      </section>

      {/* Story Modal */}
      {showStory && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.95)', 
          zIndex: 1000, 
          overflowY: 'auto'
        }}>
          <button 
            onClick={() => setShowStory(false)}
            style={{ 
              position: 'fixed', 
              top: '32px', 
              right: '32px', 
              background: 'transparent', 
              color: '#fff', 
              border: '2px solid #fff', 
              width: '48px', 
              height: '48px', 
              fontSize: '24px', 
              cursor: 'pointer',
              zIndex: 1001,
              transition: 'all 0.3s',
              borderRadius: '50%'
            }}
            onMouseOver={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#000'; }}
            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#fff'; }}
          >
            ×
          </button>

          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 32px' }}>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <h1 style={{ fontSize: '72px', fontWeight: 300, letterSpacing: '0.2em', marginBottom: '24px', color: '#fff' }}>OUR STORY</h1>
              <div style={{ width: '100px', height: '2px', background: '#7f1d1d', margin: '0 auto 32px' }} />
              <p style={{ fontSize: '20px', color: '#d1d5db', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
                A legacy of craftsmanship, elegance, and timeless style that spans generations
              </p>
            </div>

            {/* Timeline Section 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '80px', alignItems: 'center' }}>
              <div style={{ 
                backgroundImage: 'url(public/images/1950.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '400px',
                borderRadius: '16px'
              }}>
              </div>
              
              <div>
                <h3 style={{ fontSize: '36px', color: '#7f1d1d', marginBottom: '16px', fontWeight: 300 }}>THE BEGINNING</h3>
                <h4 style={{ fontSize: '24px', color: '#fff', marginBottom: '24px', fontWeight: 400 }}>1950 - The Foundation</h4>
                <p style={{ fontSize: '18px', color: '#d1d5db', lineHeight: '1.8' }}>
                  Our journey began in a small atelier in Paris, where our founder, Marie Laurent, opened the doors to what would become a legendary fashion house. With nothing but a vision for timeless elegance and an unwavering commitment to quality, she started creating pieces that would define an era.
                </p>
              </div>
            </div>

            {/* Timeline Section 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '80px', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '36px', color: '#7f1d1d', marginBottom: '16px', fontWeight: 300 }}>GOLDEN ERA</h3>
                <h4 style={{ fontSize: '24px', color: '#fff', marginBottom: '24px', fontWeight: 400 }}>1960s - 1970s</h4>
                <p style={{ fontSize: '18px', color: '#d1d5db', lineHeight: '1.8' }}>
                  The boutique flourished during the golden age of fashion. Our designs graced the pages of prestigious magazines and adorned celebrities and fashion icons. Each piece was meticulously handcrafted, embodying the perfect blend of traditional techniques and innovative design.
                </p>
              </div>
              <div style={{ 
                backgroundImage: 'url(public/images/chanel.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '400px',
                borderRadius: '16px'
              }}>
              </div>
            </div>

            {/* Timeline Section 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '80px', alignItems: 'center' }}>
              <div style={{ 
                backgroundImage: 'url(public/images/expe.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '400px',
                borderRadius: '16px'
              }}>
              </div>
              <div>
                <h3 style={{ fontSize: '36px', color: '#7f1d1d', marginBottom: '16px', fontWeight: 300 }}>EXPANSION</h3>
                <h4 style={{ fontSize: '24px', color: '#fff', marginBottom: '24px', fontWeight: 400 }}>1980s - 2000s</h4>
                <p style={{ fontSize: '18px', color: '#d1d5db', lineHeight: '1.8' }}>
                  As our reputation grew, so did our presence. We opened boutiques in fashion capitals around the world - Milan, New York, Tokyo, and London. Despite our growth, we never compromised on the artisanal quality and personal touch that made us special.
                </p>
              </div>
            </div>

            {/* Timeline Section 4 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '80px', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '36px', color: '#7f1d1d', marginBottom: '16px', fontWeight: 300 }}>TODAY</h3>
                <h4 style={{ fontSize: '24px', color: '#fff', marginBottom: '24px', fontWeight: 400 }}>2020s - Present</h4>
                <p style={{ fontSize: '18px', color: '#d1d5db', lineHeight: '1.8' }}>
                  Today, we continue to honor our heritage while embracing innovation. Each piece is still crafted with the same dedication to excellence that Marie Laurent instilled over 70 years ago. We blend sustainable practices with timeless design, ensuring that our legacy lives on for generations to come.
                </p>
              </div>
              <div style={{ 
                backgroundImage: 'url(public/images/19XX.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '400px',
                borderRadius: '16px'
              }}>
              </div>
            </div>

            {/* Values Section */}
            <div style={{ textAlign: 'center', marginTop: '120px', padding: '80px 0', borderTop: '1px solid #3d3d3d' }}>
              <h2 style={{ fontSize: '48px', fontWeight: 300, letterSpacing: '0.2em', marginBottom: '64px', color: '#fff' }}>OUR VALUES</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '24px' }}>✂️</div>
                  <h3 style={{ fontSize: '24px', color: '#7f1d1d', marginBottom: '16px' }}>CRAFTSMANSHIP</h3>
                  <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>Every stitch tells a story of dedication and mastery</p>
                </div>
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '24px' }}>💎</div>
                  <h3 style={{ fontSize: '24px', color: '#7f1d1d', marginBottom: '16px' }}>QUALITY</h3>
                  <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>Only the finest materials and techniques</p>
                </div>
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '24px' }}>♾️</div>
                  <h3 style={{ fontSize: '24px', color: '#7f1d1d', marginBottom: '16px' }}>TIMELESS</h3>
                  <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>Designs that transcend trends and seasons</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
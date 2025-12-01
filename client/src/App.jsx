import NavBar from '../components/NavBar'
import Pattern from '../components/pattern'
import Lenis from 'lenis'
import {useEffect, useRef, useState} from 'react'
import Card from '../components/card.jsx'

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const lenisRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    
    lenisRef.current = lenis;

    lenis.on('scroll', ({ scroll, limit }) => {
      const progress = (scroll / limit) * 100;
      setScrollProgress(progress);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.querySelector(id);
    lenisRef.current?.scrollTo(element, { offset: 0, duration: 1.5 });
  };

  return (
    <main className="w-full min-h-screen bg-[#ECE6FF] scroll-smooth relative overflow-x-hidden scrollb">
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-[100]">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating scroll indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {['#hero', '#features', '#stats', '#testimonials', '#pricing', '#footer'].map((id, idx) => (
          <button 
            key={id}
            onClick={() => scrollToSection(id)}
            className={`w-3 h-3 rounded-full transition-all ${
              scrollProgress >= idx * 20 && scrollProgress < (idx + 1) * 20 
                ? 'bg-indigo-600 scale-125' 
                : 'bg-gray-400'
            }`}
            aria-label={`Scroll to ${id.slice(1)}`}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section 
        id="hero"
        ref={(el) => (sectionsRef.current[0] = el)}
        className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Pattern/>
        </div>
        <div className="absolute top-0 w-full z-50">
          <NavBar/>
        </div>
        <div 
          className={`z-10 text-center max-w-5xl px-6 transition-all duration-1000 ${
            isVisible['hero'] !== false ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl md:text-7xl font-bold text-white pixelify mb-6 leading-tight">
            Revolutionizing Pharmacy Management
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto text-indigo-100 mb-8">
            Seamless inventory, smart tracking, and superior patient care—all in one unified platform.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-all">
              Get Started
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 z-20 animate-bounce">
          <button onClick={() => scrollToSection('#features')}>
            <img src="./image.png" alt="Down arrow" className='size-14 rotate-45'/>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        ref={(el) => (sectionsRef.current[1] = el)}
        className="w-full h-fit flex justify-center items-center py-20"
      >
        <div className="pixelify max-w-7xl px-6">
          <h2 
            className={`text-3xl md:text-5xl font-bold text-gray-800 mb-6 text-center transition-all duration-1000 delay-100 ${
              isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Built for Busy Pharmacies
          </h2>
          <p 
            className={`pixelify text-md md:text-xl text-gray-600 text-center mb-16 transition-all duration-1000 delay-200 ${
              isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Streamline workflows with intuitive tools and actionable insights.
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Instant Inventory", description: "Real-time counts & low-stock alerts" },
              { title: "Auto Reorders", description: "Smart restock to avoid shortages" },
              { title: "Secure Orders", description: "Encrypted processing & tracking" },
              { title: "Patient Insights", description: "Medication history & reminders" }
            ].map((card, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible['features'] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <Card title={card.title} description={card.description} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="stats"
        ref={(el) => (sectionsRef.current[2] = el)}
        className="w-full bg-gradient-to-br from-indigo-600 to-purple-600 py-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center pixelify">
            Proven Results That Matter
          </h2>
          <p className="text-lg text-indigo-100 text-center mb-12 max-w-2xl mx-auto">
            Join thousands of pharmacies worldwide who have transformed their operations and improved patient outcomes with our platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            {[
              { number: "10K+", label: "Active Pharmacies", description: "Across 50+ countries" },
              { number: "99.9%", label: "Uptime", description: "24/7 reliability guaranteed" },
              { number: "5M+", label: "Prescriptions Processed", description: "Monthly transactions" }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className={`transition-all duration-1000 ${
                  isVisible['stats'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <h3 className="text-5xl font-bold pixelify mb-2">{stat.number}</h3>
                <p className="text-xl text-white font-semibold mb-1">{stat.label}</p>
                <p className="text-sm text-indigo-200">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials"
        ref={(el) => (sectionsRef.current[3] = el)}
        className="w-full py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 text-center pixelify">
            Trusted by Professionals
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Hear from pharmacy professionals who've experienced real transformation in their daily operations and patient care quality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Dr. Sarah Chen", role: "Chief Pharmacist", location: "MedCare Pharmacy", quote: "This platform saved us 15 hours per week. The automated inventory management is a game-changer for our busy pharmacy." },
              { name: "Mike Rodriguez", role: "Pharmacy Owner", location: "Rodriguez Health", quote: "Best investment for our business operations. Customer service is exceptional and the ROI was visible within the first month." },
              { name: "Emily Watson", role: "Inventory Manager", location: "CityMed Pharmacy", quote: "Incredibly intuitive and powerful tools. Training our team took just a few hours, and the efficiency gains are remarkable." }
            ].map((testimonial, idx) => (
              <div 
                key={idx}
                className={`bg-indigo-50 p-6 rounded-xl transition-all duration-700 hover:shadow-lg ${
                  isVisible['testimonials'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <p className="text-gray-700 mb-4 italic text-lg">"{testimonial.quote}"</p>
                <div className="border-t border-indigo-200 pt-4">
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        id="footer"
        ref={(el) => (sectionsRef.current[5] = el)}
        className="w-full bg-gray-900 text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-lg mb-4">Ready to transform your pharmacy?</p>
          <button className="px-8 py-3 bg-indigo-600 rounded-lg font-bold hover:bg-indigo-700 transition-all mb-8">
            Get Started Today
          </button>
          <p className="text-gray-400 text-sm">© 2024 Pharmacy Store. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

export default App
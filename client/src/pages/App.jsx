import NavBar from '../../components/NavBar.jsx'
import Pattern from '../../components/pattern'
import Lenis from 'lenis'
import {useEffect, useRef, useState} from 'react'
import Card from '../../components/card.jsx'
import { useNavigate } from 'react-router-dom'
  import { Quote } from "lucide-react";

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

  const navigate = useNavigate();

  const handleAdminNavigation = (path) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const handleCustomerNavigation = (path) => {
    const token = localStorage.getItem('customerToken');
    if (token) {
      navigate(path);
    } else {
      navigate('/customer/login');
    }
  };

  return (
    <main className="w-full min-h-screen bg-black scroll-smooth relative overflow-x-hidden scrollb">

    
    

    
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {['#hero', '#features', '#how-it-works', '#stats', '#testimonials', '#pricing', '#footer'].map((id, idx) => (
          <button 
            key={id}
            onClick={() => scrollToSection(id)}
            className={`w-3 h-3 rounded-full transition-all ${
              scrollProgress >= idx * (100 / 7) && scrollProgress < (idx + 1) * (100 / 7) 
                ? 'bg-white scale-125' 
                : 'bg-black'
            }`}
            aria-label={`Scroll to ${id.slice(1)}`}
          />
        ))}
      </div>

     
      <section 
        id="hero"
        ref={(el) => (sectionsRef.current[0] = el)}
        className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-40 "> {/* Opacity 40% ensures it doesn't distract */}
        <Pattern />
      </div>
      <div className="absolute inset-0 z-0 opacity-40 "> {/* Opacity 40% ensures it doesn't distract */}
        <Pattern />
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
            Making Life Easier for Pharmacy Admins
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto text-indigo-100 mb-8">
            Keep your pharmacy running smoothly, track inventory like a pro, and focus on what matters most—taking care of your patients.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-indigo-50 transition-all cursor-pointer" onClick={() => navigate('/register')}>
              Let's Get Started
            </button>
           
          </div>
        </div>
        <div className="absolute bottom-10 z-20 animate-bounce">
          <button onClick={() => scrollToSection('#features')}>
            <img src="./image.png" alt="Down arrow" className='size-14 rotate-45'/>
          </button>
        </div>
      </section>

     
      <section 
        id="features" 
        ref={(el) => (sectionsRef.current[1] = el)}
        className="w-full h-fit flex justify-center items-center py-20"
      >
        <div className="pixelify max-w-7xl px-6">
          <h2 
            className={`text-3xl md:text-5xl font-bold text-white mb-6 text-center transition-all duration-1000 delay-100 ${
              isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Built for Busy Pharmacy Admins
          </h2>
          <p 
            className={`pixelify text-md md:text-xl text-gray-300 text-center mb-16 transition-all duration-1000 delay-200 ${
              isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Simplify your workflow with easy-to-use tools that save you time and hassle.
          </p>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Quick Inventory Check", description: "Monitor stock levels in real-time and get notified when supplies are running low" },
              { title: "Staff Management", description: "Manage pharmacy staff, assign roles, and oversee team operations securely" },
              { title: "Safe Ordering", description: "Secure and traceable purchases every single time" },
              { title: "Detailed Analytics", description: "Visualize sales trends, revenue, and inventory value with interactive charts" }
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

      <section 
        id="how-it-works"
        ref={(el) => (sectionsRef.current[2] = el)}
        className="w-full h-fit flex justify-center items-center py-20 bg-white text-black"
      >
        <div className="max-w-7xl px-6">
          <h2 
            className={`text-3xl md:text-5xl font-bold  mb-6 text-center pixelify transition-all duration-1000 delay-100 ${
              isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            How It Works (Step-by-Step Process)
          </h2>
          <p 
            className={`text-md md:text-xl  text-center mb-16 transition-all duration-1000 delay-200 ${
              isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Get started in just a few simple steps and streamline your pharmacy management.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <svg className="w-16 h-16 text-indigo-600" fill="black" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>, title: "Sign Up", description: "Create your account and set up your pharmacy profile quickly and securely." },
              { icon: <svg className="w-16 h-16 text-indigo-600" fill="black" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/></svg>, title: "Set Up Inventory", description: "Import or manually add your current stock to start tracking in real-time." },
              { icon: <svg className="w-16 h-16 text-indigo-600" fill="black" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>, title: "Monitor & Manage", description: "Use dashboards to oversee operations, receive alerts, and manage orders effortlessly." },
              { icon: <svg className="w-16 h-16 text-indigo-600" fill="black" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>, title: "Get Support", description: "Access 24/7 help from our team to ensure smooth sailing every step of the way." }
            ].map((step, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 p-8 rounded-xl  ${
                  isVisible['how-it-works'] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="mb-4 flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
     
     
     

<section
  id="testimonials"
  ref={(el) => (sectionsRef.current[4] = el)}
  className="w-full py-24 bg-black relative overflow-hidden"
>
  {/* Optional: Subtle background pattern for texture */}
  <div className="absolute inset-0 opacity-20" 
       style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
  </div>

  <div className="max-w-7xl mx-auto px-6 relative z-10">
    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 pixelify tracking-tight">
        Loved by Pharmacy Pros
      </h2>
      <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
        Hear from fellow admins who've transformed their pharmacies and made a real difference for their teams and patients.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {[
        { 
          name: "Dr. Sanjay Rajput", 
          role: "Head Pharmacist", 
          location: "MedCare Pharmacy", 
          quote: "This tool saved us 15 hours a week! The auto inventory feature is a game-changer for our hectic schedule." ,
          img: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        { 
          name: "Alexa Morgan", 
          role: "Pharmacy Owner", 
          location: "MedTown Health", 
          quote: "Best investment we've made. The support team is fantastic, and we saw improvements right away.",
          img: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        { 
          name: "Aman Gupta", 
          role: "Inventory Manager", 
          location: "CityMed Pharmacy", 
          quote: "So user-friendly and feature-packed. Our team got up to speed quickly, and the efficiency boost is incredible!" ,
          img: "https://randomuser.me/api/portraits/men/65.jpg"
        }
      ].map((testimonial, idx) => (
        <div
          key={idx}
          className={`
            group relative p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm
            transition-all duration-500 hover:border-zinc-600 hover:bg-zinc-900
            ${isVisible['testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}
          style={{ transitionDelay: `${idx * 150}ms` }}
        >
          {/* Large Background Quote Icon for Decoration */}
          <div className="absolute top-6 right-6 opacity-10 transition-opacity group-hover:opacity-20">
            <Quote size={24} className="text-white fill-white" />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <p className="text-zinc-300 text-lg leading-relaxed mb-8 font-light">
              "{testimonial.quote}"
            </p>

            <div className="flex items-center gap-4 pt-6 border-t border-zinc-800 group-hover:border-zinc-700 transition-colors">
              {/* Optional: Initials Avatar if no images are used */}
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-sm shrink-0">
                {
                  testimonial.img ? (
                    <img 
                      src={testimonial.img} 
                      alt={testimonial.name} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    testimonial.name.split(' ').map(n => n[0]).join('')
                  )
                }
              </div>
              
              <div>
                <p className="font-semibold text-white text-base">
                  {testimonial.name}
                </p>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  <span>{testimonial.role}</span>
                  <span className="hidden md:inline">•</span>
                  <span>{testimonial.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      
      <footer 
        id="footer"
        ref={(el) => (sectionsRef.current[5] = el)}
        className="w-full bg-black text-white pt-20 pb-10 border-t border-white/20"
      >
        <div className="max-w-7xl mx-auto px-6">
          
          {/* CTA Section */}
          

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold pixelify mb-4">Pharmacy Store</h3>
              <p className="text-gray-400 max-w-sm mb-6 text-sm leading-relaxed">
                Streamlining pharmacy operations with cutting-edge inventory tracking and patient management tools. Built for efficiency, designed for care.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Platform</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <button 
                    onClick={() => handleAdminNavigation('/admin/inventory')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Inventory Management
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleCustomerNavigation('/track')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Order Tracking
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleAdminNavigation('/admin/analytics')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Analytics
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Contact Us</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Get in Touch</button></li>
                <li><span className="block">support@pharmflow.com</span></li>
                <li><span className="block">+1 (555) 123-4567</span></li>
              </ul>
            </div>


          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2025 Pharmacy Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
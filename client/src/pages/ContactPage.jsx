import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import NavBar from '../../components/NavBar';

const ContactPage = () => {
  const [state, handleSubmit] = useForm("mpqaqgna");

  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-black text-white">
        
        <div className="container mx-auto px-6 py-24 max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold pixelify mb-8">Thank You!</h1>
          <p className="text-gray-400 text-lg mb-8">
            Your message has been sent successfully. We'll get back to you soon.
          </p>
          <a 
            href="/" 
            className="inline-block bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
     
      <div className="container mx-auto px-6 py-24 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold pixelify mb-8 text-center">Contact Us</h1>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
              <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
              <div className="space-y-4 text-gray-400">
                <p>
                  <span className="block text-white font-semibold mb-1">Email</span>
                  support@pharmflow.com
                </p>
                <p>
                  <span className="block text-white font-semibold mb-1">Phone</span>
                  +1 (555) 123-4567
                </p>
                <p>
                  <span className="block text-white font-semibold mb-1">Address</span>
                  123 Pharmacy Lane<br />
                  Medical District, NY 10001
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6" action="https://formspree.io/f/mpqaqgna" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <input
                id="email"
                type="email" 
                name="email"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="your@email.com"
              />
              <ValidationError 
                prefix="Email" 
                field="email"
                errors={state.errors}
                className="text-red-400 text-sm mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="How can we help?"
              />
              <ValidationError 
                prefix="Message" 
                field="message"
                errors={state.errors}
                className="text-red-400 text-sm mt-1"
              />
            </div>

            <button 
              type="submit" 
              disabled={state.submitting}
              className={`w-full font-bold py-3 rounded-lg transition-colors ${
                state.submitting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {state.submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default ContactPage;
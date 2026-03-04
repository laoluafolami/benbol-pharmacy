import { Phone, Mail, MapPin, Clock, Send, Facebook, Instagram, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage('');

    try {
      const { error } = await supabase.from('contact_submissions').insert([formData]);

      if (error) throw error;

      setSubmitMessage('Thank you for contacting us! We will get back to you soon.');
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitMessage('Failed to send message. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Banner with Animation */}
      <section className="relative bg-gradient-to-br from-teal-600 via-blue-700 to-indigo-800 overflow-hidden py-12">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Floating Icons Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Phone className="absolute top-10 left-10 w-8 h-8 text-white/20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <Mail className="absolute top-20 right-20 w-10 h-10 text-white/20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <MessageCircle className="absolute bottom-10 left-1/4 w-6 h-6 text-white/20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <MapPin className="absolute bottom-20 right-1/3 w-7 h-7 text-white/20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-3 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white animate-fade-in">
              💬 We're Here to Help
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">Contact Us</h1>
            <p className="text-lg md:text-xl text-teal-50 leading-relaxed animate-fade-in">
              We're here to help. Reach out to us with any questions or concerns.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
                    <a href="tel:09167858304" className="text-teal-600 hover:text-teal-700 text-lg font-medium">
                      09167858304
                    </a>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Available during business hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                    <a
                      href="mailto:benbolglobal@gmail.com"
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      benbolglobal@gmail.com
                    </a>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
                    <p className="text-gray-700 dark:text-gray-300">Benbol Pharmacy</p>
                    <p className="text-gray-700 dark:text-gray-300">Vickie's Plaza, Lekki-Epe Expressway</p>
                    <p className="text-gray-700 dark:text-gray-300">Sun View 2nd gate Bus stop</p>
                    <p className="text-gray-700 dark:text-gray-300">Opposite Peace Garden & Crown Estates</p>
                    <p className="text-gray-700 dark:text-gray-300">Sangotedo, Lagos</p>
                    <a href="https://www.google.com/maps/search/?api=1&query=Benbol+Pharmacy+Vickie%27s+Plaza+Lekki-Epe+Expressway+Sun+View+2nd+gate+Bus+stop+Opposite+Peace+Garden+%26+Crown+Estates+Sangotedo+Lagos" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 text-sm mt-2 inline-block">
                      Get Directions →
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Business Hours</h3>
                    <div className="space-y-1 text-gray-700 dark:text-gray-300">
                      <p>Monday - Saturday: 8:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-teal-50 dark:bg-teal-900/30 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Emergency Contact</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  For Lagos State emergency medical services, call the main toll-free numbers <span className="font-semibold">767</span> or <span className="font-semibold">112</span>, which connect to LASAMBUS (Lagos State Ambulance Service) and LASEMA (Lagos State Emergency Management Agency) for medical and disaster response. You can also try the dedicated hotline <span className="font-semibold">123</span> for the Ministry of Health's Emergency Medical Services (LASEMS) or private services like Emergency Response Africa at <span className="font-semibold">080002255372</span>.
                </p>
              </div>

              <div className="mt-8 p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connect With Us</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Follow us on social media for health tips and updates</p>
                <div className="flex space-x-4">
                  <a href="https://facebook.com/benbolpharmacy" target="_blank" rel="noopener noreferrer" className="bg-teal-100 p-3 rounded-lg hover:bg-teal-200 transition-colors" aria-label="Facebook">
                    <Facebook className="w-6 h-6 text-teal-600" />
                  </a>
                  <a href="https://instagram.com/benbolpharmacy" target="_blank" rel="noopener noreferrer" className="bg-teal-100 p-3 rounded-lg hover:bg-teal-200 transition-colors" aria-label="Instagram">
                    <Instagram className="w-6 h-6 text-teal-600" />
                  </a>
                  <a href="https://twitter.com/benbolpharmacy" target="_blank" rel="noopener noreferrer" className="bg-teal-100 p-3 rounded-lg hover:bg-teal-200 transition-colors" aria-label="Twitter">
                    <Twitter className="w-6 h-6 text-teal-600" />
                  </a>
                  <a href="https://linkedin.com/company/benbolpharmacy" target="_blank" rel="noopener noreferrer" className="bg-teal-100 p-3 rounded-lg hover:bg-teal-200 transition-colors" aria-label="LinkedIn">
                    <Linkedin className="w-6 h-6 text-teal-600" />
                  </a>
                  <a href="https://wa.me/2349167858304" target="_blank" rel="noopener noreferrer" className="bg-teal-100 p-3 rounded-lg hover:bg-teal-200 transition-colors" aria-label="WhatsApp">
                    <MessageCircle className="w-6 h-6 text-teal-600" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Send Us a Message</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Fill out the form below and we'll get back to you shortly.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Prescription Question">Prescription Question</option>
                      <option value="Product Availability">Product Availability</option>
                      <option value="Insurance Question">Insurance Question</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    <Send className="w-5 h-5" />
                  </button>

                  {submitMessage && (
                    <div
                      className={`p-4 rounded-lg ${
                        submitMessage.includes('Thank you')
                          ? 'bg-green-50 text-green-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {submitMessage}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Find Us Here</h2>
            <div className="rounded-2xl overflow-hidden shadow-lg h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.3876234567!2d3.5789!3d6.4567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjcnMjQuMSJOIDPCsDM0JzQ0LjAiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Benbol Pharmacy Location"
              ></iframe>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
              Benbol Pharmacy, Vickie's Plaza, Lekki-Epe Expressway, Sun View 2nd gate Bus stop, Opposite Peace Garden & Crown Estates, Sangotedo, Lagos
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

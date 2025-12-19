import { Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function BlogPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const articles = [
    {
      title: 'Understanding Your Prescription Medications',
      excerpt:
        'Learn how to properly read prescription labels, understand dosage instructions, and manage your medications safely.',
      category: 'Medication Safety',
      date: 'December 1, 2024',
      readTime: '5 min read',
      image: 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'The Importance of Medication Adherence',
      excerpt:
        'Discover why taking medications as prescribed is crucial for treatment success and tips to help you stay on track.',
      category: 'Health Tips',
      date: 'November 28, 2024',
      readTime: '4 min read',
      image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Common Drug Interactions to Avoid',
      excerpt:
        'Essential information about potential drug interactions and how to prevent dangerous combinations.',
      category: 'Medication Safety',
      date: 'November 25, 2024',
      readTime: '6 min read',
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Choosing the Right Vitamins and Supplements',
      excerpt:
        'A comprehensive guide to selecting quality vitamins and supplements that meet your nutritional needs.',
      category: 'Wellness',
      date: 'November 20, 2024',
      readTime: '7 min read',
      image: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Managing Chronic Conditions with Medication',
      excerpt:
        'How to effectively manage chronic conditions like diabetes and hypertension through proper medication use.',
      category: 'Disease Management',
      date: 'November 15, 2024',
      readTime: '8 min read',
      image: 'https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Seasonal Allergies: Prevention and Treatment',
      excerpt:
        'Everything you need to know about managing seasonal allergies, from prevention to effective treatment options.',
      category: 'Health Tips',
      date: 'November 10, 2024',
      readTime: '5 min read',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Safe Storage of Medications at Home',
      excerpt:
        'Best practices for storing medications properly to maintain their effectiveness and keep your family safe.',
      category: 'Medication Safety',
      date: 'November 5, 2024',
      readTime: '4 min read',
      image: 'https://images.pexels.com/photos/4021773/pexels-photo-4021773.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Understanding Generic vs. Brand Name Medications',
      excerpt:
        'Learn about the differences between generic and brand name medications and how they can affect your treatment.',
      category: 'Medication Info',
      date: 'November 1, 2024',
      readTime: '6 min read',
      image: 'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Skincare Tips for Healthy, Radiant Skin',
      excerpt:
        'Expert advice on building an effective skincare routine and choosing the right products for your skin type.',
      category: 'Skincare',
      date: 'October 28, 2024',
      readTime: '7 min read',
      image: 'https://images.pexels.com/photos/3762882/pexels-photo-3762882.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  const categories = ['All', 'Medication Safety', 'Health Tips', 'Wellness', 'Disease Management', 'Skincare'];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!email.trim()) {
        setMessage('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, full_name: '' }]);

      if (error) {
        if (error.code === '23505') {
          setMessage('You are already subscribed!');
        } else {
          console.error('Supabase error:', error);
          setMessage('Failed to subscribe. Please try again later.');
        }
      } else {
        setMessage('Successfully subscribed to our newsletter!');
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Banner with Animation */}
      <section className="relative bg-gradient-to-br from-rose-600 via-pink-700 to-fuchsia-800 overflow-hidden py-12">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Floating Icons Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Calendar className="absolute top-10 left-10 w-8 h-8 text-white/20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <ArrowRight className="absolute top-20 right-20 w-10 h-10 text-white/20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <Calendar className="absolute bottom-10 left-1/4 w-6 h-6 text-white/20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <ArrowRight className="absolute bottom-20 right-1/3 w-7 h-7 text-white/20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-3 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white animate-fade-in">
              📚 Learn & Grow
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">Health Resources</h1>
            <p className="text-lg md:text-xl text-rose-50 leading-relaxed animate-fade-in">
              Expert advice and information to help you make informed decisions about your health
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  category === 'All'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <article
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full font-medium">
                      {article.category}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">{article.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{article.readTime}</span>
                    <button className="text-teal-600 font-semibold flex items-center space-x-1 hover:text-teal-700">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">Stay Informed</h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              Subscribe to our newsletter to receive the latest health tips and pharmacy updates directly in your
              inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message && (
              <p className={`text-center mt-4 text-sm ${message.includes('Success') ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-teal-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Have a Health Question?</h2>
          <p className="text-xl mb-8 text-teal-50 max-w-2xl mx-auto">
            Our pharmacists are here to provide expert guidance and answer your questions
          </p>
          <a
            href="tel:09167858304"
            className="inline-block bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Call Us: 09167858304
          </a>
        </div>
      </section>
    </div>
  );
}

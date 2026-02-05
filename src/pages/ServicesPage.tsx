import { Pill, Heart, Sparkles, Accessibility, Stethoscope, Droplet, CheckCircle, Syringe, TestTube, Activity, Thermometer, Baby, Briefcase } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  const services = [
    {
      icon: Pill,
      title: 'Prescription Medications',
      description: 'Expert prescription filling and medication management services.',
      image: 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Fast and accurate prescription processing',
        'Medication therapy management',
        'Drug interaction screening',
        'Generic medication alternatives',
        'Automatic refill reminders',
        'Insurance claims processing',
      ],
    },
    {
      icon: Heart,
      title: 'Over-the-Counter (OTC) Products',
      description: 'Comprehensive selection of OTC medications and health products.',
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Pain relief medications',
        'Cold and flu remedies',
        'Digestive health products',
        'Allergy medications',
        'First aid supplies',
        'Personal care items',
      ],
    },
    {
      icon: Sparkles,
      title: 'Vitamins & Supplements',
      description: 'Quality vitamins and nutritional supplements for optimal health.',
      image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Multivitamins for all ages',
        'Specialty supplements',
        'Herbal remedies',
        'Sports nutrition',
        'Prenatal vitamins',
        'Expert guidance on supplement use',
      ],
    },
    {
      icon: Accessibility,
      title: 'Walking Aids & Mobility Equipment',
      description: 'Comprehensive range of mobility solutions for enhanced independence.',
      image: 'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Walking canes and crutches',
        'Walkers and rollators',
        'Wheelchairs',
        'Mobility scooters',
        'Bath safety equipment',
        'Professional fitting and consultation',
      ],
    },
    {
      icon: Stethoscope,
      title: 'Pharmaceutical Counselling',
      description: 'Professional consultation services for all your medication needs.',
      image: 'https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'One-on-one medication consultations',
        'Medication review services',
        'Disease management guidance',
        'Side effect management',
        'Drug interaction counseling',
        'Adherence support and education',
      ],
    },
    {
      icon: Droplet,
      title: 'Skin Care Products',
      description: 'Premium skincare solutions for all skin types and concerns.',
      image: 'https://images.pexels.com/photos/3762882/pexels-photo-3762882.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Medical-grade skincare',
        'Anti-aging products',
        'Acne treatment solutions',
        'Moisturizers and cleansers',
        'Sun protection products',
        'Personalized skincare recommendations',
      ],
    },
    {
      icon: Syringe,
      title: 'Immunization Services',
      description: 'Comprehensive vaccination services for all ages.',
      image: 'https://images.pexels.com/photos/5863391/pexels-photo-5863391.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Flu shots and seasonal vaccines',
        'Travel vaccinations',
        'Childhood immunizations',
        'Adult vaccines (Shingles, Pneumonia)',
        'COVID-19 vaccinations',
        'Vaccine records and documentation',
      ],
    },
    {
      icon: TestTube,
      title: 'Health Screenings',
      description: 'Professional health monitoring and diagnostic services.',
      image: 'https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Blood pressure monitoring',
        'Blood glucose testing',
        'Cholesterol screening',
        'BMI and weight management',
        'Health risk assessments',
        'Regular health check-ups',
      ],
    },
    {
      icon: Activity,
      title: 'Chronic Disease Management',
      description: 'Specialized support for managing chronic health conditions.',
      image: 'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Diabetes management programs',
        'Hypertension monitoring',
        'Asthma and COPD support',
        'Heart disease management',
        'Medication adherence programs',
        'Lifestyle counseling',
      ],
    },
    {
      icon: Thermometer,
      title: 'Medical Equipment & Supplies',
      description: 'Quality medical devices and home healthcare equipment.',
      image: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Blood pressure monitors',
        'Glucose meters and test strips',
        'Thermometers and pulse oximeters',
        'Nebulizers and inhalers',
        'Compression stockings',
        'Wound care supplies',
      ],
    },
    {
      icon: Baby,
      title: 'Mother & Baby Care',
      description: 'Complete care solutions for mothers and infants.',
      image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Prenatal vitamins and supplements',
        'Baby formula and feeding supplies',
        'Diapers and baby care products',
        'Breastfeeding support products',
        'Postpartum care items',
        'Pediatric medications',
      ],
    },
    {
      icon: Briefcase,
      title: 'Corporate Wellness Programs',
      description: 'Customized health solutions for businesses and organizations.',
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'On-site health screenings',
        'Employee wellness programs',
        'Bulk medication management',
        'Health education seminars',
        'Occupational health services',
        'Corporate health packages',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Banner with Animation */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 overflow-hidden py-12">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Floating Icons Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Pill className="absolute top-10 left-10 w-8 h-8 text-white/20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <Stethoscope className="absolute top-20 right-20 w-10 h-10 text-white/20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <Heart className="absolute bottom-10 left-1/4 w-6 h-6 text-white/20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <Sparkles className="absolute bottom-20 right-1/3 w-7 h-7 text-white/20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-3 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white animate-fade-in">
              💊 What We Offer
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">Our Services</h1>
            <p className="text-lg md:text-xl text-emerald-50 leading-relaxed animate-fade-in">
              Comprehensive pharmaceutical services and quality health products tailored to meet your needs
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {services.map((service, index) => {
              const isReversed = index % 2 === 1;
              return (
                <div
                  key={index}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                >
                  <div className={isReversed ? 'lg:order-2' : ''}>
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-br from-teal-200/40 to-blue-200/40 dark:from-teal-900/30 dark:to-blue-900/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative overflow-hidden rounded-2xl shadow-lg">
                        <div className="aspect-[4/3]">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                            <service.icon className="w-6 h-6 text-teal-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={isReversed ? 'lg:order-1' : ''}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium mb-4">
                      <service.icon className="w-4 h-4" />
                      <span>Service {String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{service.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {service.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-start gap-2.5">
                          <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => onNavigate('appointment')}
                      className="group/btn inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all hover:shadow-lg hover:shadow-teal-600/20"
                    >
                      Book Consultation
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Additional Services & Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Insurance Assistance</h4>
                    <p className="text-gray-600 dark:text-gray-300">Help with insurance claims and coverage questions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Home Delivery</h4>
                    <p className="text-gray-600 dark:text-gray-300">Convenient medication delivery to your doorstep</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Medication Synchronization</h4>
                    <p className="text-gray-600 dark:text-gray-300">Align all your refills to one convenient date</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Medication Reviews</h4>
                    <p className="text-gray-600 dark:text-gray-300">Comprehensive review of all your medications</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Health Screenings</h4>
                    <p className="text-gray-600 dark:text-gray-300">Blood pressure and blood glucose monitoring</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Health Education</h4>
                    <p className="text-gray-600 dark:text-gray-300">Resources and guidance for better health</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-teal-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-teal-50 max-w-2xl mx-auto">
            Contact us today to learn more about our services or schedule a consultation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('appointment')}
              className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Book Consultation
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-teal-600 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

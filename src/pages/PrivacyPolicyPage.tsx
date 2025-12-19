import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-teal-600 via-blue-700 to-indigo-800 text-white py-8 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Shield className="absolute top-10 left-10 w-16 h-16 text-white/20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <Lock className="absolute top-20 right-20 w-12 h-12 text-white/20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
          <Eye className="absolute bottom-20 left-1/4 w-14 h-14 text-white/20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
          <Database className="absolute bottom-10 right-1/3 w-10 h-10 text-white/20 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 animate-fade-in">
            <span className="text-sm font-semibold">Your Privacy Matters</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">Privacy Policy</h1>
          <p className="text-base md:text-lg text-teal-100 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            How we protect and handle your personal information
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Last Updated:</strong> December 19, 2024
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Introduction</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Benbol Pharmacy ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us in any way.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-8 h-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">We may collect the following personal information:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Name and contact information (email, phone number, address)</li>
                  <li>Date of birth and age</li>
                  <li>Medical and prescription information</li>
                  <li>Insurance information</li>
                  <li>Payment and billing information</li>
                  <li>Account credentials (username and password)</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Health Information</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">As a pharmacy, we collect health-related information including:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Prescription details and medication history</li>
                  <li>Allergies and medical conditions</li>
                  <li>Healthcare provider information</li>
                  <li>Consultation notes and health assessments</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Automatically Collected Information</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">When you visit our website, we automatically collect:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <UserCheck className="w-8 h-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4">We use your information for the following purposes:</p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Pharmaceutical Services:</strong> To fill prescriptions, provide medication counseling, and manage your healthcare needs</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Communication:</strong> To contact you about appointments, prescription refills, and health-related updates</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Payment Processing:</strong> To process transactions and maintain billing records</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Service Improvement:</strong> To enhance our services and customer experience</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Legal Compliance:</strong> To comply with healthcare regulations and legal obligations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Marketing:</strong> To send newsletters and promotional materials (with your consent)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-8 h-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Information Sharing and Disclosure</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4">We may share your information with:</p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Healthcare Providers:</strong> Your doctors and healthcare professionals for coordinated care</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Insurance Companies:</strong> For claims processing and verification</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Service Providers:</strong> Third-party vendors who assist in our operations (payment processors, IT services)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Legal Authorities:</strong> When required by law or to protect rights and safety</span>
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4 font-semibold">
                We do not sell your personal information to third parties.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-8 h-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Data Security</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Secure servers and databases with access controls</li>
                <li>Regular security audits and updates</li>
                <li>Employee training on data protection</li>
                <li>Compliance with healthcare data protection standards</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-8 h-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Rights</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4">You have the right to:</p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Access your personal information</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Request correction of inaccurate information</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Request deletion of your information (subject to legal requirements)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Opt-out of marketing communications</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Request a copy of your data</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Withdraw consent for data processing</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Data Retention</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Healthcare records are retained in accordance with Nigerian healthcare regulations and professional standards.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Children's Privacy</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300">
                Our services are not directed to children under 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </div>
          </section>

          {/* Changes to Policy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. You are advised to review this policy periodically for any changes.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><strong>Benbol Pharmacy</strong></p>
                <p>Vickie's Plaza, Lekki-Epe Expressway</p>
                <p>Sun View 2nd gate Bus stop</p>
                <p>Opposite Peace Garden & Crown Estates</p>
                <p>Sangotedo, Lagos, Nigeria</p>
                <p className="mt-4"><strong>Email:</strong> benbolglobal@gmail.com</p>
                <p><strong>Phone:</strong> 09167858304</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

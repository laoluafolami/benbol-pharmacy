import { FileText, Scale, AlertTriangle, Shield, UserCheck, Ban } from 'lucide-react';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 text-white py-8 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Scale className="absolute top-10 left-10 w-16 h-16 text-white/20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <FileText className="absolute top-20 right-20 w-12 h-12 text-white/20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
          <Shield className="absolute bottom-20 left-1/4 w-14 h-14 text-white/20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
          <UserCheck className="absolute bottom-10 right-1/3 w-10 h-10 text-white/20 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 animate-fade-in">
            <span className="text-sm font-semibold">Legal Agreement</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">Terms of Use</h1>
          <p className="text-base md:text-lg text-purple-100 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Terms and conditions for using our services
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              <strong>Last Updated:</strong> December 19, 2024
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Important Notice</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Please read these Terms of Use carefully before using our services. By accessing or using our website and services, you agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our services.
                </p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Agreement to Terms</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                These Terms of Use ("Terms") constitute a legally binding agreement between you and Benbol Pharmacy ("we," "us," or "our") regarding your access to and use of our website, services, and products.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By using our services, you represent that you are at least 18 years of age and have the legal capacity to enter into this agreement. If you are using our services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
              </p>
            </div>
          </section>

          {/* Services Description */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Services</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4">Benbol Pharmacy provides:</p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">Prescription dispensing and medication management</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">Over-the-counter pharmaceutical products</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">Health consultations and pharmaceutical advice</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">Prescription refill services</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">Health and wellness products</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">Online appointment booking and consultation services</span>
                </li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <UserCheck className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Responsibilities</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Account Registration</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">When creating an account, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information as necessary</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Acceptable Use</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">You agree to use our services only for lawful purposes. You must not:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful or malicious code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt our services</li>
                  <li>Use our services for fraudulent purposes</li>
                  <li>Impersonate any person or entity</li>
                  <li>Collect or harvest user information without consent</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Medical Information</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  You are responsible for providing accurate medical information, including allergies, current medications, and medical conditions. Failure to provide accurate information may result in serious health consequences.
                </p>
              </div>
            </div>
          </section>

          {/* Prescriptions and Medications */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Prescriptions and Medications</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Valid Prescriptions</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    All prescription medications require a valid prescription from a licensed healthcare provider. We reserve the right to verify prescriptions and refuse to fill any prescription that appears fraudulent or inappropriate.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Professional Judgment</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Our pharmacists have the professional obligation and right to refuse to fill any prescription if they believe it may be harmful, inappropriate, or not in the patient's best interest.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Medication Information</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    While we provide medication information and counseling, this does not replace professional medical advice. Always consult your healthcare provider for medical advice and treatment.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Controlled Substances</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Controlled substances are subject to additional regulations and verification requirements. We comply with all applicable laws regarding controlled substances.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment and Pricing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Payment and Pricing</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">All prices are in Nigerian Naira (NGN) unless otherwise stated</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">Prices are subject to change without notice</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">Payment is due at the time of service or product delivery</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">We accept cash, bank transfers, and approved payment methods</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">Insurance claims are processed according to your insurance provider's terms</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Refunds and Returns */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Refunds and Returns</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Prescription Medications</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Due to health and safety regulations, prescription medications cannot be returned or refunded once dispensed, except in cases of pharmacy error.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Over-the-Counter Products</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Unopened, non-prescription products may be returned within 14 days of purchase with a valid receipt, subject to our return policy.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Defective Products</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    If you receive a defective or damaged product, please contact us immediately for a replacement or refund.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Intellectual Property</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                All content on our website, including text, graphics, logos, images, and software, is the property of Benbol Pharmacy or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                You may not reproduce, distribute, modify, or create derivative works from our content without our express written permission.
              </p>
            </div>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Disclaimer of Warranties</h2>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties that our services will be uninterrupted or error-free</li>
                <li>Warranties regarding the accuracy or completeness of content</li>
                <li>Warranties that defects will be corrected</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4 text-sm">
                Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions may not apply to you.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Limitation of Liability</h2>
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, BENBOL PHARMACY SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or use</li>
                <li>Personal injury or property damage</li>
                <li>Damages arising from your use or inability to use our services</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Our total liability shall not exceed the amount you paid for the specific service or product giving rise to the claim.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Indemnification</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300">
                You agree to indemnify, defend, and hold harmless Benbol Pharmacy, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                <li>Your use of our services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your provision of inaccurate or misleading information</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Ban className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Termination</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We reserve the right to suspend or terminate your access to our services at any time, without notice, for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Providing false information</li>
                <li>Abusive or threatening behavior</li>
                <li>Any other reason we deem appropriate</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Upon termination, your right to use our services will immediately cease, but provisions that should survive termination will remain in effect.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Governing Law</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300">
                These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Changes to These Terms</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300">
                We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the updated Terms on our website with a new "Last Updated" date. Your continued use of our services after such changes constitutes your acceptance of the new Terms.
              </p>
            </div>
          </section>

          {/* Severability */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Severability</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect. The invalid provision will be modified to the minimum extent necessary to make it valid and enforceable.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have questions about these Terms of Use, please contact us:
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

          {/* Acknowledgment */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Acknowledgment</h3>
              <p className="text-gray-700 dark:text-gray-300">
                BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF USE.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

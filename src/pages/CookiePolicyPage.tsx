import { Cookie, Settings, BarChart, Shield, Eye, CheckCircle } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 text-white py-8 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Cookie className="absolute top-10 left-10 w-16 h-16 text-white/20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <Settings className="absolute top-20 right-20 w-12 h-12 text-white/20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
          <BarChart className="absolute bottom-20 left-1/4 w-14 h-14 text-white/20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
          <Shield className="absolute bottom-10 right-1/3 w-10 h-10 text-white/20 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 animate-fade-in">
            <span className="text-sm font-semibold">Transparency First</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">Cookie Policy</h1>
          <p className="text-base md:text-lg text-orange-100 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Understanding how we use cookies and tracking technologies
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-orange-800 dark:text-orange-300">
              <strong>Last Updated:</strong> December 19, 2024
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Cookie className="w-8 h-8 text-orange-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What Are Cookies?</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, understanding how you use our site, and improving our services.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This Cookie Policy explains what cookies are, how we use them, the types of cookies we use, and how you can control your cookie preferences.
              </p>
            </div>
          </section>

          {/* Types of Cookies */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-8 h-8 text-orange-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Types of Cookies We Use</h2>
            </div>
            
            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 border-green-500">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Essential Cookies</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  <strong>Examples:</strong> Session cookies, authentication cookies, load balancing cookies
                </p>
                <p className="text-sm text-green-700 dark:text-green-400 mt-2 font-semibold">
                  ✓ Cannot be disabled
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 border-blue-500">
                <div className="flex items-center space-x-3 mb-3">
                  <Settings className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Functional Cookies</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  These cookies allow us to remember your preferences and choices, such as your language preference, region, or theme settings (light/dark mode).
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  <strong>Examples:</strong> Language preferences, theme settings, remembered login details
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-2 font-semibold">
                  ✓ Can be disabled (may affect functionality)
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 border-purple-500">
                <div className="flex items-center space-x-3 mb-3">
                  <BarChart className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics Cookies</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  <strong>Examples:</strong> Google Analytics, page visit tracking, user behavior analysis
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-400 mt-2 font-semibold">
                  ✓ Can be disabled
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 border-orange-500">
                <div className="flex items-center space-x-3 mb-3">
                  <Eye className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Marketing Cookies</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  These cookies track your online activity to help us deliver more relevant advertising and measure the effectiveness of our marketing campaigns.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  <strong>Examples:</strong> Social media cookies, advertising network cookies, retargeting cookies
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-400 mt-2 font-semibold">
                  ✓ Can be disabled
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How We Use Cookies</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4">We use cookies for the following purposes:</p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Authentication:</strong> To keep you logged in and secure your account</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Preferences:</strong> To remember your settings and choices</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Analytics:</strong> To understand how you use our website and improve user experience</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Security:</strong> To detect and prevent fraudulent activity</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Performance:</strong> To optimize website loading and functionality</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300"><strong>Marketing:</strong> To show you relevant content and advertisements</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Third-Party Cookies</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We may use third-party services that set cookies on our website. These include:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Google Analytics</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Helps us understand website traffic and user behavior
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Social Media Platforms</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Facebook, Instagram, Twitter for social sharing and integration
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Payment Processors</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Secure payment processing and fraud prevention
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-4 text-sm">
                These third parties have their own privacy policies. We recommend reviewing their policies to understand how they use cookies.
              </p>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-8 h-8 text-orange-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Managing Your Cookie Preferences</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Browser Settings</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Block all cookies</li>
                  <li>Accept only first-party cookies</li>
                  <li>Delete cookies after each browsing session</li>
                  <li>View and delete individual cookies</li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">
                  Note: Blocking cookies may affect your ability to use certain features of our website.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Browser-Specific Instructions</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
                  <p><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</p>
                  <p><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</p>
                  <p><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Opt-Out Options</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  You can opt out of specific types of cookies:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Google Analytics Opt-out Browser Add-on</a></span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span><strong>Advertising:</strong> <a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Your Online Choices</a></span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookie Duration */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Cookie Duration</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Session Cookies</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Temporary cookies that are deleted when you close your browser. Used for essential website functionality.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Persistent Cookies</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Remain on your device for a set period or until you delete them. Used to remember your preferences and improve your experience on return visits.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Updates to Policy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Updates to This Policy</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business practices. We will notify you of any significant changes by posting the updated policy on our website with a new "Last Updated" date.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Questions About Cookies?</h2>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have questions about our use of cookies, please contact us:
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

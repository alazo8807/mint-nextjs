import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BarChart2, CreditCard, DollarSign, LineChart } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-blue-600 text-white">
          <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                Take Control of Your Finances
              </h1>
              <p className="mt-4 text-xl sm:text-2xl">
                Track, budget, and achieve your financial goals with MintClone
              </p>
              <div className="mt-8 flex justify-center">
                <Link 
                  href="/transactions" 
                  className="rounded-md bg-white px-8 py-3 text-base font-medium text-blue-600 hover:bg-blue-50"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-600 text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<BarChart2 className="h-8 w-8" />}
                title="Expense Tracking"
                description="Easily track and categorize your expenses to understand your spending habits."
              />
              <FeatureCard 
                icon={<DollarSign className="h-8 w-8" />}
                title="Budgeting Tools"
                description="Create and manage budgets to help you stay on top of your financial goals."
              />
              <FeatureCard 
                icon={<CreditCard className="h-8 w-8" />}
                title="Bill Management"
                description="Never miss a payment with our bill tracking and reminder features."
              />
              <FeatureCard 
                icon={<LineChart className="h-8 w-8" />}
                title="Investment Tracking"
                description="Monitor your investments and track your portfolio performance over time."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-100 py-16 sm:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl text-gray-600 font-bold mb-4">Ready to Take Control?</h2>
            <p className="text-xl text-gray-600 mb-8">Get set up in a few steps and start enjoying the app</p>
            <Link 
              href="/transactions" 
              className="inline-block rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Start Your Financial Journey
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">MintClone</h3>
              <p className="mt-2 text-sm text-gray-400">© 2024 MintClone. All rights reserved.</p>
            </div>
            <nav className="w-full md:w-auto">
              <ul className="flex flex-wrap justify-center md:justify-end space-x-6">
                <li><Link href="#" className="text-sm hover:text-blue-400">About</Link></li>
                <li><Link href="#" className="text-sm hover:text-blue-400">Privacy</Link></li>
                <li><Link href="#" className="text-sm hover:text-blue-400">Terms</Link></li>
                <li><Link href="#" className="text-sm hover:text-blue-400">Contact</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white text-gray-700 p-6 rounded-lg shadow-md">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}


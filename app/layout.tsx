'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import ReactQueryProvider from './providers'
import Sidebar from '@/components/Layout/Sidebar'
import Header from '@/components/Layout/Header'
import MobileMenu from '@/components/Layout/MobileMenu'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <div className="min-h-screen bg-gray-50">
            {/* Sidebar for desktop - fixed position */}
            <Sidebar />

            {/* Main content area - offset for sidebar */}
            <div className="md:pl-64 flex flex-col flex-1 min-h-screen">
              {/* Sticky Header - fixed to top */}
              <div className="sticky top-0 z-40">
                <Header />
              </div>
              
              {/* Main content - scrollable area */}
              <main className="flex-1 overflow-y-auto">
                <div className="py-6">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    {children}
                  </div>
                </div>
              </main>

              {/* Footer at bottom */}
              <footer className="bg-white border-t border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  <p className="text-center text-sm text-gray-500">
                    Academic Management Dashboard © {new Date().getFullYear()}
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
import { Inter } from 'next/font/google'

import { AuthProvider } from './comps/authProvider'
import AuthGuard from './comps/authGuard'
import NavBar from './comps/navbar'
import Footer from './comps/footer'
import './globals.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ShopZen',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <NavBar />

          <AuthGuard>
            {children}
          </AuthGuard>

          <Footer />
        </body>
      </AuthProvider>
    </html>
  )
}

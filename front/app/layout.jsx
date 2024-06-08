import { Inter } from 'next/font/google'
import { AuthProvider } from './components/authContext'
import './globals.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Início - ShopZen ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <AuthProvider>
          <body className={inter.className}>
            {children}
          </body>
        </AuthProvider>  
    </html>
  )
}

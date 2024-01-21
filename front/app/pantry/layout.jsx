import { Inter } from 'next/font/google'
import '../globals.css'
import '../shop/page.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dispensa - ShopZen',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className={inter.className}>
            {children}
        </body>
    </html>
  )
}

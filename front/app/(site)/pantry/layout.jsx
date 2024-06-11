import { Inter } from 'next/font/google'
import '@app/app.css'
import Footer from '@comps/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dispensa - ShopZen',
}

export default function RootLayout({ children }) {
  return (
    <section>
      <main>
        {children}
      </main>

      <Footer></Footer>
    </section>
  )
}

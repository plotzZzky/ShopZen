import { Inter } from 'next/font/google'
import NavBar from '@comps/navbar'
import ShoppingBar from '@comps/shoppingBar'
import '@app/app.css'
import Footer from '@comps/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dispensa - ShopZen',
}

export default function RootLayout({ children }) {
  return (
    <section>
      <header>
        <NavBar></NavBar>
      </header>

      <main>
        {children}
      </main>

      <Footer></Footer>
    </section>
  )
}
import { Inter } from 'next/font/google'
import NavBar from '@comps/navbar'
import CartBar from '@comps/cartBar'
import Footer from '@comps/footer'
import '@app/app.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Listas - ShopZen',
}

export default function RootLayout({ children }) {
  return (
    <section>
      <header>
        <NavBar appbar={ShoppingBar}></NavBar>
      </header>

      <main>
        {children}
      </main>

      <Footer></Footer>
    </section>
  )
}

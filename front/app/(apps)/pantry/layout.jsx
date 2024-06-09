import { Inter } from 'next/font/google'
import NavBar from '@comps/navbar'
import PantryBar from '@comps/pantry/pantryBar'
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
        <NavBar appbar={PantryBar}></NavBar>
      </header>

      <main>
        {children}
      </main>

      <Footer></Footer>
    </section>
  )
}

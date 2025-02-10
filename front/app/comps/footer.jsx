'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faCartShopping } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {

  function goToGitHub() { router.push("https://github.com/plotzzzky") }

  return(
    <footer id="footer">
      <span className="brand"> ShopZen <FontAwesomeIcon icon={faCartShopping} /> </span>

      <div className='contacts'>

        <div>
          <a>Contato:</a>
          <span>
            <FontAwesomeIcon icon={faEnvelope}/> 
            contato@shopzen.com
          </span>
        </div>

        <div>
          <a>Desenvolvedor:</a>
          <span>
            <FontAwesomeIcon icon={faGithub}/> 
            github.com/plotzzzky
          </span>
        </div>

      </div>
    </footer>
  )
}
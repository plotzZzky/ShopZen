'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faCartShopping } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {

  function goToGitHub() { router.push("https://github.com/plotzzzky") }

  return(
    <footer id="footer">
      <span className="brand"> ShopZen <FontAwesomeIcon icon={faCartShopping} /> </span>

      <div className="align-footer">

        <div className="link" onClick={goToGitHub}>
          <FontAwesomeIcon icon={faEnvelope} />
          <a> contato@shopzen.com</a>
        </div>

        <div className="link" onClick={goToGitHub}>
          <FontAwesomeIcon icon={faEnvelope} />
          <a> financeiro@shopzen.com</a>
        </div>

        <div className="link" onClick={goToGitHub}>
          <FontAwesomeIcon icon={faGithub} />
          <a> dev@shopzen.com </a>
        </div>

      </div>
    </footer>
  )
}
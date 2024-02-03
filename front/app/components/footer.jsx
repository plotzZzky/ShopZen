'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

export default function Footer() {

  function goToGitHub() { router.push("https://github.com/plotzzzky") }

  return(
    <footer id="footer">
      <p className="link" onClick={goToGitHub}>
        <FontAwesomeIcon icon={faGithub} />
        <a> GitHub </a>
      </p>
    </footer>
  )
}
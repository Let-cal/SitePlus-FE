import * as React from 'react'
import ContactContent from "../components/ContactContent"
import { Header } from '../../all-site/Header'
import { Footer } from '../../all-site/Footer'

function ContactPage() {
  return (
    <div>
        <Header />
        <ContactContent />
        <Footer />
    </div>
  )
}

export default ContactPage
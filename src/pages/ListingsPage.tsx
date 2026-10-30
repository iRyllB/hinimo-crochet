import Footer from '../components/Footer'
import Header from '../components/Header'
import ProductListing from '../components/ProductListing'
import ContactOverlay from '../components/ContactOverlay'
import { getProducts, type Product } from '../lib/supabase'
import { useEffect, useState } from 'react'

function ListingsPage() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setError('The catalog could not be loaded right now.'))
  }, [])

  return (
    <div className="site listings-site" id="top">
      <Header
        onContact={() => setIsContactOpen(true)}
        onHome={() => { window.location.href = '/' }}
      />
      <main className="listings-page">
        <section className="content-section listings-heading">
          <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> GOOD THINGS, HANDMADE</p>
          <h1>THE TINY<br /><em>SHOP.</em></h1>
          <p>Browse the full collection of handmade crochet pieces. Found something you love? Contact me to ask about availability.</p>
        </section>
        <section className="content-section listings-section" id="contact">
          {error ? <p className="feedback-status feedback-status-error">{error}</p> : <ProductListing products={products} onContact={() => setIsContactOpen(true)} />}
        </section>
      </main>
      <Footer />
      <ContactOverlay isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  )
}

export default ListingsPage

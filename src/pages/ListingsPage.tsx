import Footer from '../components/Footer'
import Header from '../components/Header'
import ProductListing, { type Product } from '../components/ProductListing'

const products: Product[] = [
  { name: 'Sunny Daisy Bag', description: 'Hand-crocheted tote', price: '$48', color: 'pink' },
  { name: 'Sunny Daisy Bag', description: 'Hand-crocheted tote', price: '$48', color: 'pink' },
  { name: 'Sunny Daisy Bag', description: 'Hand-crocheted tote', price: '$48', color: 'pink' },
  { name: 'Berry Soft Bucket', description: 'Cloudy cotton yarn', price: '$36', color: 'yellow' },
  { name: 'Cozy Cup Sleeve', description: 'For slow mornings', price: '$18', color: 'green' },
  { name: 'Cozy Cup Sleeve', description: 'For slow mornings', price: '$18', color: 'green' },
  { name: 'Blooming Coasters', description: 'Set of four', price: '$28', color: 'coral' },
  { name: 'Blooming Coasters', description: 'Set of four', price: '$28', color: 'coral' },
  { name: 'Berry Soft Bucket', description: 'Cloudy cotton yarn', price: '$36', color: 'yellow' },
  { name: 'Berry Soft Bucket', description: 'Cloudy cotton yarn', price: '$36', color: 'yellow' },
  { name: 'Berry Soft Bucket', description: 'Cloudy cotton yarn', price: '$36', color: 'yellow' },
  { name: 'Berry Soft Bucket', description: 'Cloudy cotton yarn', price: '$36', color: 'yellow' },
]

function ListingsPage() {
  return (
    <div className="site listings-site" id="top">
      <Header />
      <main className="listings-page">
        <section className="content-section listings-heading">
          <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> GOOD THINGS, HANDMADE</p>
          <h1>THE TINY<br /><em>SHOP.</em></h1>
          <p>Browse the full collection of handmade crochet pieces. Found something you love? Contact me to ask about availability.</p>
        </section>
        <section className="content-section listings-section" id="contact">
          <ProductListing products={products} />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default ListingsPage

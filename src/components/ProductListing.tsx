import hinimoImage from '../assets/hinimo.png'
import type { Product } from '../lib/supabase'

type ProductListingProps = {
  products: Product[]
  onContact: () => void
}

function ProductListing({ products, onContact }: ProductListingProps) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className={`product-card product-card-${product.color} soft-reveal`} key={product.id}>
          <div className="product-image">
            <img className="product-image-photo" src={product.image_url || hinimoImage} alt={product.name} />
          </div>
          <div className="product-info">
            <div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
            <strong>${product.price.toFixed(2)}</strong>
          </div>
          <button className="product-contact" type="button" onClick={onContact}>
            Interested? Contact me <span aria-hidden="true">+</span>
          </button>
        </article>
      ))}
    </div>
  )
}

export default ProductListing

import { useState } from 'react'
import hinimoImage from '../assets/hinimo.png'
import type { Product } from '../lib/supabase'

type ProductListingProps = {
  products: Product[]
  onContact: () => void
}

function ProductListing({ products, onContact }: ProductListingProps) {
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; image: string } | null>(null)

  return (
    <>
      <div className="product-grid">
        {products.map((product) => (
          <article className={`product-card product-card-${product.color} soft-reveal`} key={product.id}>
            <button
              className="product-image"
              type="button"
              onClick={() => setSelectedProduct({ name: product.name, image: product.image_url || hinimoImage })}
              aria-label={`Enlarge ${product.name} image`}
            >
              <img className="product-image-photo" src={product.image_url || hinimoImage} alt="" />
              <span className="product-image-zoom" aria-hidden="true">⌕</span>
            </button>
            <div className="product-info">
              <div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <strong>₱{product.price.toFixed(2)}</strong>
            </div>
            <button className="product-contact" type="button" onClick={onContact}>
              Interested? Contact me <span aria-hidden="true">+</span>
            </button>
          </article>
        ))}
      </div>
      {selectedProduct && (
        <div className="product-image-overlay" role="presentation" onClick={() => setSelectedProduct(null)}>
          <section className="product-image-modal" role="dialog" aria-modal="true" aria-labelledby="product-image-title" onClick={(event) => event.stopPropagation()}>
            <button className="product-image-modal-close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Close enlarged image">×</button>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <h2 id="product-image-title">{selectedProduct.name}</h2>
          </section>
        </div>
      )}
    </>
  )
}

export default ProductListing

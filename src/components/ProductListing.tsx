export type Product = {
  name: string
  description: string
  price: string
  color: 'pink' | 'yellow' | 'green' | 'coral'
}

type ProductListingProps = {
  products: Product[]
  onContact: () => void
}

function ProductListing({ products, onContact }: ProductListingProps) {
  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <article className={`product-card product-card-${product.color}`} key={`${product.name}-${product.price}-${index}`}>
          <div className="product-image">
            <span className="image-placeholder">IMAGE<br />PLACEHOLDER</span>
          </div>
          <div className="product-info">
            <div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
            <strong>{product.price}</strong>
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

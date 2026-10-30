import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { AdminAccessPolicy } from '../domain/SiteRouter'
import { createProduct, deleteProduct, getContactMessages, getProducts, type Product, updateProduct, uploadProductImage } from '../lib/supabase'

const accessPolicy = new AdminAccessPolicy()
type ProductForm = Pick<Product, 'name' | 'description' | 'price' | 'color' | 'image_url'>
const emptyForm: ProductForm = { name: '', description: '', price: 0, color: 'pink', image_url: null }

function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    accessPolicy.canAccess().then((authorized) => {
      if (!authorized) {
        window.location.href = '/admin/login'
        return
      }
      setIsAuthorized(true)
      return Promise.all([getProducts(), getContactMessages()]).then(([loadedProducts, messages]) => {
        setProducts(loadedProducts)
        setUnreadMessageCount(messages.filter((message) => message.status === 'unread').length)
      })
    }).catch(() => setError('The product catalog could not be loaded.'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleSignOut = async () => {
    await accessPolicy.signOut()
    window.location.href = '/admin/login'
  }

  const handleImageChange = async (file: File | undefined) => {
    if (!file) return
    try {
      setError('')
      setIsSaving(true)
      const imageUrl = await uploadProductImage(file)
      setForm((current) => ({ ...current, image_url: imageUrl }))
    } catch {
      setError('The image could not be uploaded.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSaving(true)
    try {
      const savedProduct = editingId
        ? await updateProduct(editingId, form)
        : await createProduct(form)
      setProducts((current) => editingId ? current.map((product) => product.id === editingId ? savedProduct : product) : [...current, savedProduct])
      setForm(emptyForm)
      setEditingId(null)
    } catch {
      setError('The product could not be saved. Check your Supabase policies.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return
    try {
      await deleteProduct(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
      if (editingId === product.id) {
        setEditingId(null)
        setForm(emptyForm)
      }
    } catch {
      setError('The product could not be deleted.')
    }
  }

  if (isLoading || !isAuthorized) return null

  return (
    <div className="admin-layout">
      <AdminSidebar activeMenu="Product catalog" onSignOut={handleSignOut} unreadMessageCount={unreadMessageCount} />
      <main className="admin-main">
        <div className="admin-content admin-catalog-content">
          <div className="admin-heading-row">
            <div><p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> DIGITAL MAKES</p><h1>PRODUCT<br /><em>CATALOG.</em></h1></div>
            <button className="admin-add-button" type="button" onClick={() => { setEditingId(null); setForm(emptyForm) }}>+ ADD PRODUCT</button>
          </div>
          {error && <p className="admin-feedback admin-feedback-error" role="alert">{error}</p>}
          <form className="admin-product-form" onSubmit={handleSubmit}>
            <div className="admin-product-form-heading"><strong>{editingId ? 'EDIT PRODUCT' : 'ADD A PRODUCT'}</strong><span>Changes appear on the public catalog.</span></div>
            <label>PRODUCT NAME<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
            <label>DETAILS<input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /></label>
            <label>PRICE (PHP)<input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} required /></label>
            <label>COLOR<select value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value as Product['color'] })}><option value="pink">Pink</option><option value="yellow">Yellow</option><option value="green">Green</option><option value="coral">Coral</option></select></label>
            <label>IMAGE<input type="file" accept="image/*" onChange={(event) => handleImageChange(event.target.files?.[0])} /></label>
            <div className="admin-product-form-actions"><button className="admin-login-submit" type="submit" disabled={isSaving}>{isSaving ? 'SAVING...' : editingId ? 'UPDATE PRODUCT' : 'ADD PRODUCT'} <span>→</span></button>{editingId && <button className="admin-message-read-button" type="button" onClick={() => { setEditingId(null); setForm(emptyForm) }}>CANCEL</button>}</div>
          </form>
          <section className="admin-catalog-list" aria-label="Products">
            {products.map((product) => (
              <article className={`admin-catalog-item admin-catalog-item-${product.color}`} key={product.id}>
                <div className="admin-catalog-item-image">{product.image_url ? <img src={product.image_url} alt="" /> : <span>H</span>}</div>
                <div className="admin-catalog-item-info"><h2>{product.name}</h2><p>{product.description}</p><strong>₱{product.price.toFixed(2)}</strong></div>
                <div className="admin-catalog-item-actions"><button className="admin-message-button admin-message-open-button" type="button" onClick={() => { setEditingId(product.id); setForm({ name: product.name, description: product.description, price: product.price, color: product.color, image_url: product.image_url }) }}>EDIT</button><button className="admin-message-button admin-message-delete-button" type="button" onClick={() => handleDelete(product)}>DELETE</button></div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminProductsPage

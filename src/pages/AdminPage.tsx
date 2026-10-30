import { AdminAccessPolicy } from '../domain/SiteRouter'
import AdminSidebar from '../components/AdminSidebar'
import { useEffect, useState } from 'react'
import { deleteContactMessage, getContactMessages, type ContactMessage, updateContactMessageStatus } from '../lib/supabase'
import AdminMessageOverlay from '../components/AdminMessageOverlay'

const accessPolicy = new AdminAccessPolicy()

function AdminPage() {
  const [latestMessage, setLatestMessage] = useState<ContactMessage | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isDeletingMessage, setIsDeletingMessage] = useState(false)
  const [messageError, setMessageError] = useState('')

  useEffect(() => {
    accessPolicy.canAccess().then((authorized) => {
      if (!authorized) {
        window.location.href = '/admin/login'
        return
      }
      setIsAuthorized(true)
      return getContactMessages().then((messages) => setLatestMessage(messages[0] ?? null))
    }).catch(() => {
      window.location.href = '/admin/login'
    }).finally(() => setIsCheckingAccess(false))
  }, [])

  if (isCheckingAccess || !isAuthorized) return null

  const handleSignOut = async () => {
    await accessPolicy.signOut()
    window.location.href = '/admin/login'
  }

  const markLatestAsRead = async () => {
    if (!selectedMessage) return
    await updateContactMessageStatus(selectedMessage.id, 'read')
    setSelectedMessage({ ...selectedMessage, status: 'read' })
    setLatestMessage((current) => current?.id === selectedMessage.id ? { ...current, status: 'read' } : current)
  }

  const deleteLatestMessage = async () => {
    if (!selectedMessage || !window.confirm(`Delete the message from ${selectedMessage.name}? This cannot be undone.`)) return

    setMessageError('')
    setIsDeletingMessage(true)
    try {
      await deleteContactMessage(selectedMessage.id)
      setSelectedMessage(null)
      setLatestMessage((current) => current?.id === selectedMessage.id ? null : current)
    } catch {
      setMessageError('The message could not be deleted. Check your Supabase delete policy.')
    } finally {
      setIsDeletingMessage(false)
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar activeMenu="Dashboard" onSignOut={handleSignOut} />
      <main className="admin-main">
        <div className="admin-content">
          <div className="admin-heading-row">
            <div><p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> SUNDAY, SEPTEMBER 14</p><h1>GOOD MORNING,<br /><em>MISSY!</em></h1></div>
            <button className="admin-add-button" type="button">+ ADD SOMETHING</button>
          </div>
          <section className="admin-stat-grid" aria-label="Shop overview">
            <article className="admin-stat admin-stat-orange"><span>SALES THIS MONTH</span><strong>$4,280<small>.50</small></strong><p>Up 18% from August</p><i aria-hidden="true">▥</i></article>
            <article className="admin-stat admin-stat-pink"><span>WORKSHOP BOOKINGS</span><strong>42<small>/56</small></strong><p>14 lovely seats left</p><i aria-hidden="true">◌</i></article>
            <article className="admin-stat admin-stat-green"><span>CALCULATOR PROJECTS</span><strong>128</strong><p>Up 31% this week</p><i aria-hidden="true">〰</i></article>
            <article className="admin-stat admin-stat-yellow"><span>NEW MESSAGES</span><strong>04</strong><p>2 need a reply today</p><i aria-hidden="true">▢</i></article>
          </section>
          <section className="admin-panels">
            <article className="admin-panel admin-orders"><div className="admin-panel-heading"><span><i /> LATEST<h2>NEW ORDERS</h2></span><a href="/admin/dashboard">VIEW ALL →</a></div><div className="admin-table"><div className="admin-table-row admin-table-head"><span>ORDER</span><span>CUSTOMER</span><span>ITEMS</span><span>STATUS</span><span>TOTAL</span></div>{[['#CL-2048', 'Aria Park', '2 items', 'PACKING', '$76.00'], ['#CL-2047', 'Jamie Liu', '1 item', 'PAID', '$48.00'], ['#CL-2046', 'Vera Flores', '3 items', 'CUSTOM', '$145.00']].map((order) => <div className="admin-table-row" key={order[0]}>{order.map((cell, index) => <span className={index === 3 ? `status-${cell.toLowerCase()}` : ''} key={cell}>{cell}</span>)}</div>)}</div></article>
            <article className="admin-panel admin-stock"><div className="admin-panel-heading"><span><i /> NEEDS A LOOK<h2>LOW STOCK</h2></span><a href="/admin/dashboard">MANAGE →</a></div>{[['Buttercup yellow cotton', 'Yarn · 2 skeins left', 'REORDER', 'yellow'], ['Berry soft bucket', 'Finished good · 1 left', 'MAKE', 'pink'], ['8 mm bamboo hooks', 'Tools · 3 left', 'REORDER', 'green']].map((item) => <div className="stock-item" key={item[0]}><b className={`stock-dot ${item[3]}`} /><span><strong>{item[0]}</strong><small>{item[1]}</small></span><a href="/admin/dashboard">{item[2]}</a></div>)}</article>
            <article className="admin-panel admin-workshops"><div className="admin-panel-heading"><span><i /> THIS WEEK<h2>UPCOMING WORKSHOPS</h2></span><a href="/admin/dashboard">CALENDAR →</a></div>{[['18', 'Granny Square Social', 'Wed · 6:30 pm · with Missy', 'ALMOST FULL'], ['20', 'First Hook, First Loop', 'Fri · 5:00 pm · with Zoë', 'OPEN']].map((workshop) => <div className="workshop-item" key={workshop[0]}><b>{workshop[0]}<small>SEP</small></b><span><strong>{workshop[1]}</strong><small>{workshop[2]}</small></span><em>{workshop[3]}</em></div>)}</article>
            <article className="admin-panel admin-message"><div className="admin-panel-heading"><span><i /> INBOX HIGHLIGHT</span></div><blockquote>{latestMessage ? `“${latestMessage.message}”` : 'No new notes yet. Your inbox highlights will appear here.'}</blockquote><small>{latestMessage ? `— ${latestMessage.name}, received ${new Date(latestMessage.created_at).toLocaleString()}` : 'Check back when someone sends a note.'}</small>{messageError && <p className="admin-feedback admin-feedback-error" role="alert">{messageError}</p>}{latestMessage ? <div className="admin-message-actions"><button className="admin-message-button admin-message-open-button" type="button" onClick={() => setSelectedMessage(latestMessage)}>OPEN MESSAGE →</button><button className="admin-message-button admin-message-delete-button" type="button" onClick={deleteLatestMessage} disabled={isDeletingMessage}>{isDeletingMessage ? 'DELETING...' : 'DELETE'}</button></div> : <a className="admin-message-button admin-message-open-button" href="/admin/inbox">OPEN INBOX →</a>}</article>
          </section>
        </div>
      </main>
      {selectedMessage && <AdminMessageOverlay message={selectedMessage} onClose={() => setSelectedMessage(null)} onMarkAsRead={markLatestAsRead} onDelete={deleteLatestMessage} isDeleting={isDeletingMessage} />}
    </div>
  )
}

export default AdminPage

import ProductListing from './ProductListing'
import muffin from '../assets/muffin.png'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { submitContactMessage } from '../lib/supabase'
import FeedbackToast from './FeedbackToast'

type MainSectionsProps = {
  onContact: () => void
}

function MainSections({ onContact }: MainSectionsProps) {
  const [isSending, setIsSending] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (!toast) return

    const timeout = window.setTimeout(() => setToast(null), 4800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const handleFeedbackSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSending(true)
    setFeedback(null)
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      await submitContactMessage({
        name: String(formData.get('name') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        message: String(formData.get('message') ?? '').trim(),
      })
      form.reset()
      const successMessage = 'Your little note is on its way. Thank you!'
      setFeedback({ type: 'success', message: successMessage })
      setToast({ type: 'success', message: successMessage })
    } catch {
      const errorMessage = 'Your note could not be sent. Please try again in a moment.'
      setFeedback({ type: 'error', message: errorMessage })
      setToast({ type: 'error', message: errorMessage })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      {toast && <FeedbackToast type={toast.type} message={toast.message} />}
      <section className="content-section shop-section" id="shop">
        <div className="section-heading">
          <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> GOOD THINGS, HANDMADE</p>
          <h2>THE TINY<br />SHOP.</h2>
        </div>
        <ProductListing products={[
          { name: 'Sunny Daisy Bag', description: 'Hand-crocheted tote', price: '$48', color: 'pink' },
          { name: 'Berry Soft Bucket', description: 'Cloudy cotton yarn', price: '$36', color: 'yellow' },
          { name: 'Cozy Cup Sleeve', description: 'For slow mornings', price: '$18', color: 'green' },
          { name: 'Blooming Coasters', description: 'Set of four', price: '$28', color: 'coral' },
        ]} onContact={onContact} />
        <div className="shop-summary">
          <div className="summary-label"><span className="eyebrow-dot" aria-hidden="true" /><span>YOU LIKE IT?</span><strong>VIEW MORE AVAILABLE LISTINGS</strong></div>
          <p>More handmade pieces are waiting to be discovered.</p>
          <a className="summary-button" href="/listings">VIEW MORE <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="content-section worth-section" id="about">
        <div className="worth-art soft-reveal" aria-hidden="true">
          <img className="worth-art-image" src={muffin} alt="" />
        </div>
        <div className="worth-copy">
          <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> HI, I'M MISSY</p>
          <h2>MADE WITH<br /><em>HEART.</em></h2>
          <p className="large-copy">Hinimo started at my kitchen table, with one orange hook and an unruly pile of yarn.</p>
          <p>Now it’s a soft little corner of the internet for makers who want to learn, play, and make things that feel like a hug. There are no perfect stitches here — just colorful experiments and friends who cheer you on.</p>
          <p className="custom-work-note">Looking for something made just for you? I also accept custom crochet requests.</p>
          <button className="hero-button hero-button-primary" type="button" onClick={onContact}>ASK ABOUT CUSTOM WORK <span aria-hidden="true">→</span></button>
        </div>
      </section>

      <section className="content-section contact-section" id="contact">
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> SAY HI</p>
          <h2>LEAVE A<br /><em>NOTE.</em></h2>
          <p className="feedback-intro">Have a question, a workshop idea, or something kind to share? I’d love to hear from you.</p>
        </div>
        <form className="feedback-form soft-reveal" onSubmit={handleFeedbackSubmit}>
          <label htmlFor="feedback-name">YOUR NAME</label>
          <input id="feedback-name" name="name" type="text" placeholder="Your lovely name" required />
          <label htmlFor="feedback-email">EMAIL ADDRESS</label>
          <input id="feedback-email" name="email" type="email" placeholder="you@example.com" required />
          <label htmlFor="feedback-message">YOUR MESSAGE</label>
          <textarea id="feedback-message" name="message" placeholder="Tell me what's on your mind..." required />
          {feedback && <p className={`feedback-status feedback-status-${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}
          <button className="hero-button hero-button-primary" type="submit" disabled={isSending}>{isSending ? 'SENDING...' : 'SEND A LITTLE NOTE'} <span aria-hidden="true">→</span></button>
        </form>
      </section>
    </>
  )
}

export default MainSections

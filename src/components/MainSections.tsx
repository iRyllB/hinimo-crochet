import ProductListing from './ProductListing'
import muffin from '../assets/muffin.png'

function MainSections() {
  return (
    <>
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
        ]} />
        <div className="shop-summary">
          <div className="summary-label"><span className="eyebrow-dot" aria-hidden="true" /><span>YOU LIKE IT?</span><strong>VIEW MORE AVAILABLE LISTINGS</strong></div>
          <p>More handmade pieces are waiting to be discovered.</p>
          <a className="summary-button" href="/listings">VIEW MORE <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="content-section worth-section" id="about">
        <div className="worth-art" aria-hidden="true">
          <img className="worth-art-image" src={muffin} alt="" />
        </div>
        <div className="worth-copy">
          <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> HI, I'M MIA</p>
          <h2>MADE WITH<br /><em>HEART.</em></h2>
          <p className="large-copy">Hinimo started at my kitchen table, with one orange hook and an unruly pile of yarn.</p>
          <p>Now it’s a soft little corner of the internet for makers who want to learn, play, and make things that feel like a hug. There are no perfect stitches here — just colorful experiments and friends who cheer you on.</p>
        </div>
      </section>

      <section className="content-section contact-section" id="contact">
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> SAY HI</p>
          <h2>LEAVE A<br /><em>NOTE.</em></h2>
          <p className="feedback-intro">Have a question, a workshop idea, or something kind to share? I’d love to hear from you.</p>
        </div>
        <form className="feedback-form" action="mailto:hello@hinimocrochet.com" method="post" encType="text/plain">
          <label htmlFor="feedback-name">YOUR NAME</label>
          <input id="feedback-name" name="name" type="text" placeholder="Your lovely name" required />
          <label htmlFor="feedback-email">EMAIL ADDRESS</label>
          <input id="feedback-email" name="email" type="email" placeholder="you@example.com" required />
          <label htmlFor="feedback-message">YOUR MESSAGE</label>
          <textarea id="feedback-message" name="message" placeholder="Tell me what's on your mind..." required />
          <button className="hero-button hero-button-primary" type="submit">SEND A LITTLE NOTE <span aria-hidden="true">→</span></button>
        </form>
      </section>
    </>
  )
}

export default MainSections

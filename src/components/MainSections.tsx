import ProductListing from './ProductListing'
import muffin from '../assets/muffin.png'

const values = [
  ['HANDMADE', 'Every stitch is made with patience, care, and a little bit of joy.'],
  ['COLORFUL', 'Bright, playful pieces made to bring a soft spark to everyday life.'],
  ['KIND', 'We choose thoughtful materials and slow, intentional making.'],
]

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
          <a className="text-link" href="#contact">READ OUR WHOLE STORY</a>
        </div>
      </section>

      <section className="content-section about-section">
        <div className="section-heading centered">
          <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> THE HINIMO WAY</p>
          <h2>GOOD THINGS<br /><em>TAKE TIME.</em></h2>
        </div>
        <div className="values-grid">
          {values.map(([title, description]) => (
            <article className="value-card" key={title}>
              <span className="value-number">0{values.findIndex(([item]) => item === title) + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <div className="about-details">
          <article>
            <h3>LEARN THE LOOP</h3>
            <p>Simple guides, playful experiments, and gentle encouragement for every level.</p>
          </article>
          <article>
            <h3>MAKE IT YOURS</h3>
            <p>Choose your colors, try a new texture, and let every project carry a little personality.</p>
          </article>
          <article>
            <h3>SHARE THE JOY</h3>
            <p>Finished something you love? Bring it to the community and cheer on another maker.</p>
          </article>
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

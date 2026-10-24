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
      </section>

      <section className="content-section contact-section" id="contact">
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> COME SAY HI</p>
          <h2>LET'S MAKE<br /><em>SOMETHING.</em></h2>
        </div>
        <div className="contact-copy">
          <p>Have a question, a custom idea, or just want to share some crochet joy?</p>
          <a className="hero-button hero-button-primary" href="mailto:hello@hinimocrochet.com">SAY HELLO <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </>
  )
}

export default MainSections

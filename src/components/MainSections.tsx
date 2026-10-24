import ProductListing from './ProductListing'

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
          <a className="text-link shop-all-link" href="#contact">VIEW ALL PIECES →</a>
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

      <section className="content-section worth-section" id="worth">
        <div className="worth-copy">
          <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> WHAT WE BELIEVE</p>
          <h2>MADE WITH<br /><em>HEART.</em></h2>
          <p className="large-copy">Hinimo started at a kitchen table, with colorful yarn, patient hands, and a wish to make the everyday feel a little more joyful.</p>
          <p>Now it is a soft little corner of the internet for slow craft, kind choices, and handmade things that feel like a warm hug.</p>
          <a className="text-link" href="#about">READ OUR WHOLE STORY →</a>
        </div>
        <div className="worth-note"><span>TAKE IT<br />SLOW</span><strong>✿</strong></div>
      </section>

      <section className="content-section about-section" id="about">
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

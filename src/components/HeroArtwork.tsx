import weBareBear from '../assets/webarebear.png'

function HeroArtwork() {
  return (
    <div
      className="hero-art"
      aria-label="A cheerful crocheted bear relaxing on an orange blanket"
      role="img"
    >
      <img className="hero-art-image" src={weBareBear} alt="A crocheted bear relaxing with yarn" />
    </div>
  )
}

export default HeroArtwork

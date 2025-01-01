// CO Springs Mag/public/components/CtaBar.js
export class CtaBarComponent {
  constructor() {
    this.template = `
      <section id="advertise" class="bg-white">
        <div class="dccontainer">
          <div class="dclayout flex flex-col-reverse md:flex-row justify-between pb-7 pt-7">
            <div class="md:w-10">
              <h3 class="">Reach your Community</h3>
              <h6>Photography. Clean Layouts. Eyeballs</h6>
              <p>
                Advertise with us. lorem ipsum datum. lorem ipsum datum lorem
                ipsum datum lorem ipsum datum lorem ipsum datum lorem ipsum datum
                lorem ipsum datum lorem ipsum datum
              </p>
              <a
                href="#"
                class="link border-b-2 border-whiskey-400 text-mercury-950"
                >Advertise with us</a
              >
            </div>
            <img src="placeholder.svg" class="mb-4 md:mb-0 md:h-9 md:w-8 object-cover" />
          </div>
        </div>
      </section>
    `
  }

  initialize() {
    const ctaBarContainer = document.getElementById('cta-bar-container')
    if (!ctaBarContainer) {
      console.error('CTA Bar container not found!')
      return
    }

    ctaBarContainer.innerHTML = this.template
  }
}

export default CtaBarComponent

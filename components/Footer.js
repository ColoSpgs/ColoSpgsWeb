// CO Springs Mag/public/components/Footer.js
export class FooterComponent {
  constructor() {
    this.template = `
      <section class="bg-mercury-950 text-white" id="footer">
        <div class="dccontainer">
          <div class="dclayout flex flex-col gap-y-6 md:gap-y-0 md:flex-row justify-between">
            <div class="flex flex-col gap-y-1">
              <img src="img/placeholder.png" class="mb-4 size-8" />
              <h4 class="text-white">Subscribe Today</h4>
              <a href="#" class="link text-white/70">Digital Subscription. $10 a month</a>
              <a href="#" class="link text-white/70">Print Subscription. $10 a month.</a>
              <a href="#" class="link text-white/70">Print & Digital Subscription. $15 a month.</a>
            </div>
            <div>
              <h5 class="mb-4 md:mb-5 size-min border-b-2 border-white pb-1 text-white">Colo|Springs</h5>
              <div class="grid grid-flow-col-dense grid-cols-2 grid-rows-auto md:flex md:flex-row gap-4 md:gap-5">
                <div class="flex flex-col gap-y-1">
                  <h6 class="text-white">About</h6>
                  <a href="/About.html" class="link text-white/70 transition-all duration-200">Staff</a>
                  <a href="/About.html" class="link text-white/70 transition-all duration-200">Letter from Editor</a>
                </div>
                <div class="col-start-2 row-span-2 md:row-auto flex flex-col gap-y-1">
                  <h6 class="text-white">Articles</h6>
                  <a href="#" class="link text-white/70 transition-all duration-200">Profiles</a>
                  <a href="#" class="link text-white/70 transition-all duration-200">City</a>
                  <a href="#" class="link text-white/70 transition-all duration-200">Wellness</a>
                  <a href="#" class="link text-white/70 transition-all duration-200">Lifestyle</a>
                  <a href="#" class="link text-white/70 transition-all duration-200">Culture</a>
                  <a href="#" class="link text-white/70 transition-all duration-200">Sports</a>
                </div>
                <div class=" flex flex-col gap-y-1">
                  <h6 class="text-white">Connect</h6>
                  <a href="/About.html" class="link text-white/70 transition-all duration-200">Advertise</a>
                  <a href="/About.html" class="link text-white/70 transition-all duration-200">Write for us</a>
                  <a href="/About.html" class="link text-white/70 transition-all duration-200">Letters to Editor</a>
                  <a href="/TopDocs.html" class="link text-white/70 transition-all duration-200">Top Docs</a>
                  <a href="/TopDentists.html" class="link text-white/70 transition-all duration-200">Top Dentists</a>
                  <a href="/TopAttorneys.html" class="link text-white/70 transition-all duration-200">Top Attorneys</a>
                </div>
              </div>
            </div>
          </div>
          <div class="dclayout border-t-2 border-white py-2 text-center text-sm text-white">
            <p class="mb-0">
              Copyright @ Colorado Springs Magazine. Designed and Built with love by
              <a href="" class="text-aliceblue-400 transition-all duration-200 hover:text-aliceblue-300">TrueWind Data Systems</a>.
            </p>
          </div>
        </div>
      </section>
    `
  }

  initialize() {
    const footerContainer = document.getElementById('footer-container')
    if (!footerContainer) {
      console.error('Footer container not found!')
      return
    }

    footerContainer.innerHTML = this.template
  }
}

export default FooterComponent

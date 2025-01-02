export class NavigationComponent {
  constructor() {
    this.template = `
      <nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
        <div class="dccontainer">
          <div class="relative">
            <!-- Mobile menu button -->
            <div class="absolute ps-0 pt-3 md:hidden">
              <button
                id="mobile-menu-button"
                class="shadow-sm p-1 bg-mercury-200 text-white hover:text-whiskey-300 focus:text-whiskey-300 focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path
                    class="hidden"
                    id="menu-open"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                  <path
                    class=""
                    id="menu-closed"
                    fill-rule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                </svg>
              </button>
            </div>

            <!-- Desktop menu -->
            <div class="navbar hidden mx-auto md:flex md:justify-between md:space-x-4">
              <a
                href="Index.html"
                class="navlink font-abril text-lg font-bold normal-case tracking-normal pt-1"
                ><img src="/img/ColoSpgsLogoBlackHiRes-1.png" alt="Springs Logo" class="h-4 w-auto" /></a
              >
              <div class="pt-1 md:flex md:space-x-4">
                <a href="About.html" class="navlink">About</a>
                <a href="Issues.html" class="navlink">Issues</a>
                <a href="Articles.html" class="navlink">Articles</a>

                <!-- Best of Springs Dropdown -->
                <div class="group relative -mt-1 inline-block">
                  <button class="navlink inline-flex items-center">
                    <span class="">Find It Yesterday</span>
                    <svg
                      class="ml-1 h-2 w-2 transform transition-transform duration-300 group-hover:rotate-180"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>

                  <!-- Dropdown Menu -->
                  <div
                    class="invisible absolute right-0 mt-2 w-7 origin-top-right bg-white opacity-0 transition-all duration-200 shadow-sm group-hover:visible group-hover:opacity-100"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabindex="-1"
                  >
                    <div class="py-1" role="none">
                      <a
                        href="TopDocs.html"
                        class="hover:bg-whiskey-50 hover:text-whiskey-500 block px-4 py-2 text-sm text-gray-700 transition-colors duration-150"
                        >Top Doctors</a
                      >
                      <a
                        href="TopAttorneys.html"
                        class="hover:bg-whiskey-50 hover:text-whiskey-500 block px-4 py-2 text-sm text-gray-700 transition-colors duration-150"
                        >Top Attorneys</a
                      >
                      <a
                        href="TopDentists.html"
                        class="hover:bg-whiskey-50 hover:text-whiskey-500 block px-4 py-2 text-sm text-gray-700 transition-colors duration-150"
                        >Top Dentists</a
                      >
                    </div>
                  </div>
                </div>
                <!-- <a href="SignIn.html" class="navlink text-whiskey-500">Subscribe | Log In</a> -->
                <div class="flex flex-row items-center justify-between gap-x-2 -mt-1">
                  <a href="" class="text-mercury-600 hover:text-whiskey-300">
                    <svg class="size-3" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fill-rule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                  <a href="" class="text-mercury-600 hover:text-whiskey-300"
                    ><svg class="size-3" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fill-rule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                  <a href="" class="text-mercury-600 hover:text-whiskey-300">
                    <svg class="size-3" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile menu -->
          <div id="mobile-menu" class="hidden md:hidden">
            <div class="flex flex-col space-y-3 px-2 pb-4 pt-6">
              <a href="Index.html" class="navlink">Home</a>
              <a href="About.html" class="navlink">About</a>
              <a href="Issues.html" class="navlink">Issues</a>
              <a href="Articles.html" class="navlink">Articles</a>
              <!-- Mobile Best of Springs menu -->
              <div x-data="{ open: false }" class="relative">
                <button
                  @click="open = !open"
                  class="flex w-full items-center justify-between navlink"
                >
                  <span>Best of the Springs</span>
                  <svg
                    class="h-3 w-3 transform transition-transform duration-200"
                    :class="{'rotate-180': open}"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>

                <div
                  x-show="open"
                  class="mt-2 space-y-2 px-4"
                >
                  <a href="TopDocs.html" class="block text-gray-700 hover:text-whiskey-500">Top Doctors</a>
                  <a href="TopAttorneys.html" class="block text-gray-700 hover:text-whiskey-500">Top Attorneys</a>
                  <a href="TopDentists.html" class="block text-gray-700 hover:text-whiskey-500">Top Dentists</a>
                </div>
              </div>

              <!-- <a href="SignIn.html" class="navlink text-whiskey-500">Subscribe | Log In</a> -->
            </div>
          </div>
        </div>
      </nav>
    `
  }

  initialize() {
    const navContainer = document.getElementById('navigation-container')
    if (!navContainer) {
      console.error('Navigation container not found!')
      return
    }

    navContainer.innerHTML = this.template
    this.initializeMobileMenu()
    this.highlightCurrentPage()
  }

  highlightCurrentPage() {
    const currentPath = window.location.pathname
    const filename = currentPath.split('/').pop().toLowerCase()
    const navLinks = document.querySelectorAll('.navlink')

    // Skip if we're on index.html or root path
    if (filename === '' || filename === 'index.html') {
      return
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute('href')?.toLowerCase()

      if (href && !href.includes('index.html')) {
        // Exclude index.html links
        if (href.includes(filename)) {
          link.classList.add('active')
        } else {
          link.classList.remove('active')
        }
      }
    })
  }

  initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button')
    const mobileMenu = document.getElementById('mobile-menu')
    const menuOpen = document.getElementById('menu-open')
    const menuClosed = document.getElementById('menu-closed')

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden')
        menuOpen?.classList.toggle('hidden')
        menuClosed?.classList.toggle('hidden')
      })

      // Close mobile menu when clicking outside
      document.addEventListener('click', (event) => {
        if (
          !mobileMenu.contains(event.target) &&
          !mobileMenuButton.contains(event.target)
        ) {
          mobileMenu.classList.add('hidden')
          menuOpen?.classList.add('hidden')
          menuClosed?.classList.remove('hidden')
        }
      })
    }
  }
}

export default NavigationComponent

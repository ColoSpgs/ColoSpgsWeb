// best-of-springs.js
import supabase from './supabase.js'

class BestOfSprings {
  constructor() {
    this.cardsContainer = document.getElementById('best-of-the-springs-cards')
    this.filtersContainer = document.getElementById(
      'best-of-the-springs-filters',
    )
    this.currentType = 'doctor' // Default to showing doctors first
    this.CARDS_TO_SHOW = 10

    this.initializeFilters()
    this.fetchAndDisplayCards()
  }

  initializeFilters() {
    // Get filter links
    const doctorsLink = document.getElementById('best-of-the-springs-doctors')
    const dentistsLink = document.getElementById('best-of-the-springs-dentists')
    const lawyersLink = document.getElementById('best-of-the-springs-lawyers')

    // Add click listeners to filter links
    doctorsLink?.addEventListener('click', (e) => {
      e.preventDefault()
      this.currentType = 'doctor'
      this.updateActiveLink(doctorsLink)
      this.fetchAndDisplayCards()
    })

    dentistsLink?.addEventListener('click', (e) => {
      e.preventDefault()
      this.currentType = 'dentist'
      this.updateActiveLink(dentistsLink)
      this.fetchAndDisplayCards()
    })

    lawyersLink?.addEventListener('click', (e) => {
      e.preventDefault()
      this.currentType = 'attorney' // Assuming lawyers and attorneys are the same
      this.updateActiveLink(lawyersLink)
      this.fetchAndDisplayCards()
    })

    // Set initial active state
    this.updateActiveLink(doctorsLink)
  }

  updateActiveLink(activeLink) {
    // Remove active class from all links
    const links = [
      'best-of-the-springs-doctors',
      'best-of-the-springs-dentists',
      'best-of-the-springs-lawyers',
    ].map((id) => document.getElementById(id))

    links.forEach((link) => {
      if (link) {
        link.querySelector('h5').classList.remove('text-whiskey-400')
        link.querySelector('h5').classList.add('text-mercury-950')
      }
    })

    // Add active class to clicked link
    if (activeLink) {
      activeLink.querySelector('h5').classList.remove('text-mercury-950')
      activeLink.querySelector('h5').classList.add('text-whiskey-400')
    }
  }

  async fetchAndDisplayCards() {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .contains('type', [this.currentType])
        .limit(this.CARDS_TO_SHOW)
        .order('last_name', { ascending: true })

      if (error) throw error

      this.renderCards(profiles)
    } catch (error) {
      console.error('Error fetching profiles:', error)
      this.cardsContainer.innerHTML =
        '<div class="col-span-full text-center py-4">Error loading profiles. Please try again later.</div>'
    }
  }

  renderCards(profiles) {
    if (!profiles?.length) {
      this.cardsContainer.innerHTML =
        '<div class="col-span-full text-center py-4">No profiles found.</div>'
      return
    }
    const cards = profiles
      .map((profile) => {
        // Determine specialties based on profile type
        let specialties = []
        if (this.currentType === 'doctor') {
          specialties = profile.specialty || ['General Practice']
        } else if (this.currentType === 'attorney') {
          specialties = profile.legal_specialties || ['General Practice']
        } else if (this.currentType === 'dentist') {
          specialties = profile.dentist_specialties || ['General Dentistry']
        }

        // Add appropriate title prefix based on type
        let namePrefix = ''
        if (this.currentType === 'doctor' || this.currentType === 'dentist') {
          namePrefix = 'Dr. '
        }

        return `
        <a href="/Profile.html?id=${profile.id}" class="card group">
              <div>
               <img src="${profile.profile_pic_link ? `${profile.profile_pic_link}?height=233&quality=10&resize=cover` : '/placeholder.svg'}"
                    alt="${profile.first_name} ${profile.last_name}"
                    class="mb-2 h-7 md:h-8 w-full object-cover"/>
               <p class="mb-1 text-mercury-950 font-medium group-hover:text-whiskey-400">
                 ${namePrefix}${profile.first_name} ${profile.last_name}
               </p>
               <p class="text-mercury-700">${profile.bizpractice_name || ''}</p>
             </div>
             <div class="mb-0">
               <h6 class="text-sm text-mercury-400 mb-2">${specialties.join(', ')}</h6>
             </div>
           </a>
         `
      })
      .join('')

    this.cardsContainer.innerHTML = cards
  }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  new BestOfSprings()
})

export default BestOfSprings

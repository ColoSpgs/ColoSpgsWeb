// doctor-filters.js
import supabase from './supabase.js'

class DoctorFilters {
  constructor() {
    this.filterContainer = document.getElementById('filters')
    this.selectedSpecialty = null
    this.specialties = []
    this.initializeFilters()
  }

  async initializeFilters() {
    try {
      await this.fetchSpecialties()
      this.createDropdown()
      this.setupEventListeners()
    } catch (error) {
      console.error('Error initializing filters:', error)
    }
  }

  async fetchSpecialties() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('specialty')
        .contains('type', ['doctor'])
        .not('specialty', 'is', null)

      if (error) throw error

      // Extract unique specialties from the array column
      this.specialties = [
        ...new Set(
          data
            .map((profile) => profile.specialty)
            .flat()
            .filter((specialty) => specialty),
        ),
      ].sort()
    } catch (error) {
      console.error('Error fetching specialties:', error)
      this.specialties = []
    }
  }

  createDropdown() {
    if (!this.filterContainer) return

    const dropdownHTML = `
      <div class="relative w-full md:w-8">
        <button
          type="button"
          id="specialty-dropdown"
          class="w-full bg-white border border-gray-300 rounded-md py-1 px-3 flex items-center justify-between shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-whiskey-500"
        >
          <span class="selected-specialty">All Specialties</span>
          <svg class="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>

        <div
          id="specialty-dropdown-options"
          class="hidden absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none"
          style="max-height: 300px; overflow-y: auto;"
        >
          <div class="sticky top-0 bg-white border-b border-gray-200">
            <a href="#"
              data-specialty="all"
              class="block px-4 py-2 text-sm hover:bg-whiskey-100 cursor-pointer"
            >
              All Specialties
            </a>
          </div>
          <div class="py-1">
            ${this.specialties
              .map(
                (specialty) => `
                <a href="#"
                  data-specialty="${specialty}"
                  class="block px-4 py-2 text-sm hover:bg-whiskey-100 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  ${specialty}
                </a>
              `,
              )
              .join('')}
          </div>
        </div>
      </div>
    `

    const styleSheet = document.createElement('style')
    styleSheet.textContent = `
      #specialty-dropdown-options {
        scrollbar-width: thin;
        scrollbar-color: #CBD5E0 #EDF2F7;
      }
      #specialty-dropdown-options::-webkit-scrollbar {
        width: 8px;
      }
      #specialty-dropdown-options::-webkit-scrollbar-track {
        background: #EDF2F7;
        border-radius: 4px;
      }
      #specialty-dropdown-options::-webkit-scrollbar-thumb {
        background-color: #CBD5E0;
        border-radius: 4px;
        border: 2px solid #EDF2F7;
      }
      #specialty-dropdown-options::-webkit-scrollbar-thumb:hover {
        background-color: #A0AEC0;
      }
    `
    document.head.appendChild(styleSheet)

    this.filterContainer.innerHTML = `
      <h6 class="text-left mb-2">Pick a Specialty</h6>
      ${dropdownHTML}
    `
  }

  setupEventListeners() {
    const dropdownButton = document.getElementById('specialty-dropdown')
    const dropdownOptions = document.getElementById(
      'specialty-dropdown-options',
    )
    const selectedSpecialtySpan = dropdownButton?.querySelector(
      '.selected-specialty',
    )

    dropdownButton?.addEventListener('click', () => {
      dropdownOptions?.classList.toggle('hidden')
    })

    dropdownOptions?.addEventListener('click', (e) => {
      e.preventDefault()
      const option = e.target.closest('[data-specialty]')
      if (option) {
        const specialty = option.dataset.specialty
        selectedSpecialtySpan.textContent =
          specialty === 'all' ? 'All Specialties' : specialty
        dropdownOptions.classList.add('hidden')
        this.handleSpecialtySelection(specialty)
      }
    })

    document.addEventListener('click', (e) => {
      if (!dropdownButton?.contains(e.target)) {
        dropdownOptions?.classList.add('hidden')
      }
    })
  }

  handleSpecialtySelection(specialty) {
    this.selectedSpecialty = specialty === 'all' ? null : specialty
    const filterChangeEvent = new CustomEvent('filterChange', {
      detail: {
        selectedSpecialties: this.selectedSpecialty
          ? [this.selectedSpecialty]
          : [],
      },
    })
    document.dispatchEvent(filterChangeEvent)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.doctorFilters = new DoctorFilters()
})

export default DoctorFilters

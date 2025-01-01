// issues-filters.js
import supabase from './supabase.js'

class IssuesFilters {
  constructor() {
    this.filterContainer = document.getElementById('filters')
    this.selectedYear = null
    this.availableYears = []
    this.initializeFilters()
  }

  /**
   * Initialize the filters functionality
   */
  async initializeFilters() {
    try {
      await this.fetchAvailableYears()
      this.createDropdown()
      this.setupEventListeners()
    } catch (error) {
      console.error('Error initializing filters:', error)
    }
  }

  /**
   * Fetch available years from issues in the database
   */
  async fetchAvailableYears() {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('start_date')
        .order('start_date', { ascending: false })

      if (error) throw error

      // Extract unique years from dates
      this.availableYears = [
        ...new Set(
          data.map((issue) => new Date(issue.start_date).getFullYear()),
        ),
      ].sort((a, b) => b - a) // Sort years in descending order
    } catch (error) {
      console.error('Error fetching available years:', error)
      this.availableYears = []
    }
  }

  /**
   * Create dropdown HTML structure
   */
  createDropdown() {
    if (!this.filterContainer) return

    // Create dropdown HTML
    const dropdownHTML = `
      <div class="relative w-full md:w-7">
        <button
          type="button"
          id="year-dropdown"
          class="w-full bg-white border border-gray-300 rounded-md py-1 px-3 flex items-center justify-between shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-whiskey-500"
        >
          <span class="selected-year">All Years</span>
          <svg class="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>

        <div
          id="year-dropdown-options"
          class="hidden absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="sticky top-0 bg-white border-b border-gray-200">
            <a href="#"
              data-year="all"
              class="block px-4 py-2 text-sm hover:bg-whiskey-100 cursor-pointer"
            >
              All Years
            </a>
          </div>
          <div class="py-1">
            ${this.availableYears
              .map(
                (year) => `
                <a href="#"
                  data-year="${year}"
                  class="block px-4 py-2 text-sm hover:bg-whiskey-100 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  ${year}
                </a>
              `,
              )
              .join('')}
          </div>
        </div>
      </div>
    `

    // Set container content
    this.filterContainer.innerHTML = `
      <h6 class="text-left mb-2">Filter by Year</h6>
      ${dropdownHTML}
    `
  }

  /**
   * Set up dropdown event listeners
   */
  setupEventListeners() {
    const dropdownButton = document.getElementById('year-dropdown')
    const dropdownOptions = document.getElementById('year-dropdown-options')
    const selectedYearSpan = dropdownButton?.querySelector('.selected-year')

    // Toggle dropdown
    dropdownButton?.addEventListener('click', () => {
      dropdownOptions?.classList.toggle('hidden')
    })

    // Handle option selection
    dropdownOptions?.addEventListener('click', (e) => {
      e.preventDefault()
      const option = e.target.closest('[data-year]')
      if (option) {
        const year = option.dataset.year
        selectedYearSpan.textContent = year === 'all' ? 'All Years' : year
        dropdownOptions.classList.add('hidden')
        this.handleYearSelection(year)
      }
    })

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownButton?.contains(e.target)) {
        dropdownOptions?.classList.add('hidden')
      }
    })
  }

  /**
   * Handle year selection and emit change event
   */
  handleYearSelection(year) {
    this.selectedYear = year === 'all' ? null : parseInt(year)

    // Dispatch filterChange event with the selected year
    const filterChangeEvent = new CustomEvent('filterChange', {
      detail: {
        selectedYear: this.selectedYear,
      },
    })
    document.dispatchEvent(filterChangeEvent)
  }

  /**
   * Get current selected year
   */
  getSelectedYear() {
    return this.selectedYear
  }
}

// Initialize filters when document is ready
document.addEventListener('DOMContentLoaded', () => {
  window.issuesFilters = new IssuesFilters()
})

export default IssuesFilters

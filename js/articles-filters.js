// articles-filters.js
import supabase from './supabase.js'

class ArticlesFilters {
  constructor() {
    this.filterContainer = document.getElementById('filters')
    this.selectedIssueId = null
    this.issues = []
    this.initializeFilters()
  }

  async initializeFilters() {
    try {
      // Fetch all issues
      const { data: issues, error } = await supabase
        .from('issues')
        .select('id, issue_title, start_date')
        .order('start_date', { ascending: false })

      if (error) throw error

      this.issues = issues
      this.createDropdown()
      this.setupEventListeners()
    } catch (error) {
      console.error('Error initializing filters:', error)
    }
  }

  createDropdown() {
    if (!this.filterContainer) return

    // Add custom scrollbar styles
    const styleSheet = document.createElement('style')
    styleSheet.textContent = `
       #issue-dropdown-options {
         scrollbar-width: thin;
         scrollbar-color: #CBD5E0 #EDF2F7;
       }
       #issue-dropdown-options::-webkit-scrollbar {
         width: 8px;
       }
       #issue-dropdown-options::-webkit-scrollbar-track {
         background: #EDF2F7;
         border-radius: 4px;
       }
       #issue-dropdown-options::-webkit-scrollbar-thumb {
         background-color: #CBD5E0;
         border-radius: 4px;
         border: 2px solid #EDF2F7;
       }
       #issue-dropdown-options::-webkit-scrollbar-thumb:hover {
         background-color: #A0AEC0;
       }
     `
    document.head.appendChild(styleSheet)

    const dropdownHTML = `
      <div class="relative w-full md:w-7">
        <button
          type="button"
          id="issue-dropdown"
          class="w-full bg-white border border-gray-300 rounded-md py-1 px-3 flex items-center justify-between shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-whiskey-500"
        >
          <span class="selected-issue">All Issues</span>
          <svg class="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>

        <div
          id="issue-dropdown-options"
          class="hidden absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none"
          style="max-height: 300px; overflow-y: auto;"
          >
          <div class="sticky top-0 bg-white border-b border-gray-200">
            <a href="#"
              data-issue-id="all"
              class="block px-4 py-2 text-sm hover:bg-whiskey-100 cursor-pointer"
            >
              All Issues
            </a>
          </div>
          <div class="py-1">
            ${this.issues
              .map(
                (issue) => `
                <a href="#"
                  data-issue-id="${issue.id}"
                  class="block px-4 py-2 text-sm hover:bg-whiskey-100 cursor-pointer border-b border-gray-100 last:border-0"
                >
                ${issue.issue_title}
                </a>
              `,
              )
              .join('')}
          </div>
        </div>
      </div>
    `

    this.filterContainer.innerHTML = `
      <h6 class="text-left mb-2">Filter by Issues</h6>
      ${dropdownHTML}
    `
  }

  setupEventListeners() {
    const dropdownButton = document.getElementById('issue-dropdown')
    const dropdownOptions = document.getElementById('issue-dropdown-options')
    const selectedIssueSpan = dropdownButton?.querySelector('.selected-issue')

    dropdownButton?.addEventListener('click', () => {
      dropdownOptions?.classList.toggle('hidden')
    })

    dropdownOptions?.addEventListener('click', (e) => {
      e.preventDefault()
      const option = e.target.closest('[data-issue-id]')
      if (option) {
        const issueId = option.dataset.issueId
        const selectedIssue = this.issues.find((issue) => issue.id === issueId)
        selectedIssueSpan.textContent =
          issueId === 'all' ? 'All Issues' : `${selectedIssue.issue_title}`
        dropdownOptions.classList.add('hidden')
        this.handleIssueSelection(issueId)
      }
    })

    document.addEventListener('click', (e) => {
      if (!dropdownButton?.contains(e.target)) {
        dropdownOptions?.classList.add('hidden')
      }
    })
  }

  handleIssueSelection(issueId) {
    console.log('Filter changed:', {
      previousIssueId: this.selectedIssueId,
      newIssueId: issueId,
    })

    this.selectedIssueId = issueId === 'all' ? null : issueId

    const filterChangeEvent = new CustomEvent('filterChange', {
      detail: {
        selectedIssueId: this.selectedIssueId,
      },
    })
    document.dispatchEvent(filterChangeEvent)
  }

  getSelectedIssueId() {
    return this.selectedIssueId
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.articlesFilters = new ArticlesFilters()
})

export default ArticlesFilters

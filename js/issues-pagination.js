// issues-pagination.js
import supabase from './supabase.js'

// Pagination Configuration
const ISSUES_PER_PAGE = 9 // Show 9 issues in a 3x3 grid
let currentPage = 1
let totalPages = 0
let currentYear = null // For filtering by year

// DOM Elements
const issuesGrid = document.getElementById('issues-wrapper')
const paginationContainer = document.querySelector('.pagination')

/**
 * Format date to readable string
 * @param {string} dateString - Date string from database
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

/**
 * Render issue cards in the grid
 * @param {Array} issues - Array of issue objects from database
 */
function renderIssues(issues) {
  if (!issues?.length) {
    issuesGrid.innerHTML =
      '<div class="col-span-3 text-center py-4">No issues found.</div>'
    totalPages = 0
    renderPagination()
    return
  }

  const issueCards = issues
    .map(
      (issue) => `
      <a href="/Issue.html?id=${issue.id}" id="issue-card" class="transparentcard group">
      <img src="${
        issue.issue_cover_image_link
          ? `${issue.issue_cover_image_link}?height=377&quality=10&resize=cover`
          : '/placeholder.svg'
      }"
                   alt="${issue.issue_title || 'Magazine Issue'}"
                   class="mb-3 h-8 md:h-9 w-full object-cover" />

        <h6 class="text-gray-500 text-sm">${formatDate(issue.start_date)}</h6>
        <h6 id="issue-title" class="">${issue.issue_title || 'Untitled Issue'}</h6>

        <div class="">
        <p class="">View this issue of Springs Magazine</p>
        </div>

        <p class="border-b-2 border-gray-700 group-hover:border-white group-hover:text-white transition-colors duration-200">
          View Full Issue
        </p>
      </a>
    `,
    )
    .join('')

  issuesGrid.innerHTML = issueCards
}

/**
 * Update pagination container
 */
function updatePaginationContainer() {
  let paginationContainer = document.querySelector('.pagination')
  if (!paginationContainer) {
    paginationContainer = document.createElement('div')
    const gridContainer = document.querySelector('.grid-cols-3')
    if (gridContainer && gridContainer.parentNode) {
      gridContainer.parentNode.insertBefore(
        paginationContainer,
        gridContainer.nextSibling,
      )
    }
  }

  paginationContainer.className =
    'pagination mx-auto flex max-w-4xl justify-center gap-1 pb-7 mt-6'
}

/**
 * Render pagination controls
 */
function renderPagination() {
  updatePaginationContainer()

  const paginationContainer = document.querySelector('.pagination')
  if (!paginationContainer) {
    console.error('Pagination container not found')
    return
  }

  const paginationHTML = `
    <button
      class="prev-btn px-3 py-1 rounded ${
        currentPage === 1
          ? 'bg-gray-200 cursor-not-allowed'
          : 'bg-whiskey-500 text-white hover:bg-whiskey-600'
      }"
      ${currentPage === 1 ? 'disabled' : ''}
    >
      Previous
    </button>

    ${Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1)
      .map(
        (page) => `
        <button
          class="page-btn px-3 py-1 rounded ${
            page === currentPage
              ? 'bg-whiskey-500 text-white'
              : 'bg-gray-200 hover:bg-whiskey-500 hover:text-white'
          }"
          data-page="${page}">
          ${page}
        </button>
      `,
      )
      .join('')}

    <button
      class="next-btn px-3 py-1 rounded ${
        currentPage === totalPages || totalPages === 0
          ? 'bg-gray-200 cursor-not-allowed'
          : 'bg-whiskey-500 text-white hover:bg-whiskey-600'
      }"
      ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}
    >
      Next
    </button>
  `

  paginationContainer.innerHTML = paginationHTML
  addPaginationListeners()
}

/**
 * Fetch issues from Supabase with pagination and filters
 */
async function fetchIssues(page, pageSize, year = null) {
  try {
    currentYear = year
    const rangeStart = (page - 1) * pageSize
    const rangeEnd = rangeStart + pageSize - 1

    // First, let's check if we have any issues at all
    const { data: allIssues, error: countError } = await supabase
      .from('issues')
      .select('*')

    console.log('All issues in database:', allIssues) // Debug log

    let query = supabase
      .from('issues')
      .select('*', { count: 'exact' })
      .order('start_date', { ascending: false })

    // Add year filter if specified
    if (year) {
      const startDate = `${year}-01-01`
      const endDate = `${year}-12-31`
      query = query.gte('start_date', startDate).lte('start_date', endDate)
    }

    console.log('Fetching issues with query:', query) // Debug log

    const {
      data: issues,
      count,
      error,
    } = await query.range(rangeStart, rangeEnd)

    if (error) {
      console.error('Supabase error:', error) // More detailed error logging
      throw error
    }

    console.log('Received issues:', issues) // Debug log
    console.log('Total count:', count) // Debug log

    totalPages = Math.max(1, Math.ceil(count / pageSize))
    renderIssues(issues)
    renderPagination()
  } catch (error) {
    console.error('Error fetching issues:', error.message)
    issuesGrid.innerHTML =
      '<div class="col-span-3 text-center py-4">Error loading issues. Please try again later.</div>'
    totalPages = 0
    renderPagination()
  }
}

/**
 * Add event listeners to pagination buttons
 */
function addPaginationListeners() {
  // Previous button
  const prevBtn = paginationContainer.querySelector('.prev-btn')
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--
        fetchIssues(currentPage, ISSUES_PER_PAGE, currentYear)
      }
    })
  }

  // Next button
  const nextBtn = paginationContainer.querySelector('.next-btn')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++
        fetchIssues(currentPage, ISSUES_PER_PAGE, currentYear)
      }
    })
  }

  // Page number buttons
  const pageButtons = paginationContainer.querySelectorAll('.page-btn')
  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = parseInt(e.target.dataset.page)
      fetchIssues(currentPage, ISSUES_PER_PAGE, currentYear)
    })
  })
}

// Add filter change listener
document.addEventListener('filterChange', (event) => {
  currentPage = 1
  fetchIssues(currentPage, ISSUES_PER_PAGE, event.detail.selectedYear)
})

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded')
  console.log('Issues Grid Element:', issuesGrid) // Debug log
  console.log('Pagination Container:', paginationContainer) // Debug log

  if (!issuesGrid) {
    console.error('Issues grid element not found!')
    return
  }

  updatePaginationContainer()
  fetchIssues(currentPage, ISSUES_PER_PAGE)
})

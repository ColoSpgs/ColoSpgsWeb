// attorney-pagination.js
import supabase from './supabase.js'

// Pagination Configuration
const ATTORNEYS_PER_PAGE = 12
let currentPage = 1
let totalPages = 0
let currentSpecialties = []

// DOM Elements
const attorneyGrid = document.getElementById('attorney-cards')
const paginationContainer = document.querySelector('.pagination')

/**
 * Render attorney cards in the grid
 */
function renderAttorneys(attorneys) {
  if (!attorneys?.length) {
    attorneyGrid.innerHTML =
      '<div class="col-span-4 text-center py-4">No attorneys found matching your criteria.</div>'
    totalPages = 0
    renderPagination()
    return
  }

  const attorneyCards = attorneys
    .map(
      (attorney) => `
    <a href="/Profile.html?id=${attorney.id}" class="card group">
    <div>
      <img src="${
        attorney.profile_pic_link
          ? `${attorney.profile_pic_link}?height=233&quality=10&resize=cover`
          : '/placeholder.svg'
      }"
                alt="${attorney.first_name} ${attorney.last_name}"
                class="mb-2 h-7 md:h-8 w-full object-cover"/>
        <p class="mb-1 text-mercury-950 font-medium group-hover:text-whiskey-400">${attorney.first_name} ${attorney.last_name}</p>
        <p class="text-mercury-700">${attorney.bizpractice_name || ''}</p>
      </div>
      <div class="mb-0">
        <h6 class="text-sm text-mercury-400 mb-2">${attorney.legal_specialties ? attorney.legal_specialties.join(', ') : 'General Practice'}</h6>
      </div>

    </a>
  `,
    )
    .join('')

  attorneyGrid.innerHTML = attorneyCards
}

/**
 * Update pagination container
 */
function updatePaginationContainer() {
  console.log('Updating pagination container')
  // Get or create pagination container
  let paginationContainer = document.getElementById('pagination')
  if (!paginationContainer) {
    console.log('Creating new pagination container')
    paginationContainer = document.createElement('div')
    paginationContainer.id = 'pagination' // Add this line
    const gridContainer = document.getElementById('attorney-cards') // Update this line
    if (gridContainer && gridContainer.parentNode) {
      gridContainer.parentNode.insertBefore(
        paginationContainer,
        gridContainer.nextSibling,
      )
    }
  }

  paginationContainer.className =
    'pagination mx-auto flex max-w-4xl justify-center gap-1 pb-7'
}

/**
 * Render pagination controls
 */
function renderPagination() {
  console.log('Rendering pagination with totalPages:', totalPages)
  updatePaginationContainer() // Make sure container exists and has correct classes

  const paginationContainer = document.getElementById('pagination')
  if (!paginationContainer) {
    console.error('Pagination container not found')
    return
  }

  // Always show pagination, even with one page
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
 * Fetches attorneys data from Supabase with pagination and filters
 */
async function fetchAttorneys(page, pageSize, selectedSpecialties = []) {
  try {
    console.log('Fetching attorneys with:', {
      page,
      pageSize,
      selectedSpecialties,
    })

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .contains('type', ['attorney'])

    if (selectedSpecialties.length > 0) {
      query = query.overlaps('legal_specialties', selectedSpecialties)
    }

    const {
      data: attorneys,
      count,
      error,
    } = await query
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('last_name', { ascending: true })

    if (error) throw error

    console.log('Query results:', {
      attorneyCount: attorneys?.length,
      totalCount: count,
    })

    totalPages = Math.max(1, Math.ceil(count / pageSize)) // Ensure minimum of 1 page
    currentSpecialties = selectedSpecialties

    renderAttorneys(attorneys)
    renderPagination()
  } catch (error) {
    console.error('Error fetching attorneys:', error.message)
    attorneyGrid.innerHTML =
      '<div class="col-span-4 text-center py-4">Error loading attorneys. Please try again later.</div>'
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
        fetchAttorneys(currentPage, ATTORNEYS_PER_PAGE, currentSpecialties)
      }
    })
  }

  // Next button
  const nextBtn = paginationContainer.querySelector('.next-btn')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++
        fetchAttorneys(currentPage, ATTORNEYS_PER_PAGE, currentSpecialties)
      }
    })
  }

  // Page number buttons
  const pageButtons = paginationContainer.querySelectorAll('.page-btn')
  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = parseInt(e.target.dataset.page)
      fetchAttorneys(currentPage, ATTORNEYS_PER_PAGE, currentSpecialties)
    })
  })
}

// Add filter change listener
document.addEventListener('filterChange', (event) => {
  console.log('Filter change event received:', event.detail)
  currentPage = 1
  fetchAttorneys(
    currentPage,
    ATTORNEYS_PER_PAGE,
    event.detail.selectedSpecialties,
  )
})

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing attorney pagination')
  updatePaginationContainer() // Ensure container exists on page load
  fetchAttorneys(currentPage, ATTORNEYS_PER_PAGE, [])
})

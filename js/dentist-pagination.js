// dentist-pagination.js
import supabase from './supabase.js'

// Pagination Configuration
const DENTISTS_PER_PAGE = 12
let currentPage = 1
let totalPages = 0
let currentSpecialties = []

// DOM Elements
const dentistGrid = document.getElementById('dentist-cards')
const paginationContainer = document.getElementById('pagination')

/**
 * Render dentist cards in the grid
 */
function renderDentists(dentists) {
  if (!dentists?.length) {
    dentistGrid.innerHTML =
      '<div class="col-span-4 text-center py-4">No dentists found matching your criteria.</div>'
    totalPages = 0
    renderPagination()
    return
  }

  const dentistCards = dentists
    .map(
      (dentist) => `
      <a href="/Profile.html?id=${dentist.id}" class="card group">
      <div>
        <img src="${
          dentist.profile_pic_link
            ? `${dentist.profile_pic_link}?height=233&quality=10&resize=cover`
            : '/placeholder.svg'
        }"
                  alt="${dentist.first_name} ${dentist.last_name}"
                  class="mb-2 h-7 md:h-8 md:w-8 object-cover"/>
        <p class="mb-1 text-mercury-950 font-medium group-hover:text-whiskey-400">${dentist.first_name} ${dentist.last_name}</p>
        <p class="text-mercury-700">${dentist.bizpractice_name || ''}</p>
      </div>
      <div class="mb-0">
        <h6 class="text-sm text-mercury-400 mb-2">${dentist.dentist_specialties ? dentist.dentist_specialties.join(', ') : 'General Dentistry'}</h6>
      </div>
    </a>
  `,
    )
    .join('')

  dentistGrid.innerHTML = dentistCards
}

/**
 * Update pagination container
 */
function updatePaginationContainer() {
  let paginationContainer = document.getElementById('pagination')
  if (!paginationContainer) {
    paginationContainer = document.createElement('div')
    paginationContainer.id = 'pagination' // Add this line
    const gridContainer = document.getElementById('dentist-cards')
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
  updatePaginationContainer()

  const paginationContainer = document.getElementById('pagination')
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
 * Fetches dentists data from Supabase with pagination and filters
 */
async function fetchDentists(page, pageSize, selectedSpecialties = []) {
  try {
    currentSpecialties = selectedSpecialties
    const rangeStart = (page - 1) * pageSize
    const rangeEnd = rangeStart + pageSize - 1

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .contains('type', ['dentist'])

    if (selectedSpecialties.length > 0) {
      query = query.overlaps('dentist_specialties', selectedSpecialties)
    }

    const {
      data: dentists,
      count,
      error,
    } = await query
      .range(rangeStart, rangeEnd)
      .order('last_name', { ascending: true })

    if (error) throw error

    totalPages = Math.max(1, Math.ceil(count / pageSize))
    renderDentists(dentists)
    renderPagination()
  } catch (error) {
    console.error('Error fetching dentists:', error.message)
    dentistGrid.innerHTML =
      '<div class="col-span-4 text-center py-4">Error loading dentists. Please try again later.</div>'
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
        fetchDentists(currentPage, DENTISTS_PER_PAGE, currentSpecialties)
      }
    })
  }

  // Next button
  const nextBtn = paginationContainer.querySelector('.next-btn')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++
        fetchDentists(currentPage, DENTISTS_PER_PAGE, currentSpecialties)
      }
    })
  }

  // Page number buttons
  const pageButtons = paginationContainer.querySelectorAll('.page-btn')
  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = parseInt(e.target.dataset.page)
      fetchDentists(currentPage, DENTISTS_PER_PAGE, currentSpecialties)
    })
  })
}

// Add filter change listener
document.addEventListener('filterChange', (event) => {
  currentPage = 1
  fetchDentists(
    currentPage,
    DENTISTS_PER_PAGE,
    event.detail.selectedSpecialties,
  )
})

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  updatePaginationContainer()
  fetchDentists(currentPage, DENTISTS_PER_PAGE, [])
})

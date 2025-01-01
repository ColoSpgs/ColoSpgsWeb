// doctor-pagination.js
import supabase from './supabase.js'

const DOCTORS_PER_PAGE = 12
let currentPage = 1
let totalPages = 0
let currentSpecialties = []

const doctorGrid = document.getElementById('doctor-cards')
const paginationContainer = document.getElementById('pagination')

function renderDoctors(doctors) {
  if (!doctors?.length) {
    doctorGrid.innerHTML =
      '<div class="col-span-4 text-center py-4">No doctors found matching your criteria.</div>'
    totalPages = 0
    renderPagination()
    return
  }

  const doctorCards = doctors
    .map(
      (doctor) => `
      <a href="/Profile.html?id=${doctor.id}" class="card group">
      <div>
        <img src="${
          doctor.profile_pic_link
            ? `${doctor.profile_pic_link}?height=233&quality=10&resize=cover`
            : '/placeholder.svg'
        }"
          alt="${doctor.first_name} ${doctor.last_name}"
          class="mb-2 h-7 md:h-8 w-full object-cover"/>
          <p class="mb-1 text-mercury-950 font-medium group-hover:text-whiskey-400">Dr. ${doctor.first_name} ${doctor.last_name}</p>
          <p class="text-mercury-700">${doctor.bizpractice_name || ''}</p>
      </div>
      <div class="mb-0">
        <h6 class="text-sm text-mercury-400 mb-2">${
          Array.isArray(doctor.specialty)
            ? doctor.specialty.join(', ')
            : doctor.specialty || 'General Practice'
        }</h6>
      </div>
    </a>
  `,
    )
    .join('')

  doctorGrid.innerHTML = doctorCards
}

function updatePaginationContainer() {
  let paginationContainer = document.getElementById('pagination')
  if (!paginationContainer) {
    paginationContainer = document.createElement('div')
    paginationContainer.id = 'pagination'
    const gridContainer = document.getElementById('doctor-cards')
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

async function fetchDoctors(page, pageSize, selectedSpecialties = []) {
  try {
    currentSpecialties = selectedSpecialties
    const rangeStart = (page - 1) * pageSize
    const rangeEnd = rangeStart + pageSize - 1

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .contains('type', ['doctor'])

    if (selectedSpecialties.length > 0) {
      query = query.overlaps('specialty', selectedSpecialties) // Using 'specialty' column for doctors
    }

    const {
      data: doctors,
      count,
      error,
    } = await query
      .range(rangeStart, rangeEnd)
      .order('last_name', { ascending: true })

    if (error) throw error

    totalPages = Math.max(1, Math.ceil(count / pageSize))
    renderDoctors(doctors)
    renderPagination()
  } catch (error) {
    console.error('Error fetching doctors:', error.message)
    doctorGrid.innerHTML =
      '<div class="col-span-4 text-center py-4">Error loading doctors. Please try again later.</div>'
    totalPages = 0
    renderPagination()
  }
}

function addPaginationListeners() {
  const paginationContainer = document.getElementById('pagination')

  // Previous button
  const prevBtn = paginationContainer.querySelector('.prev-btn')
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--
        fetchDoctors(currentPage, DOCTORS_PER_PAGE, currentSpecialties)
      }
    })
  }

  // Next button
  const nextBtn = paginationContainer.querySelector('.next-btn')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++
        fetchDoctors(currentPage, DOCTORS_PER_PAGE, currentSpecialties)
      }
    })
  }

  // Page number buttons
  const pageButtons = paginationContainer.querySelectorAll('.page-btn')
  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = parseInt(e.target.dataset.page)
      fetchDoctors(currentPage, DOCTORS_PER_PAGE, currentSpecialties)
    })
  })
}

document.addEventListener('filterChange', (event) => {
  currentPage = 1
  fetchDoctors(currentPage, DOCTORS_PER_PAGE, event.detail.selectedSpecialties)
})

document.addEventListener('DOMContentLoaded', () => {
  updatePaginationContainer()
  fetchDoctors(currentPage, DOCTORS_PER_PAGE, [])
})

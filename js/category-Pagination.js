// category-pagination.js
import supabase from './supabase.js'

function getUrlCategory() {
  const urlParams = new URLSearchParams(window.location.search)
  const category = urlParams.get('category')
  return category ? JSON.parse(decodeURIComponent(category)) : null
}

const ARTICLES_PER_PAGE = 9
let currentPage = 1
let totalPages = 0
let currentTags = null

const articlesGrid = document.getElementById('articles-wrapper')
const paginationContainer = document.querySelector('.pagination')
const categoryButtons = document.querySelectorAll('.category-btn')

// Add active state styles to buttons
categoryButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    // Remove active state from all buttons
    categoryButtons.forEach((btn) => {
      btn.classList.remove('bg-whiskey-500', 'text-white')
      btn.classList.add('bg-white')
    })

    // Add active state to clicked button
    button.classList.remove('bg-white')
    button.classList.add('bg-whiskey-500', 'text-white')

    // Get tags and trigger filter
    const tags = JSON.parse(button.dataset.tags)
    currentTags = tags
    currentPage = 1

    // Update URL without reloading the page
    const newUrl = new URL(window.location)
    newUrl.searchParams.set('category', JSON.stringify(tags))
    window.history.pushState({}, '', newUrl)

    fetchArticles(currentPage, ARTICLES_PER_PAGE, tags)
  })
})

async function fetchArticles(page, pageSize, tags = null) {
  try {
    const rangeStart = (page - 1) * pageSize
    const rangeEnd = rangeStart + pageSize

    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })

    if (tags) {
      query = query.overlaps('tags', tags)
    }

    const {
      data: articles,
      count,
      error,
    } = await query.range(rangeStart, rangeEnd)

    if (error) throw error

    totalPages = Math.max(1, Math.ceil(count / pageSize))
    await renderArticles(articles)
    renderPagination()
  } catch (error) {
    console.error('Error fetching articles:', error)
    articlesGrid.innerHTML =
      '<div class="col-span-3 text-center py-4">Error loading articles. Please try again later.</div>'
  }
}

async function renderArticles(articles) {
  if (!articles?.length) {
    articlesGrid.innerHTML =
      '<div class="col-span-3 text-center py-4">No articles found.</div>'
    totalPages = 0
    renderPagination()
    return
  }

  // Fetch authors for the articles
  const authorIds = [...new Set(articles.map((article) => article.author_id))]
  const { data: authors } = await supabase
    .from('authors')
    .select('id, first_name, last_name')
    .in('id', authorIds)

  // Fetch issues for the articles
  const issueIds = [...new Set(articles.map((article) => article.issue_id))]
  const { data: issues } = await supabase
    .from('issues')
    .select('id, issue_title')
    .in('id', issueIds)

  const authorMap = new Map(
    authors.map((author) => [
      author.id,
      `${author.first_name} ${author.last_name}`,
    ]),
  )

  const issueMap = new Map(issues.map((issue) => [issue.id, issue.issue_title]))

  const articleCards = articles
    .map(
      (article) => `
    <a href="/Article.html?id=${article.id}" class="transparentcard group">
      <img src="${article.cover_image_link ? `${article.cover_image_link}?height=377&quality=10&resize=cover` : '/placeholder.svg'}"
           alt="${article.title}"
           class="mb-2 h-8 md:h-9 w-full object-cover" />
           <div class="flex gap-2 mb-2">
             ${(article.tags || [])
               .map(
                 (tag) =>
                   `<span class="text-xs bg-whiskey-100 px-2 py-1 rounded">${tag}</span>`,
               )
               .join('')}
           </div>
      <h6 class="text-sm">
          ${article.date ? new Date(article.date).toLocaleDateString() : ''}
          ${issueMap.get(article.issue_id) || 'Uncategorized'} •
          ${authorMap.get(article.author_id) || 'Unknown Author'}
        </h6>

      <h6 class="">${article.title}</h6>
      <p class="link border-b-2 border-whiskey-400 text-mercury-950 group-hover:text-whiskey-400">
        Read Article
      </p>
    </a>
  `,
    )
    .join('')

  articlesGrid.innerHTML = articleCards
}

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

function addPaginationListeners() {
  // Previous button
  const prevBtn = paginationContainer.querySelector('.prev-btn')
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--
        fetchArticles(currentPage, ARTICLES_PER_PAGE, currentTags)
      }
    })
  }

  // Next button
  const nextBtn = paginationContainer.querySelector('.next-btn')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++
        fetchArticles(currentPage, ARTICLES_PER_PAGE, currentTags)
      }
    })
  }

  // Page number buttons
  const pageButtons = paginationContainer.querySelectorAll('.page-btn')
  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = parseInt(e.target.dataset.page)
      fetchArticles(currentPage, ARTICLES_PER_PAGE, currentTags)
    })
  })
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  if (!articlesGrid) {
    console.error('Articles grid element not found!')
    return
  }

  // Check for category in URL
  const urlTags = getUrlCategory()
  if (urlTags) {
    // Find and activate the corresponding button
    categoryButtons.forEach((button) => {
      const buttonTags = JSON.parse(button.dataset.tags)
      if (JSON.stringify(buttonTags) === JSON.stringify(urlTags)) {
        button.classList.remove('bg-white')
        button.classList.add('bg-whiskey-500', 'text-white')
        currentTags = urlTags
      }
    })
    fetchArticles(currentPage, ARTICLES_PER_PAGE, urlTags)
  } else {
    fetchArticles(currentPage, ARTICLES_PER_PAGE, null)
  }
})

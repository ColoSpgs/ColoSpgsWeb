// articles-pagination.js
import supabase from './supabase.js'

const DEBUG = true

function logRequest(method, url, data) {
  if (DEBUG) {
    console.log(`${method} ${url}`, data)
  }
}

const ARTICLES_PER_PAGE = 9
let currentPage = 1
let totalPages = 0
let currentIssueId = null

const articlesGrid = document.getElementById('articles-wrapper')
const paginationContainer = document.querySelector('.pagination')

async function renderArticles(articles) {
  console.log('Rendering articles:', articles)

  if (!articles || articles.length === 0) {
    articlesGrid.innerHTML =
      '<div class="col-span-3 text-center py-4">No articles found.</div>'
    totalPages = 0
    renderPagination()
    return
  }

  // Log the unique articles after filtering
  const uniqueArticles = Array.from(
    new Map(articles.map((article) => [article.id, article])).values(),
  )
  console.log('Unique articles:', uniqueArticles)

  // Filter out null author_ids and get unique values
  const authorIds = [
    ...new Set(
      articles.map((article) => article.author_id).filter((id) => id != null),
    ),
  ]

  let authors = []
  if (authorIds.length > 0) {
    const { data: authorsData, error: authorsError } = await supabase
      .from('authors')
      .select('id, first_name, last_name')
      .in('id', authorIds)

    if (authorsError) {
      console.error('Error fetching authors:', authorsError)
    } else {
      authors = authorsData || []
    }
  }

  // Fetch issues for the articles
  const issueIds = [
    ...new Set(articles.map((article) => article.issue_id).filter(Boolean)),
  ]

  let issues = []
  if (issueIds.length > 0) {
    const { data } = await supabase
      .from('issues')
      .select('id, issue_title')
      .in('id', issueIds)
    issues = data || []
  }

  const authorMap = new Map(
    authors.map((author) => [
      author.id,
      `${author.first_name || ''} ${author.last_name || ''}`.trim(),
    ]),
  )

  const issueMap = new Map(issues.map((issue) => [issue.id, issue.issue_title]))

  // Helper function to safely get author name
  const getAuthorName = (authorId) => {
    if (!authorId) return 'Unknown Author'
    return authorMap.get(authorId) || 'Unknown Author'
  }

  const articleCards = articles
    .filter((article) => {
      // Log invalid articles
      if (!article.id || !article.title) {
        console.warn('Invalid article:', article)
        return false
      }
      return true
    })
    .map(
      (article) => `
      <a href="/Article.html?id=${article.id}" class="transparentcard group">
        <img src="${
          article.cover_image_link
            ? `${article.cover_image_link}?height=377&quality=10&resize=cover`
            : '/placeholder.svg'
        }"
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
          ${getAuthorName(article.author_id)}
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

async function fetchArticles(page, pageSize, issueId = null) {
  logRequest('GET', 'articles', { page, pageSize, issueId })
  console.log('Fetching articles with params:', { page, pageSize, issueId })

  try {
    const rangeStart = (page - 1) * pageSize
    const rangeEnd = rangeStart + pageSize - 1

    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })

    if (issueId) {
      query = query.eq('issue_id', issueId)
    }

    const {
      data: articles,
      count,
      error,
    } = await query.range(rangeStart, rangeEnd)

    console.log('Fetched articles:', {
      page,
      pageSize,
      rangeStart,
      rangeEnd,
      count,
      articlesLength: articles?.length,
      issueId,
    })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    if (!articles || articles.length === 0) {
      articlesGrid.innerHTML =
        '<div class="col-span-3 text-center py-4">No articles found.</div>'
      totalPages = 0
      renderPagination()
      return
    }

    // Add check for duplicates
    const uniqueArticles = Array.from(
      new Map(articles.map((article) => [article.id, article])).values(),
    )

    // Calculate total pages based on actual count
    totalPages = Math.max(1, Math.ceil(count / pageSize))

    // Ensure current page doesn't exceed total pages
    if (currentPage > totalPages) {
      currentPage = totalPages
    }

    await renderArticles(uniqueArticles)
    renderPagination()
  } catch (error) {
    console.error('Error fetching articles:', error)
    articlesGrid.innerHTML =
      '<div class="col-span-3 text-center py-4">Error loading articles. Please try again later.</div>'
    totalPages = 0
    renderPagination()
  }
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

  // Ensure current page is valid
  if (currentPage > totalPages) {
    currentPage = totalPages
  }
  if (currentPage < 1) {
    currentPage = 1
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
        fetchArticles(currentPage, ARTICLES_PER_PAGE, currentIssueId)
      }
    })
  }

  // Next button
  const nextBtn = paginationContainer.querySelector('.next-btn')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++
        fetchArticles(currentPage, ARTICLES_PER_PAGE, currentIssueId)
      }
    })
  }

  // Page number buttons
  const pageButtons = paginationContainer.querySelectorAll('.page-btn')
  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = parseInt(e.target.dataset.page)
      fetchArticles(currentPage, ARTICLES_PER_PAGE, currentIssueId)
    })
  })
}

// Add filter change listener
document.addEventListener('filterChange', (event) => {
  currentPage = 1
  currentIssueId = event.detail.selectedIssueId
  fetchArticles(currentPage, ARTICLES_PER_PAGE, currentIssueId)
})

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  if (!articlesGrid) {
    console.error('Articles grid element not found!')
    return
  }

  updatePaginationContainer()
  fetchArticles(currentPage, ARTICLES_PER_PAGE, null) // Pass null as initial issueID
})

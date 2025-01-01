// public/js/issue.js
import supabase from './supabase.js'

const ARTICLES_PER_PAGE = 9
let currentPage = 1
let totalPages = 0
let issueId = null

// DOM Elements
const issueTitle = document.getElementById('issue-title')
const articlesWrapper = document.getElementById('articles-wrapper')
const paginationContainer = document.querySelector('.pagination')

// Get issue ID from URL parameters
function getIssueId() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('id')
}

// Fetch and display issue details
async function fetchIssueDetails(issueId) {
  try {
    const { data: issue, error } = await supabase
      .from('issues')
      .select('*')
      .eq('id', issueId)
      .single()

    if (error) throw error

    // Update the page title
    issueTitle.textContent = issue.issue_title
    document.title = `${issue.issue_title} - Colorado Springs Magazine`

    // Update the cover image
    const coverImage = document.getElementById('issue-cover-image')
    if (coverImage) {
      coverImage.src = issue.issue_cover_image_link
        ? `${issue.issue_cover_image_link}?height=377&quality=10&resize=cover`
        : '/placeholder.svg'
      coverImage.alt = issue.issue_title || 'Magazine Issue'
    }

    // Update the date range if you want to display it
    const dateRangeElement = document.getElementById('issuedaterange')
    if (dateRangeElement && issue.start_date) {
      const startDate = new Date(issue.start_date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
      dateRangeElement.textContent = startDate
    }
  } catch (error) {
    console.error('Error fetching issue details:', error)
    issueTitle.textContent = 'Issue Not Found'

    // Reset the image to placeholder if there's an error
    const coverImage = document.querySelector('section img')
    if (coverImage) {
      coverImage.src = '/placeholder.svg'
      coverImage.alt = 'Issue Not Found'
    }
  }
}

// Fetch and render articles for the issue
async function fetchIssueArticles(page, pageSize) {
  try {
    const rangeStart = (page - 1) * pageSize
    const rangeEnd = rangeStart + pageSize - 1

    // Fetch articles for this issue
    const {
      data: articles,
      count,
      error,
    } = await supabase
      .from('articles')
      .select('*, authors(first_name, last_name)', { count: 'exact' })
      .eq('issue_id', issueId)
      .order('date', { ascending: false })
      .range(rangeStart, rangeEnd)

    if (error) throw error

    totalPages = Math.ceil(count / pageSize)
    await renderArticles(articles)
    renderPagination()
  } catch (error) {
    console.error('Error fetching articles:', error)
    articlesWrapper.innerHTML =
      '<div class="col-span-3 text-center py-4">Error loading articles. Please try again later.</div>'
  }
}

// Render articles
function renderArticles(articles) {
  if (!articles?.length) {
    articlesWrapper.innerHTML =
      '<div class="col-span-3 text-center py-4">No articles found for this issue.</div>'
    return
  }

  const articleCards = articles
    .map(
      (article) => `
    <a href="/Article.html?id=${article.id}" class="transparentcard group">
      <img
        src="${article.cover_image_link || '/placeholder.svg'}"
        alt="${article.title}"
        class="mb-2 h-8 md:h-9 w-full object-cover"
      />
      <div class="flex gap-2 mb-2">
        ${(article.tags || [])
          .map(
            (tag) =>
              `<span class="text-xs bg-whiskey-100 px-2 py-1 rounded">${tag}</span>`,
          )
          .join('')}
      </div>
      <h6 class="text-sm">
      Author:
        ${article.authors ? `${article.authors.first_name} ${article.authors.last_name}` : 'Unknown Author'}
      </h6>
      <h6 class="">${article.title}</h6>
      <p class="border-b-2 border-white transition-all duration-200 group-hover:text-white">
        Read Article
      </p>
    </a>
  `,
    )
    .join('')

  articlesWrapper.innerHTML = articleCards
}

// Render pagination controls
function renderPagination() {
  if (!paginationContainer) return

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

    ${Array.from({ length: totalPages }, (_, i) => i + 1)
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
        currentPage === totalPages
          ? 'bg-gray-200 cursor-not-allowed'
          : 'bg-whiskey-500 text-white hover:bg-whiskey-600'
      }"
      ${currentPage === totalPages ? 'disabled' : ''}
    >
      Next
    </button>
  `

  paginationContainer.innerHTML = paginationHTML
  addPaginationListeners()
}

// Add pagination event listeners
function addPaginationListeners() {
  paginationContainer
    .querySelector('.prev-btn')
    ?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--
        fetchIssueArticles(currentPage, ARTICLES_PER_PAGE)
      }
    })

  paginationContainer
    .querySelector('.next-btn')
    ?.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++
        fetchIssueArticles(currentPage, ARTICLES_PER_PAGE)
      }
    })

  paginationContainer.querySelectorAll('.page-btn').forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = parseInt(e.target.dataset.page)
      fetchIssueArticles(currentPage, ARTICLES_PER_PAGE)
    })
  })
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
  issueId = getIssueId()

  if (!issueId) {
    issueTitle.textContent = 'Issue Not Found'
    articlesWrapper.innerHTML =
      '<div class="col-span-3 text-center py-4">Invalid issue ID</div>'
    return
  }

  await fetchIssueDetails(issueId)
  await fetchIssueArticles(currentPage, ARTICLES_PER_PAGE)
})

// article.js
import supabase from './supabase.js'
import { marked } from 'https://esm.sh/marked@9.1.6'
import { modalController } from './article-modal.js'

// Configure marked options
marked.setOptions({
  breaks: true, // Adds line breaks as <br>
  gfm: true, // GitHub Flavored Markdown
  headerIds: true,
  mangle: false,
  headerPrefix: 'heading-',
})

// Function to handle gallery images
function updateGallery(images) {
  const galleryContainer = document.getElementById('article-gallery')

  // Clear existing placeholder images
  galleryContainer.innerHTML = ''

  // If there are no images, hide the gallery container
  if (!images || images.length === 0) {
    galleryContainer.style.display = 'none'
    return
  }

  // Create and append image elements for each gallery image
  images.forEach((imageUrl) => {
    const img = document.createElement('img')
    img.src = imageUrl
    img.className =
      'w-max cursor-pointer object-cover transition-opacity hover:opacity-80 h-auto w-auto md:h-8 md:w-8'
    img.alt = 'Article gallery image'
    img.addEventListener('click', () => modalController.openModal(imageUrl))
    galleryContainer.appendChild(img)
  })
  // Reinitialize modal events after updating gallery
  modalController.init()
}

// New function to update URL to friendly path
async function updateURLToPath(articleId) {
  try {
    const { data: article, error } = await supabase
      .from('articles')
      .select('url_path')
      .eq('id', articleId)
      .single()

    if (error) throw error
    if (article?.url_path) {
      // Update URL without reloading the page
      window.history.replaceState({}, '', `${article.url_path}`)
    }
  } catch (error) {
    console.error('Error updating URL:', error)
  }
}

// Function to load article by ID
async function loadArticleById(articleId) {
  try {
    const { data: article, error } = await supabase
      .from('articles')
      .select(
        `
        *,
        author:author_id(first_name, last_name),
        photographer:photographer_id(first_name, last_name),
        issue:issue_id(issue_title)
      `,
      )
      .eq('id', articleId)
      .single()

    if (error) throw error

    if (!article) {
      console.error('Article not found')
      return
    }

    // Update the DOM with article data
    document.getElementById('article-title').textContent = article.title

    try {
      document.getElementById('article-content').innerHTML = marked.parse(
        article.content || '', // Add fallback for null/undefined content
      )
    } catch (parseError) {
      console.error('Error parsing markdown:', parseError)
      // Fallback to raw content or error message
      document.getElementById('article-content').textContent =
        article.content || 'Error displaying article content'
    }

    // Set cover image if available
    if (article.cover_image_link) {
      document.getElementById('article-coverimage').src =
        article.cover_image_link
    }

    // Set author info
    if (article.author) {
      const authorName = `${article.author.first_name} ${article.author.last_name}`
      document.getElementById('author-link').textContent = authorName
    }

    // Set photographer info
    if (article.photographer) {
      const photographerName = `${article.photographer.first_name} ${article.photographer.last_name}`
      document.getElementById('photography-link').textContent = photographerName
    }

    // Set date
    if (article.date) {
      document.getElementById('date').textContent = new Date(
        article.date,
      ).toLocaleDateString()
    }

    // Set issue info
    if (article.issue) {
      document.getElementById('issue-link').textContent =
        article.issue.issue_title
    }

    // Update gallery images
    if (article.article_images) {
      updateGallery(article.article_images)
    }

    // Update page title
    document.title = `${article.title} - Colorado Springs Magazine`
  } catch (error) {
    console.error('Error loading article:', error)
  }
}

// Main load article function
async function loadArticle() {
  const urlParams = new URLSearchParams(window.location.search)
  const articleId = urlParams.get('id')

  if (!articleId) {
    // Try to find article by URL path
    const pathName = window.location.pathname
    try {
      const { data: article, error } = await supabase
        .from('articles')
        .select('id')
        .eq('url_path', pathName)
        .single()

      if (error) throw error
      if (article) {
        // Load article with found ID
        await loadArticleById(article.id)
        return
      }
    } catch (error) {
      console.error('Error finding article by path:', error)
      return
    }
  } else {
    // Load article and update URL
    await loadArticleById(articleId)
    await updateURLToPath(articleId)
  }
}

// Load the article when the DOM is ready
document.addEventListener('DOMContentLoaded', loadArticle)

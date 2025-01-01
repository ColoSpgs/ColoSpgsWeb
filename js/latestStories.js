// public/js/latestStories.js
import supabase from './supabase.js'

async function loadLatestStories() {
  try {
    // Fetch the 4 most recent articles with their authors
    const { data: articles, error } = await supabase
      .from('articles')
      .select(
        `
        *,
        authors:author_id (
          first_name,
          last_name
        ),
        issues:issue_id (
          issue_title
        )
      `,
      )
      .order('date', { ascending: false })
      .limit(4)

    if (error) throw error

    // Get the template card and its parent container
    const templateCard = document.getElementById('latest-story-card')
    const cardsContainer = templateCard.parentElement

    // Remove all existing cards
    cardsContainer.innerHTML = ''

    // Create and append new cards for each article
    articles.forEach((article) => {
      const card = templateCard.cloneNode(true)

      // Remove the ID from the clone to avoid duplicates
      card.removeAttribute('id')

      // Update card content
      card.href = `/Article.html?id=${article.id}`

      // Update image
      const img = card.querySelector('img')
      img.src = article.cover_image_link || '/placeholder.svg'
      img.alt = article.title

      // Update issue and author info
      const issueAndAuthor = card.querySelector(
        '#latest-story-issue-and-author',
      )
      issueAndAuthor.textContent = `${article.issues?.issue_title || 'Uncategorized'} • ${
        article.authors?.first_name
      } ${article.authors?.last_name}`
      issueAndAuthor.removeAttribute('id')

      // Update title
      const title = card.querySelector('#latest-story-title')
      title.textContent = article.title
      title.removeAttribute('id')

      // Update description
      const description = card.querySelector('#latest-story-description')
      description.textContent = article.blurb || article.title
      description.removeAttribute('id')

      cardsContainer.appendChild(card)
    })
  } catch (error) {
    console.error('Error loading latest stories:', error)
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', loadLatestStories)

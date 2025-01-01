// js/heroInteraction.js

import supabase from './supabase.js'

let features = [] // Will be populated from Supabase
let currentLayer = 1 // Track which layer is currently visible

async function fetchRecentArticles() {
  try {
    // Fetch articles tagged as "Feature" with their authors
    const { data: articles, error } = await supabase
      .from('articles')
      .select(
        `
        *,
        authors:author_id (
          first_name,
          last_name
        )
      `,
      )
      .contains('tags', ['Feature']) // Filter for articles containing "Feature" tag
      .order('date', { ascending: false })
      .limit(4)

    if (error) throw error

    // Transform the articles data into the features format
    features = articles.map((article) => ({
      backgroundImage: article.cover_image_link
        ? `url("${article.cover_image_link}?height=1080&quality=80&resize=cover")`
        : 'url("/placeholder.svg")',
      writer: `${article.authors.first_name} ${article.authors.last_name}`,
      title: article.title,
      description: article.blurb || article.title,
      link: `/Article.html?id=${article.id}`,
    }))

    // Set initial content once articles are loaded
    updateHeroContent(0)
  } catch (error) {
    console.error('Error fetching recent articles:', error)
    // Set fallback content if fetch fails
    features = [
      {
        backgroundImage: 'url("/placeholder.svg")',
        writer: 'Error loading content',
        title: 'Please try again later',
        description: 'Unable to load recent articles',
        link: '#',
      },
    ]
    updateHeroContent(0)
  }
}

function updateHeroContent(index) {
  if (!features[index]) return

  const layer1 = document.getElementById('bg-layer-1')
  const layer2 = document.getElementById('bg-layer-2')
  const writerElement = document.querySelector('#hero h6')
  const titleElement = document.querySelector('#hero h3')
  const descriptionElement = document.querySelector('#hero p')

  // Determine which layer to fade in/out
  const fadeOutLayer = currentLayer === 1 ? layer1 : layer2
  const fadeInLayer = currentLayer === 1 ? layer2 : layer1

  // Set the new background image on the hidden layer
  fadeInLayer.style.backgroundImage = features[index].backgroundImage

  // Fade out current layer and fade in new layer
  fadeOutLayer.classList.add('opacity-0')
  fadeInLayer.classList.remove('opacity-0')

  // Toggle current layer
  currentLayer = currentLayer === 1 ? 2 : 1

  // Update text content
  writerElement.textContent = features[index].writer
  titleElement.textContent = features[index].title
  descriptionElement.textContent = features[index].description

  // Update story links
  const storyLinks = document.querySelectorAll('.storyselect')
  storyLinks.forEach((link, i) => {
    if (features[i]) {
      link.textContent = `${features[i].title} • ${features[i].writer}`
      link.href = features[i].link
    }
  })
}

// Initialize hero interactions
document.addEventListener('DOMContentLoaded', async () => {
  await fetchRecentArticles()

  // Set initial background
  if (features.length > 0) {
    const layer1 = document.getElementById('bg-layer-1')
    layer1.style.backgroundImage = features[0].backgroundImage
  }

  const storyLinks = document.querySelectorAll('.storyselect')
  storyLinks.forEach((link, index) => {
    link.addEventListener('mouseenter', () => {
      updateHeroContent(index)
    })
  })
})

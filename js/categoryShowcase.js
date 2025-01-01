const categories = [
  {
    name: 'Profiles',
    image: '/img/jeremy-alford-O13B7suRG4A-unsplash.jpg',
    tags: ['Profile', 'Game Changers'],
  },
  {
    name: 'City',
    image: '/img/vincent-yuan-usa-PqkjBP_ur5k-unsplash.jpg',
    tags: ['City'],
  },
  {
    name: 'Wellness',
    image: '/img/vitalii-pavlyshynets-kcRFW-Hje8Y-unsplash.jpg',
    tags: ['Health & Wellness'],
  },
  {
    name: 'Lifestyle',
    image: '/img/annie-spratt-g4UQNls200Q-unsplash.jpg',
    tags: ['Lifestyle'],
  },
  {
    name: 'Culture',
    image: '/img/sergei-gavrilov-gbd6PqRqGms-unsplash.jpg',
    tags: ['Culture', 'Colorado Springs Art'],
  },
]

function initCategoryShowcase() {
  const categoryLinksContainer = document.getElementById('category-links')

  // Create and insert links with their corresponding images
  categories.forEach((category, index) => {
    // Create wrapper for link and its image
    const wrapper = document.createElement('span')
    wrapper.className = 'relative inline-block'

    // Create image container
    const imageDiv = document.createElement('div')
    imageDiv.className =
      'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-6 h-6 opacity-0 transition-opacity duration-500 pointer-events-none'
    imageDiv.setAttribute('data-category', category.name)

    const img = document.createElement('img')
    img.src = category.image
    img.alt = category.name
    img.className = 'w-full h-full object-cover'

    imageDiv.appendChild(img)
    wrapper.appendChild(imageDiv)

    // Create link with encoded category tags
    const link = document.createElement('a')
    const encodedTags = encodeURIComponent(JSON.stringify(category.tags))
    link.href = `/Category.html?category=${encodedTags}`
    link.className =
      'text-mercury-300 hover:text-whiskey-400 transition-opacity duration-300'
    link.textContent = category.name

    link.addEventListener('mouseenter', () => {
      imageDiv.classList.remove('opacity-0')
      imageDiv.classList.add('opacity-100')

      // Fade other links
      categoryLinksContainer.querySelectorAll('a').forEach((otherLink) => {
        if (otherLink !== link) {
          otherLink.classList.add('opacity-30')
        }
      })
    })

    link.addEventListener('mouseleave', () => {
      imageDiv.classList.remove('opacity-100')
      imageDiv.classList.add('opacity-0')

      // Restore other links
      categoryLinksContainer.querySelectorAll('a').forEach((otherLink) => {
        otherLink.classList.remove('opacity-30')
      })
    })

    wrapper.appendChild(link)
    categoryLinksContainer.appendChild(wrapper)

    // Add comma and space after each link except the last one
    if (index < categories.length - 1) {
      const comma = document.createTextNode(', ')
      categoryLinksContainer.appendChild(comma)
    } else {
      const period = document.createTextNode('.')
      categoryLinksContainer.appendChild(period)
    }
  })
}

// Make sure the function runs after the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCategoryShowcase)
} else {
  initCategoryShowcase()
}

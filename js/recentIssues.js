// public/js/recentIssues.js
import supabase from './supabase.js'

async function fetchRecentIssues() {
  try {
    const { data: issues, error } = await supabase
      .from('issues')
      .select('*')
      .order('start_date', { ascending: false })
      .limit(4)

    if (error) throw error

    renderRecentIssues(issues)
  } catch (error) {
    console.error('Error fetching recent issues:', error)
    const issuesContainer = document.querySelector('#past-issues .grid')
    if (issuesContainer) {
      issuesContainer.innerHTML =
        '<div class="col-span-2 text-center py-4">Error loading recent issues.</div>'
    }
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

function renderRecentIssues(issues) {
  const issuesContainer = document.querySelector('#past-issues .grid')
  if (!issuesContainer) return

  const issuesHTML = issues
    .map(
      (issue) => `
    <a class="transparentcard" href="/Issue.html?id=${
      issue.id
    }" id="issue-card">
    <img
        src="${
          issue.issue_cover_image_link
            ? `${issue.issue_cover_image_link}?height=377&quality=10&resize=cover`
            : '/placeholder.svg'
        }"
        alt="${issue.issue_title || 'Magazine Issue'}"
        class="mb-3 h-8 w-full object-contain md:h-9 md:w-auto"
      />
      <h6 class="text-sm" id="past-issue-date">${formatDate(
        issue.start_date,
      )}</h6>
      <h6 class="" id="past-issue-name">${issue.issue_title}</h6>
      <p>${issue.description || 'View this issue of Springs Magazine'}</p>
      <div class="border-b-2 border-white hover:text-white">
        Go to Full Issue
      </div>
    </a>
  `,
    )
    .join('')

  issuesContainer.innerHTML = issuesHTML
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  fetchRecentIssues()
})

// profile-loader.js
import supabase from './supabase.js'
import { marked } from 'https://esm.sh/marked@9.1.6'

// Configure marked options
marked.setOptions({
  breaks: true, // Adds line breaks as <br>
  gfm: true, // GitHub Flavored Markdown
  headerIds: true,
  mangle: false,
  headerPrefix: 'heading-',
})

async function loadProfile() {
  // Get the profile ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const profileId = urlParams.get('id')

  if (!profileId) {
    console.error('No profile ID provided')
    return
  }

  try {
    // Fetch the profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single()

    if (error) throw error

    if (!profile) {
      console.error('Profile not found')
      return
    }

    // Update the page content
    document.getElementById('profilename').textContent =
      `${profile.first_name} ${profile.last_name}`
    document.getElementById('bizname').textContent =
      profile.bizpractice_name || ''
    document.getElementById('bizaddress').textContent =
      `${profile.business_streetaddress || ''} ${profile.business_suite ? `Suite ${profile.business_suite}` : ''}, ${profile.business_city || ''}, ${profile.business_state || ''} ${profile.business_zip || ''}`
    document.getElementById('bizwebsite').textContent =
      profile.bizpractice_website || ''

    // Update profile image
    const profileImage = document.getElementById('profileimage')
    if (profile.profile_pic_link) {
      profileImage.src = `${profile.profile_pic_link}?height=400&quality=80&resize=cover`
    }

    // Update title based on profile type
    document.title = `${profile.first_name} ${profile.last_name} - Profile`

    // Parse and update content as markdown
    if (profile.content) {
      try {
        document.getElementById('sponsoredcontent').innerHTML = marked.parse(
          profile.content || '', // Add fallback for null/undefined content
        )
      } catch (parseError) {
        console.error('Error parsing markdown:', parseError)
        // Fallback to raw content or error message
        document.getElementById('sponsoredcontent').textContent =
          profile.content || 'Error displaying profile content'
      }
    }

    // Handle website link
    const websiteText = document.getElementById('bizwebsite')
    if (profile.bizpractice_website) {
      websiteText.innerHTML = `<a href="http://${profile.bizpractice_website}" target="_blank" class="text-whiskey-500 hover:text-whiskey-600">${profile.bizpractice_website}</a>`
    }
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

// Load profile data when the page loads
document.addEventListener('DOMContentLoaded', loadProfile)

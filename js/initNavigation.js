// Import navigation component
import { NavigationComponent } from '../components/Navigation.js'

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create and initialize navigation component
  const navigation = new NavigationComponent()
  navigation.initialize()
})

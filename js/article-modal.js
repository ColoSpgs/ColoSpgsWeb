// Create and export the modal controller
export const modalController = {
  init() {
    this.modal = document.getElementById('image-modal')
    this.modalImage = document.getElementById('modal-image')
    this.closeButton = document.getElementById('close-modal')
    this.galleryImages = Array.from(
      document.querySelectorAll('#article-gallery img'),
    )
    this.currentImageIndex = 0
    this.initializeEvents()
  },

  openModal(imgSrc) {
    this.modal.classList.remove('hidden')
    this.modal.classList.add('flex')
    this.modal.offsetHeight // Force reflow
    this.modal.classList.remove('opacity-0')
    this.modal.querySelector('div').classList.remove('scale-95')

    this.modalImage.src = imgSrc
    // Set current image index
    this.currentImageIndex = this.galleryImages.findIndex(
      (img) => img.src === imgSrc,
    )
    document.body.style.overflow = 'hidden'
  },

  closeModal() {
    this.modal.classList.add('opacity-0')
    this.modal.querySelector('div').classList.add('scale-95')

    setTimeout(() => {
      this.modal.classList.add('hidden')
      this.modal.classList.remove('flex')
      this.modalImage.src = ''
      document.body.style.overflow = 'auto'
    }, 300)
  },

  showNextImage() {
    if (this.currentImageIndex < this.galleryImages.length - 1) {
      this.currentImageIndex++
      this.modalImage.src = this.galleryImages[this.currentImageIndex].src
    }
  },

  showPreviousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--
      this.modalImage.src = this.galleryImages[this.currentImageIndex].src
    }
  },

  initializeEvents() {
    // Close modal when clicking the close button
    this.closeButton?.addEventListener('click', () => this.closeModal())

    // Close modal when clicking outside the image
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal()
      }
    })

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('hidden')) {
        switch (e.key) {
          case 'Escape':
            this.closeModal()
            break
          case 'ArrowRight':
            this.showNextImage()
            break
          case 'ArrowLeft':
            this.showPreviousImage()
            break
        }
      }
    })

    // Touch support
    let touchStartX = 0
    let touchEndX = 0
    const minSwipeDistance = 50 // minimum distance for swipe detection

    this.modal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX
    })

    this.modal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX
      const swipeDistance = touchEndX - touchStartX

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          // Swipe right - previous image
          this.showPreviousImage()
        } else {
          // Swipe left - next image
          this.showNextImage()
        }
      }
    })

    // Add click listeners to gallery images
    this.galleryImages.forEach((img) => {
      img.addEventListener('click', () => this.openModal(img.src))
    })
  },
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  modalController.init()
})

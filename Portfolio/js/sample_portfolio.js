/**
 * Displays the contact form modal.
 */
function showContactForm() {
  // Renamed function
  const form = document.getElementById("ContactModalContainer"); // Updated ID
  if (form) {
    form.style.display = "block";
  }
}

/**
 * Hides the contact form modal.
 */
function hideContactForm() {
  // Renamed function
  const form = document.getElementById("ContactModalContainer"); // Updated ID
  if (form) {
    form.style.display = "none";
  }
}

// --- Slideshow Logic ---
let currentSlideIndex = 1; // Renamed variable, use let

// Initialize slideshow on load
document.addEventListener("DOMContentLoaded", () => {
  renderSlideshow(currentSlideIndex); // Renamed function call
  // Add fade-in effect to body after resources load
  document.body.classList.add("fade-in");
});

/**
 * Advances or retreats the slideshow by n slides.
 * @param {number} n - Number of slides to move (1 for next, -1 for previous).
 */
function navigateSlides(n) {
  // Renamed function
  renderSlideshow((currentSlideIndex += n)); // Renamed function call
}

/**
 * Displays a specific slide based on its index (n).
 * @param {number} n - The index of the slide to display (1-based).
 */
function selectSlide(n) {
  // Renamed function
  renderSlideshow((currentSlideIndex = n)); // Renamed function call
}

/**
 * Core function to display the correct slide and update indicators.
 * @param {number} n - The target slide index (1-based).
 */
function renderSlideshow(n) {
  // Renamed function
  let i; // Declare loop variable
  const slideElements = document.getElementsByClassName("SlideItem"); // Updated class name
  const dotIndicators = document.getElementsByClassName("IndicatorDot"); // Updated class name

  if (!slideElements.length || !dotIndicators.length) return; // Exit if elements not found

  // Handle wrapping around the ends
  if (n > slideElements.length) {
    currentSlideIndex = 1; // Wrap to first slide
  }
  if (n < 1) {
    currentSlideIndex = slideElements.length; // Wrap to last slide
  }

  // Hide all slides
  for (i = 0; i < slideElements.length; i++) {
    slideElements[i].style.display = "none";
  }

  // Deactivate all dots
  for (i = 0; i < dotIndicators.length; i++) {
    dotIndicators[i].className = dotIndicators[i].className.replace(
      " active",
      ""
    );
  }

  // Display the current slide and activate its dot
  slideElements[currentSlideIndex - 1].style.display = "block";
  dotIndicators[currentSlideIndex - 1].className += " active";
}

// --- Close form on outside click ---
// Use 'mousedown' for potentially better compatibility with modal interactions
document.addEventListener(
  "mousedown",
  function (event) {
    const contactForm = document.getElementById("ContactModalContainer"); // Updated ID
    // Check if the form exists and is displayed
    if (contactForm && contactForm.style.display === "block") {
      // Check if the click target is the cancel button OR
      // if the click target is outside the form itself AND outside any element that triggers the form
      const isCancelButton = event.target.matches(".CloseButton"); // Updated class
      const isOutsideForm = !event.target.closest(".ModalForm"); // Updated class
      const isOutsideTrigger =
        !event.target.closest(".ContactPopupButton") &&
        !event.target.closest(".contact-trigger"); // Updated classes

      if (isCancelButton || (isOutsideForm && isOutsideTrigger)) {
        hideContactForm(); // Renamed function call
      }
    }
  },
  false
); // Use capture phase 'false'

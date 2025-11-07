(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Date and time picker
    $('.date').datetimepicker({
        format: 'L'
    });
    $('.time').datetimepicker({
        format: 'LT'
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: false,
        animateOut: 'fadeOutLeft',
        items: 1,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

    
})(jQuery);

// Counter Code 

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");

  counters.forEach(counter => {
    // Extract numeric part from text (e.g. "32+" → 32)
    const text = counter.textContent.trim();
    const target = parseInt(text.replace(/\D/g, ""), 10);
    const suffix = text.replace(/\d/g, ""); // keep "+" if present
    let count = 0;
    const speed = 50; // smaller = faster

    const update = () => {
      const increment = Math.ceil(target / 180);
      if (count < target) {
        count += increment;
        if (count > target) count = target;
        counter.textContent = count + suffix;
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + suffix;
      }
    };

    // Start animation
    update();
  });
});

(function () {
  const viewport = document.querySelector('.testimonial-viewport');
  const track = document.querySelector('.testimonial-track');
  const prevBtn = document.querySelector('.testimonial-btn.prev');
  const nextBtn = document.querySelector('.testimonial-btn.next');
  const cardWidth = () => (track.querySelector('.testimonial-card')?.offsetWidth || 320) + 20; // card + gap
  let isDown = false, startX, scrollStart;
  let autoplayInterval = null;
  const AUTOPLAY_MS = 3500;
  let userInteracting = false;

  /* Helper: smoothly scroll by pixels */
  function scrollByPixels(px) {
    viewport.scrollBy({ left: px, behavior: 'smooth' });
  }

  /* Prev / Next button handlers */
  prevBtn.addEventListener('click', () => {
    scrollByPixels(-cardWidth());
    pauseAutoplayTemporarily();
  });
  nextBtn.addEventListener('click', () => {
    scrollByPixels(cardWidth());
    pauseAutoplayTemporarily();
  });

  /* Pointer (mouse) drag support */
  viewport.addEventListener('mousedown', (e) => {
    isDown = true;
    userInteracting = true;
    startX = e.pageX - viewport.offsetLeft;
    scrollStart = viewport.scrollLeft;
    viewport.classList.add('dragging');
  });
  viewport.addEventListener('mouseleave', () => {
    isDown = false;
    viewport.classList.remove('dragging');
  });
  viewport.addEventListener('mouseup', () => {
    isDown = false;
    viewport.classList.remove('dragging');
    userInteracting = false;
  });
  viewport.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.2; // drag speed multiplier
    viewport.scrollLeft = scrollStart - walk;
  });

  /* Touch support */
  viewport.addEventListener('touchstart', (e) => {
    userInteracting = true;
    startX = e.touches[0].pageX - viewport.offsetLeft;
    scrollStart = viewport.scrollLeft;
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.2;
    viewport.scrollLeft = scrollStart - walk;
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    userInteracting = false;
  });

  /* Keyboard accessibility: left/right arrows when viewport focused */
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByPixels(-cardWidth()); pauseAutoplayTemporarily(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollByPixels(cardWidth()); pauseAutoplayTemporarily(); }
  });

  /* Autoplay: scroll one card every AUTOPLAY_MS, pause on interaction */
  function startAutoplay() {
    if (autoplayInterval) return;
    autoplayInterval = setInterval(() => {
      if (userInteracting) return; // do not autoplay while user interacting
      // if near end, go to start smoothly
      const maxScrollLeft = track.scrollWidth - viewport.clientWidth;
      if (viewport.scrollLeft + cardWidth() > maxScrollLeft - 5) {
        viewport.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollByPixels(cardWidth());
      }
    }, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
  function pauseAutoplayTemporarily() {
    stopAutoplay();
    // restart after a delay
    setTimeout(() => startAutoplay(), 3000);
  }

  /* Pause autoplay on hover/focus */
  viewport.addEventListener('mouseenter', () => { userInteracting = true; stopAutoplay(); });
  viewport.addEventListener('mouseleave', () => { userInteracting = false; startAutoplay(); });
  viewport.addEventListener('focusin', () => { userInteracting = true; stopAutoplay(); });
  viewport.addEventListener('focusout', () => { userInteracting = false; startAutoplay(); });

  /* Start autoplay on load */
  window.addEventListener('load', startAutoplay);

  /* Resize handler — ensures we use up-to-date card width */
  window.addEventListener('resize', () => { /* nothing else needed, cardWidth reads current value */ });

})();
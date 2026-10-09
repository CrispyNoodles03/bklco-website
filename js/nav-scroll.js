window.addEventListener('scroll', function() {
    const nav = document.querySelector('.header-nav nav');
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

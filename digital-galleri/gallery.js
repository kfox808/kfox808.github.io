// Click-to-enlarge for gallery images
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

document.querySelectorAll('.zoom').forEach((btn) => {
    btn.addEventListener('click', () => {
        const img = btn.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.replaceChildren(btn.closest('figure').querySelector('figcaption').cloneNode(true));
        lightbox.showModal();
    });
});

// Clicking the dark backdrop closes it
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });

// If an image can't load, show a labelled placeholder instead of a broken icon
function markMissing(img) {
    const fig = img.closest('figure');
    if (!fig || fig.classList.contains('is-missing')) return;
    fig.classList.add('is-missing');
    const box = document.createElement('div');
    box.className = 'placeholder';
    box.textContent = fig.querySelector('strong').textContent + ' (image coming soon)';
    fig.insertBefore(box, fig.firstChild);
}
document.querySelectorAll('.zoom img').forEach((img) => {
    img.addEventListener('error', () => markMissing(img));
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) markMissing(img);
});

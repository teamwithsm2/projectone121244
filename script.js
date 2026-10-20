// 1. تفاعل زر القائمة للشاشات الصغيرة (الجوال)
const menuBtn = document.getElementById('menu-btn');
const navbar = document.querySelector('.navbar');

if (menuBtn && navbar) {
    // فتح وإغلاق القائمة عند النقر على أيقونة القائمة
    menuBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    // إغلاق القائمة تلقائياً عند النقر على أي رابط من روابط القائمة
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    });
}

// 2. تفاعل نموذج التواصل
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.onsubmit = (e) => {
        e.preventDefault();
        alert('شكراً لك! تم إرسال رسالتك بنجاح.');
        contactForm.reset();
    };
}


/* =========================================
Graduation Gallery - معرض صور التخرج
========================================= */

document.addEventListener('DOMContentLoaded', function () {
const lightbox = document.getElementById('lightbox');


// لا تنفذ كود المعرض في الصفحات التي لا تحتوي عليه.
if (!lightbox) return;

const photoButtons = document.querySelectorAll('.photo-item');
const lightboxImage = document.getElementById('lightboxImage');
const closeButton = document.getElementById('lightboxClose');
const prevButton = document.getElementById('lightboxPrev');
const nextButton = document.getElementById('lightboxNext');

let currentIndex = 0;

function showPhoto(index) {
    if (photoButtons.length === 0) return;

    currentIndex = (index + photoButtons.length) % photoButtons.length;

    const image = photoButtons[currentIndex].querySelector('img');

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add('active');

    document.body.style.overflow = 'hidden';
    closeButton.focus();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxImage.src = '';
    document.body.style.overflow = '';
}

// فتح الصورة عند الضغط عليها.
photoButtons.forEach(function (button, index) {
    button.addEventListener('click', function () {
        showPhoto(index);
    });
});

// إغلاق المعرض.
closeButton.addEventListener('click', closeLightbox);

// الصورة السابقة.
prevButton.addEventListener('click', function () {
    showPhoto(currentIndex - 1);
});

// الصورة التالية.
nextButton.addEventListener('click', function () {
    showPhoto(currentIndex + 1);
});

// الإغلاق عند الضغط خارج الصورة.
lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// التحكم باستخدام لوحة المفاتيح.
document.addEventListener('keydown', function (event) {
    if (!lightbox.classList.contains('active')) return;

    if (event.key === 'Escape') {
        closeLightbox();
    }

    if (event.key === 'ArrowRight') {
        showPhoto(currentIndex - 1);
    }

    if (event.key === 'ArrowLeft') {
        showPhoto(currentIndex + 1);
    }
});


});

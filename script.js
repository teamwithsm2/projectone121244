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
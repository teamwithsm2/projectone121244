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


/* =========================================
Nour Photography - Dashboard Image Manager
========================================= */

document.addEventListener('DOMContentLoaded', function () {
    const categoriesEl = document.getElementById('categories');


    // لا نشغّل وظائف لوحة التحكم في الصفحات الأخرى.
    if (!categoriesEl || typeof supabaseClient === 'undefined') {
        return;
    }

    const categoriesPanel = document.getElementById('categoriesPanel');
    const galleryPanel = document.getElementById('galleryPanel');
    const galleryTitle = document.getElementById('galleryTitle');
    const photosGrid = document.getElementById('photosGrid');
    const statusEl = document.getElementById('status');
    const backButton = document.getElementById('backToCategories');
    const addButton = document.getElementById('addPhotosButton');
    const deleteButton = document.getElementById('deletePhotosButton');
    const photoInput = document.getElementById('photoInput');
    const accountEmail = document.getElementById('accountEmail');
    const logoutButton = document.getElementById('logoutButton');


    const bucketName = 'nour-photo';
    const maxFileSize = 4 * 1024 * 1024;

    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    let currentCategory = null;
    let photos = [];
    let isBusy = false;

    function setStatus(message, type = '') {
        statusEl.textContent = message;
        statusEl.className = type;
    }

    function setBusy(value) {
        isBusy = value;

        addButton.disabled = value;
        deleteButton.disabled = value ||
            !photosGrid.querySelector('.photo-checkbox:checked');
    }

    function updateDeleteButton() {
        deleteButton.disabled = isBusy ||
            !photosGrid.querySelector('.photo-checkbox:checked');
    }
    async function initDashboard() {
        try {
            // التحقق من وجود جلسة
            const { data: sessionData, error: sessionError } =
                await supabaseClient.auth.getSession();

            if (sessionError) throw sessionError;

            const session = sessionData.session;

            if (!session) {
                window.location.replace('login.html');
                return;
            }

            // التحقق من صلاحية الأدمن من قاعدة البيانات
            const { data: isAdmin, error: adminError } =
                await supabaseClient.rpc('is_nour_admin');

            if (adminError) {
                console.error('Admin verification error:', adminError);
                throw adminError;
            }

            if (isAdmin !== true) {
                await supabaseClient.auth.signOut();
                window.location.replace('login.html');
                return;
            }

            // عرض إيميل المستخدم
            accountEmail.textContent =
                'الحساب الحالي: ' + session.user.email;

            // تحميل التصنيفات
            await loadCategories();

        } catch (error) {
            console.error('Dashboard initialization error:', error);
            setStatus(
                'تعذر التحقق من صلاحية الحساب: ' + error.message,
                'error'
            );
        }
    }

    async function loadCategories() {
        categoriesEl.textContent = 'جارٍ تحميل التصنيفات...';

        const { data, error } = await supabaseClient
            .from('categories')
            .select('id, name, slug')
            .order('name');

        if (error) throw error;

        categoriesEl.replaceChildren();

        if (!data || data.length === 0) {
            categoriesEl.textContent = 'لا توجد تصنيفات حاليًا.';
            return;
        }

        data.forEach(category => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'category';

            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-camera';
            icon.setAttribute('aria-hidden', 'true');

            const heading = document.createElement('h3');
            heading.textContent = category.name;

            card.append(icon, heading);

            card.addEventListener('click', () => {
                openCategory(category);
            });

            categoriesEl.appendChild(card);
        });
    }

    async function openCategory(category) {
        currentCategory = category;

        categoriesPanel.hidden = true;
        galleryPanel.hidden = false;
        galleryTitle.textContent = 'صور ' + category.name;
        photosGrid.textContent = 'جارٍ تحميل الصور...';

        setStatus('');
        updateDeleteButton();

        await loadPhotos();
    }

    async function loadPhotos() {
        if (!currentCategory) return;

        photosGrid.textContent = 'جارٍ تحميل الصور...';

        try {
            const { data, error } = await supabaseClient
                .from('photos')
                .select('id, category_id, image_path, alt_text')
                .eq('category_id', currentCategory.id);

            if (error) throw error;

            photos = data || [];
            renderPhotos();

            if (photos.length === 0) {
                photosGrid.textContent =
                    'لا توجد صور في هذا التصنيف حتى الآن. يمكنك إضافة الصور من الزر أعلاه.';
            }

        } catch (error) {
            console.error(error);
            photosGrid.textContent = 'تعذر تحميل الصور.';
            setStatus(
                'تحققي من صلاحيات قراءة جدول photos وإعدادات Supabase.',
                'error'
            );
        }
    }

    function renderPhotos() {
        photosGrid.replaceChildren();

        photos.forEach(photo => {
            const card = document.createElement('article');
            card.className = 'photo-card';

            const image = document.createElement('img');

            // يفترض أن image_path يحتوي على مسار الملف داخل الـ Bucket،
            // وليس رابطًا عامًا كاملًا.
            const { data } = supabaseClient.storage
                .from(bucketName)
                .getPublicUrl(photo.image_path);

            image.src = data.publicUrl;
            image.alt = photo.alt_text || 'صورة من أعمال نور';
            image.loading = 'lazy';

            const info = document.createElement('div');
            info.className = 'photo-card-info';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'photo-checkbox';
            checkbox.value = photo.id;
            checkbox.id = 'photo-' + photo.id;
            checkbox.setAttribute('aria-label', 'تحديد الصورة للحذف');

            checkbox.addEventListener('change', updateDeleteButton);

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = photo.alt_text || 'تحديد الصورة';

            info.append(checkbox, label);
            card.append(image, info);
            photosGrid.appendChild(card);
        });

        updateDeleteButton();
    }

    addButton.addEventListener('click', function () {
        if (!isBusy && currentCategory) {
            photoInput.click();
        }
    });

    photoInput.addEventListener('change', async function () {
        const files = Array.from(photoInput.files || []);

        if (files.length === 0 || !currentCategory) return;

        const invalidFile = files.find(file =>
            !allowedTypes.includes(file.type) ||
            file.size > maxFileSize ||
            file.size === 0
        );

        if (invalidFile) {
            setStatus(
                'الملف "' + invalidFile.name +
                '" غير صالح. استخدمي JPG أو PNG أو WebP، بحجم لا يتجاوز 4MB للصورة.',
                'error'
            );

            photoInput.value = '';
            return;
        }

        setBusy(true);
        setStatus('جارٍ رفع الصور...');

        const uploadedPaths = [];

        try {
            for (const file of files) {
                const safeName = file.name
                    .normalize('NFKD')
                    .replace(/[^a-zA-Z0-9._-]/g, '_');

                const filePath =
                    currentCategory.slug + '/' +
                    crypto.randomUUID() + '_' + safeName;

                const { error: uploadError } = await supabaseClient
                    .storage
                    .from(bucketName)
                    .upload(filePath, file, {
                        contentType: file.type,
                        upsert: false
                    });

                if (uploadError) throw uploadError;

                uploadedPaths.push(filePath);

                const { error: insertError } = await supabaseClient
                    .from('photos')
                    .insert({
                        category_id: currentCategory.id,
                        image_path: filePath,
                        alt_text: file.name.replace(/\.[^.]+$/, '')
                    });

                if (insertError) throw insertError;
            }

            setStatus('تم رفع الصور وإضافتها إلى المعرض بنجاح.', 'success');
            await loadPhotos();

        } catch (error) {
            console.error(error);

            // محاولة تنظيف الملفات التي رُفعت إذا فشلت العملية.
            if (uploadedPaths.length > 0) {
                const { error: cleanupError } = await supabaseClient
                    .storage
                    .from(bucketName)
                    .remove(uploadedPaths);

                if (cleanupError) {
                    console.error('تعذر تنظيف بعض الملفات:', cleanupError);
                }
            }

            setStatus(
                'تعذرت إضافة بعض الصور. تحققي من صلاحيات Storage وجدول photos.',
                'error'
            );

            await loadPhotos();

        } finally {
            photoInput.value = '';
            setBusy(false);
            updateDeleteButton();
        }
    });

    deleteButton.addEventListener('click', async function () {
        if (isBusy || !currentCategory) return;

        const selectedIds = Array.from(
            photosGrid.querySelectorAll('.photo-checkbox:checked')
        ).map(input => input.value);

        if (selectedIds.length === 0) {
            setStatus('حددي الصور التي تريدين حذفها أولًا.', 'error');
            return;
        }

        const confirmed = window.confirm(
            'هل أنتِ متأكدة من حذف ' +
            selectedIds.length +
            ' صورة؟ لا يمكن التراجع عن هذا الإجراء.'
        );

        if (!confirmed) return;

        const selectedPhotos = photos.filter(photo =>
            selectedIds.includes(String(photo.id))
        );

        setBusy(true);
        setStatus('جارٍ حذف الصور المحددة...');

        try {
            // حذف سجلات الصور من الجدول أولًا.
            const { data: deletedRows, error: deleteError } =
                await supabaseClient
                    .from('photos')
                    .delete()
                    .eq('category_id', currentCategory.id)
                    .in('id', selectedIds)
                    .select('id, image_path');

            if (deleteError) throw deleteError;

            const deletedIds = new Set(
                (deletedRows || []).map(row => String(row.id))
            );

            const deletedPaths = (deletedRows || [])
                .map(row => row.image_path)
                .filter(Boolean);

            // إزالة الملفات من Storage.
            if (deletedPaths.length > 0) {
                const { error: storageError } = await supabaseClient
                    .storage
                    .from(bucketName)
                    .remove(deletedPaths);

                if (storageError) {
                    console.error(storageError);

                    setStatus(
                        'حُذفت سجلات الصور، لكن تعذر حذف بعض الملفات من Storage. راجعي صلاحيات الحذف.',
                        'error'
                    );
                } else {
                    setStatus('تم حذف الصور المحددة بنجاح.', 'success');
                }
            } else {
                setStatus('تم حذف سجلات الصور المحددة.', 'success');
            }

            // إزالة الصور المحذوفة فعليًا من البيانات المحلية.
            photos = photos.filter(photo =>
                !deletedIds.has(String(photo.id))
            );

            renderPhotos();

            if (photos.length === 0) {
                photosGrid.textContent = 'لا توجد صور في هذا التصنيف حاليًا.';
            }

        } catch (error) {
            console.error(error);
            setStatus(
                'تعذر حذف الصور. تحققي من صلاحيات الحذف في جدول photos.',
                'error'
            );

        } finally {
            setBusy(false);
            updateDeleteButton();
        }
    });

    backButton.addEventListener('click', function () {
        galleryPanel.hidden = true;
        categoriesPanel.hidden = false;

        currentCategory = null;
        photos = [];

        photosGrid.replaceChildren();
        setStatus('');
    });

    logoutButton?.addEventListener('click', async function () {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            setStatus('تعذر تسجيل الخروج. حاولي مرة أخرى.', 'error');
            return;
        }

        window.location.replace('login.html');
    });

    initDashboard().catch(error => {
        console.error(error);
        setStatus('حدث خطأ أثناء تهيئة لوحة التحكم.', 'error');
    });


});

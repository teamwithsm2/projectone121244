
document.addEventListener('DOMContentLoaded', async function () {
    const gallery = document.getElementById('babyBirthdayGallery');

    if (!gallery || typeof supabaseClient === 'undefined') {
        return;
    }

    const categoryId = '9669f1ab-8567-4c61-bdc1-2ae4f752050e';
    const bucketName = 'nour-photo';

    gallery.textContent = 'جارٍ تحميل الصور...';

    try {
        const { data: photos, error } = await supabaseClient
            .from('photos')
            .select('id, image_path, alt_text')
            .eq('category_id', categoryId);

        if (error) {
            throw error;
        }

        gallery.replaceChildren();

        if (!photos || photos.length === 0) {
            gallery.textContent = 'لا توجد صور في هذا المعرض حاليًا.';
            return;
        }

        photos.forEach(function (photo, index) {
            const { data } = supabaseClient
                .storage
                .from(bucketName)
                .getPublicUrl(photo.image_path);

            const button = document.createElement('button');
            button.className = 'photo-item';
            button.type = 'button';

            const img = document.createElement('img');
            img.src = data.publicUrl;
            img.alt = photo.alt_text || `صورة عيد ميلاد الأطفال ${index + 1}`;
            img.loading = 'lazy';

            img.addEventListener('error', function () {
                console.error('تعذر تحميل الصورة:', photo.image_path);
            });

            button.appendChild(img);
            gallery.appendChild(button);
        });

    } catch (error) {
        console.error('خطأ في تحميل صور عيد ميلاد الأطفال:', error);
        gallery.textContent = 'تعذر تحميل الصور. حاولي مرة أخرى.';
    }
});

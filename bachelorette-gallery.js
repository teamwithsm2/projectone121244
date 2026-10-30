document.addEventListener('DOMContentLoaded', async function () {
const gallery = document.getElementById('bacheloretteGallery');


if (!gallery || typeof supabaseClient === 'undefined') {
    return;
}

const categorySlug = 'bachelorette';
const bucketName = 'nour-photo';

try {
    gallery.textContent = 'جارٍ تحميل الصور...';

    const { data: category, error: categoryError } = await supabaseClient
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

    if (categoryError) throw categoryError;

    const { data: photos, error: photosError } = await supabaseClient
        .from('photos')
        .select('id, image_path, alt_text')
        .eq('category_id', category.id);

    if (photosError) throw photosError;

    gallery.replaceChildren();

    if (!photos || photos.length === 0) {
        gallery.textContent = 'لا توجد صور في هذا المعرض حاليًا.';
        return;
    }

    photos.forEach(function (photo, index) {
        const { data } = supabaseClient.storage
            .from(bucketName)
            .getPublicUrl(photo.image_path);

        const button = document.createElement('button');
        button.className = 'photo-item';
        button.type = 'button';

        const img = document.createElement('img');
        img.src = data.publicUrl;
        img.alt = photo.alt_text || `صورة توديع العزوبية ${index + 1}`;
        img.loading = 'lazy';

        img.addEventListener('error', function () {
            console.error('تعذر تحميل الصورة:', photo.image_path);
        });

        button.appendChild(img);
        gallery.appendChild(button);
    });

} catch (error) {
    console.error('خطأ في تحميل صور توديع العزوبية:', error);
    gallery.textContent = 'تعذر تحميل الصور. تحققي من إعدادات قاعدة البيانات.';
}


});

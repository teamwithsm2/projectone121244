const SUPABASE_URL = 'https://wlrrudwtvaayfxhbcyih.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
    'sb_publishable_HLSqrmp2JVGe4T-dz0UWWA_wcKCY4P_';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

// روابط صفحات المعارض الحالية
const categoryPages = {
    'الخطوبة والزفاف': 'galleries/wedding.html',
    'تصوير منتجات': 'galleries/products.html',
    'أعياد الميلاد': 'galleries/birthdays.html',
    'توديع عزوبية': 'galleries/Bachelorette party.html',
    'أعياد ميلاد أطفال': 'galleries/babybirthdays.html',
    'التخرج': 'galleries/graduation.html'
};

// أيقونات الفئات
const categoryIcons = {
    'الخطوبة والزفاف': 'fa-ring',
    'منتجات': 'fa-box-open',
    'أعياد الميلاد': 'fa-birthday-cake',
    'توديع عزوبية': 'fa-heart',
    'أعياد ميلاد أطفال': 'fa-baby',
    'التخرج': 'fa-graduation-cap'
};

// تحميل الفئات من Supabase
async function loadCategories() {
    const container = document.getElementById('categories-container');

    if (!container) return;

    container.textContent = 'جاري تحميل التصنيفات...';

    try {
        const { data, error } = await supabaseClient
            .from('categories')
            .select('*');

        if (error) throw error;

        container.replaceChildren();

        if (!data || data.length === 0) {
            container.textContent = 'لا توجد تصنيفات حاليًا.';
            return;
        }

        data.forEach(category => {
            // نفترض أن اسم العمود هو name
            const name = category.name;

            if (!name) return;

            const link = document.createElement('a');
            link.className = 'service-box purple';
            link.style.textDecoration = 'none';
            link.style.color = 'inherit';
            link.href = categoryPages[name] || '#';

            const icon = document.createElement('i');
            icon.className = `fas ${categoryIcons[name] || 'fa-camera'}`;

            const heading = document.createElement('h3');
            heading.textContent = name;

            link.appendChild(icon);
            link.appendChild(heading);

            container.appendChild(link);
        });

    } catch (error) {
        console.error('خطأ في تحميل التصنيفات:', error);

        container.textContent =
            'تعذر تحميل التصنيفات. يرجى المحاولة لاحقًا.';
    }
}

document.addEventListener('DOMContentLoaded', loadCategories);
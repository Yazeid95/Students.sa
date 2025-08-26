// College Selection JavaScript

let selectedCollege = null;
let selectedMajor = null;

// Major data for each college
const majorData = {
    administrative: {
        name: 'College of Administrative and Financial Sciences',
        nameAr: 'كلية العلوم الإدارية والمالية',
        majors: [
            { id: 'management', name: 'Major in Management', nameAr: 'تخصص في الإدارة' },
            { id: 'ecommerce', name: 'E-Commerce', nameAr: 'التجارة الإلكترونية' },
            { id: 'accounting', name: 'Accounting', nameAr: 'المحاسبة' },
            { id: 'finance', name: 'Finance', nameAr: 'المالية' }
        ]
    },
    computing: {
        name: 'College of Computing and Informatics',
        nameAr: 'كلية الحوسبة والمعلوماتية',
        majors: [
            { id: 'cs', name: 'Computer Science', nameAr: 'علوم الحاسوب' },
            { id: 'ds', name: 'Data Science', nameAr: 'علوم البيانات' },
            { id: 'it', name: 'Information Technology', nameAr: 'تقنية المعلومات' }
        ]
    },
    health: {
        name: 'College of Health Sciences',
        nameAr: 'كلية العلوم الصحية',
        majors: [
            { id: 'health-informatics', name: 'Health Informatics', nameAr: 'المعلوماتية الصحية' },
            { id: 'public-health', name: 'Public Health', nameAr: 'الصحة العامة' }
        ]
    },
    science: {
        name: 'College Of Science and Theoretical Studies',
        nameAr: 'كلية العلوم والدراسات النظرية',
        majors: [
            { id: 'law', name: 'Law', nameAr: 'القانون' },
            { id: 'digital-media', name: 'Digital Media', nameAr: 'الإعلام الرقمي' },
            { id: 'english', name: 'English Language and Translation', nameAr: 'اللغة الإنجليزية والترجمة' }
        ]
    }
};

function selectCollege(college) {
    // Remove previous selection
    document.querySelectorAll('.college-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked college
    const clickedBtn = document.querySelector(`[data-college="${college}"]`);
    clickedBtn.classList.add('selected');
    
    selectedCollege = college;
    // Persist selection so returning users keep their choice
    try { localStorage.setItem('selectedCollege', college); } catch(e) {}
    
    // Enable continue button
    const continueBtn = document.getElementById('continueBtn');
    continueBtn.disabled = false;
}

function continueToMajors() {
    if (!selectedCollege) return;
    
    // Hide college view and show major view
    document.getElementById('collegeView').style.display = 'none';
    document.getElementById('majorView').style.display = 'block';
    
    // Update header
    const college = majorData[selectedCollege];
    const isArabic = document.body.classList.contains('rtl');
    document.getElementById('selectedCollegeName').textContent = isArabic ? college.nameAr : college.name;
    
    // Populate majors
    const majorOptions = document.getElementById('majorOptions');
    majorOptions.innerHTML = '';
    
    college.majors.forEach(major => {
        const majorBtn = document.createElement('button');
        majorBtn.className = 'major-btn';
        majorBtn.setAttribute('data-major', major.id);
        majorBtn.onclick = () => selectMajor(major.id);
        
        majorBtn.innerHTML = `
            <div class="major-icon">
                <svg viewBox="0 0 24 24" width="32" height="32">
                    <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </div>
            <span>${isArabic ? major.nameAr : major.name}</span>
        `;
        
        majorOptions.appendChild(majorBtn);
    });
    
    // Reset major selection
    selectedMajor = null;
    document.getElementById('finishBtn').disabled = true;
    
    // Update language content for major view
    updateLanguageForMajorView();
}

function selectMajor(majorId) {
    // Remove previous selection
    document.querySelectorAll('.major-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked major
    const clickedBtn = document.querySelector(`[data-major="${majorId}"]`);
    clickedBtn.classList.add('selected');
    
    selectedMajor = majorId;
    
    // Enable finish button
    const finishBtn = document.getElementById('finishBtn');
    finishBtn.disabled = false;
}

function backToColleges() {
    document.getElementById('majorView').style.display = 'none';
    document.getElementById('collegeView').style.display = 'block';
}

function finishSelection() {
    if (!selectedCollege || !selectedMajor) return;
    
    // Here you can handle the final selection
    const college = majorData[selectedCollege];
    const major = college.majors.find(m => m.id === selectedMajor);
    const isArabic = document.body.classList.contains('rtl');
    const langFolder = isArabic ? 'AR' : 'EN';
    const computingBase = `${langFolder}/college-of-computing-and-informatics`;
    const healthBase = `${langFolder}/college-of-health-sciences`;
    
    // Check if Information Technology is selected
    if (selectedCollege === 'computing' && selectedMajor === 'it') {
        // Redirect to Information Technology planner (respect current language)
        window.location.href = `${computingBase}/information-technology.html`;
        return;
    }
    
    // Check if Computer Science is selected
    if (selectedCollege === 'computing' && selectedMajor === 'cs') {
        // Redirect to Computer Science planner (respect current language)
        window.location.href = `${computingBase}/computer-science.html`;
        return;
    }
    
    // Check if Data Science is selected
    if (selectedCollege === 'computing' && selectedMajor === 'ds') {
        // Redirect to Data Science planner (respect current language)
        window.location.href = `${computingBase}/data-science.html`;
        return;
    }
    
    // Check if Health Informatics is selected
    if (selectedCollege === 'health' && selectedMajor === 'health-informatics') {
        window.location.href = `${healthBase}/health-informatics.html`;
        return;
    }
    // Check if Public Health is selected
    if (selectedCollege === 'health' && selectedMajor === 'public-health') {
        window.location.href = `${healthBase}/public-health.html`;
        return;
    }
    
    // Fallback alert for majors without planners yet
    if (isArabic) {
        alert(`تم إكمال الاختيار.\nالكلية: ${college.nameAr}\nالتخصص: ${major.nameAr}`);
    } else {
        alert(`Selection completed!\nCollege: ${college.name}\nMajor: ${major.name}`);
    }
    
    // You can redirect or proceed to the next step here
    console.log('Selected:', { college: selectedCollege, major: selectedMajor });
}

function goBack() {
    window.location.href = 'index.html';
}

// Theme and Language functions
function toggleTheme() {
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
        localStorage.setItem('theme', 'light');
    } else {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
        localStorage.setItem('theme', 'dark');
    }
}

function toggleLanguage() {
    const body = document.body;
    const langText = document.getElementById('langText');
    const isArabic = body.classList.contains('rtl');
    
    if (isArabic) {
        // Switch to English
        body.classList.remove('rtl');
        if (langText) langText.textContent = 'ع';
        updateContentToEnglish();
        localStorage.setItem('language', 'en');
    } else {
        // Switch to Arabic
        body.classList.add('rtl');
        if (langText) langText.textContent = 'EN';
        updateContentToArabic();
        localStorage.setItem('language', 'ar');
    }
}

function updateContentToArabic() {
    // Update logo and main content
    const logo = document.querySelector('.logo');
    if (logo) logo.textContent = 'طلاب.السعودية';
    
    // Check which view is currently visible
    const collegeView = document.getElementById('collegeView');
    
    if (!collegeView || collegeView.style.display !== 'none') {
        // Update college view
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) subtitle.textContent = 'ما هي كليتك؟';
        updateCollegeContentToArabic();
    } else {
        // Update major view
        updateLanguageForMajorView();
    }
}

function updateContentToEnglish() {
    // Update logo and main content
    const logo = document.querySelector('.logo');
    if (logo) logo.textContent = 'Students.sa';
    
    // Check which view is currently visible
    const collegeView = document.getElementById('collegeView');
    
    if (!collegeView || collegeView.style.display !== 'none') {
        // Update college view
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) subtitle.textContent = "What's your College?";
        updateCollegeContentToEnglish();
    } else {
        // Update major view
        updateLanguageForMajorView();
    }
}

function updateCollegeContentToArabic() {
    // Update college options
    const colleges = document.querySelectorAll('.college-btn');
    const arabicNames = [
        'كلية العلوم الإدارية والمالية',
        'كلية الحوسبة والمعلوماتية', 
        'كلية العلوم الصحية',
        'كلية العلوم والدراسات النظرية'
    ];
    
    const arabicMajors = [
        ['إدارة', 'التجارة الإلكترونية', 'المحاسبة', 'المالية'],
        ['علوم الحاسوب', 'علوم البيانات', 'تقنية المعلومات'],
        ['المعلوماتية الصحية', 'الصحة العامة'],
        ['القانون', 'الإعلام الرقمي', 'اللغة الإنجليزية والترجمة']
    ];
    
    colleges.forEach((college, index) => {
        const collegeName = college.querySelector('.college-name');
        const majorsList = college.querySelector('.majors-list');
        
        if (collegeName) collegeName.textContent = arabicNames[index];
        
        // Update majors
        if (majorsList) {
            const majors = majorsList.querySelectorAll('.major');
            majors.forEach((major, majorIndex) => {
                if (arabicMajors[index] && arabicMajors[index][majorIndex]) {
                    major.textContent = arabicMajors[index][majorIndex];
                }
            });
        }
    });
    
    // Update navigation buttons
    const backBtn = document.querySelector('.nav-btn.secondary');
    const continueBtn = document.querySelector('.nav-btn.primary');
    
    if (backBtn) {
        backBtn.innerHTML = `
            <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
            العودة لتسجيل الدخول
        `;
    }
    
    if (continueBtn) {
        continueBtn.innerHTML = `
            متابعة
            <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
        `;
    }
}

function updateCollegeContentToEnglish() {
    // Update college options
    const colleges = document.querySelectorAll('.college-btn');
    const englishNames = [
        'College of Administrative and Financial Sciences',
        'College of Computing and Informatics',
        'College of Health Sciences',
        'College Of Science and Theoretical Studies'
    ];
    
    const englishMajors = [
        ['Management', 'E-Commerce', 'Accounting', 'Finance'],
        ['Computer Science', 'Data Science', 'Information Technology'],
        ['Health Informatics', 'Public Health'],
        ['Law', 'Digital Media', 'English Language and Translation']
    ];
    
    colleges.forEach((college, index) => {
        const collegeName = college.querySelector('.college-name');
        const majorsList = college.querySelector('.majors-list');
        
        if (collegeName) collegeName.textContent = englishNames[index];
        
        // Update majors
        if (majorsList) {
            const majors = majorsList.querySelectorAll('.major');
            majors.forEach((major, majorIndex) => {
                if (englishMajors[index] && englishMajors[index][majorIndex]) {
                    major.textContent = englishMajors[index][majorIndex];
                }
            });
        }
    });
    
    // Update navigation buttons
    const backBtn = document.querySelector('.nav-btn.secondary');
    const continueBtn = document.querySelector('.nav-btn.primary');
    
    if (backBtn) {
        backBtn.innerHTML = `
            <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
            Back to Sign In
        `;
    }
    
    if (continueBtn) {
        continueBtn.innerHTML = `
            Continue
            <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
        `;
    }
}

function updateLanguageForMajorView() {
    const isArabic = document.body.classList.contains('rtl');
    
    // Update major view subtitle
    const majorSubtitle = document.getElementById('majorSubtitle');
    if (majorSubtitle) {
        majorSubtitle.textContent = isArabic ? 'اختر تخصصك' : 'Choose your Major';
    }
    
    // Update selected college name
    if (selectedCollege) {
        const college = majorData[selectedCollege];
        const selectedCollegeName = document.getElementById('selectedCollegeName');
        if (selectedCollegeName) {
            selectedCollegeName.textContent = isArabic ? college.nameAr : college.name;
        }
    }
    
    // Update major buttons
    const majorBtns = document.querySelectorAll('.major-btn');
    majorBtns.forEach((btn) => {
        const majorId = btn.getAttribute('data-major');
        if (selectedCollege && majorId) {
            const college = majorData[selectedCollege];
            const major = college.majors.find(m => m.id === majorId);
            if (major) {
                const span = btn.querySelector('span');
                if (span) {
                    span.textContent = isArabic ? major.nameAr : major.name;
                }
            }
        }
    });
    
    // Update navigation buttons for major view
    const backBtn = document.querySelector('.nav-btn.secondary');
    if (backBtn) {
        backBtn.innerHTML = `
            <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
            ${isArabic ? 'العودة للكليات' : 'Back to Colleges'}
        `;
    }
    
    const finishBtn = document.getElementById('finishBtn');
    if (finishBtn) {
        finishBtn.innerHTML = `
            ${isArabic ? 'إنهاء' : 'Finish'}
            <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
        `;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
    }
    
    // Initialize language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'ar') {
        document.body.classList.add('rtl');
        const langText = document.getElementById('langText');
        if (langText) langText.textContent = 'EN';
        updateContentToArabic();
    }
    
    // Check if there's a pre-selected college
    const preSelectedCollege = localStorage.getItem('selectedCollege');
    if (preSelectedCollege) {
        selectCollege(preSelectedCollege);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const errorIcon = document.querySelector('.error-icon');
    if (errorIcon) {
        setTimeout(() => {
            errorIcon.style.transform = 'scale(1.2)';
            errorIcon.style.transition = 'transform 0.3s';

            setTimeout(() => {
                errorIcon.style.transform = 'scale(1)';
            }, 300);
        }, 500);
    }
});

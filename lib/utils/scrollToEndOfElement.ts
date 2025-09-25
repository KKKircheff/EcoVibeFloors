export const scrollToEndOfElement = (id: string, offset: number = 100): void => {
    const element = document.getElementById(id);
    if (!element) {
        console.error('Element not found:', id);
        return;
    }

    // Get element's position and dimensions
    const elementRect = element.getBoundingClientRect();

    // Calculate absolute position to scroll to the end of the element
    // We need to add current scroll position to get absolute position
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const absoluteBottomPosition = currentScrollY + elementRect.bottom;
    const scrollToPosition = absoluteBottomPosition - offset;

    console.log(
        '📍 Element top:',
        elementRect.top,
        'Element bottom:',
        elementRect.bottom,
        'Current scroll:',
        currentScrollY,
        'Target position:',
        scrollToPosition
    );

    // Scroll to absolute position
    window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth',
    });

    // Verify positioning after scroll completes
    setTimeout(() => {
        const verifyRect = element.getBoundingClientRect();
        console.log('🔍 After scroll - Element top:', verifyRect.top, 'Element bottom:', verifyRect.bottom);
    }, 1000);
};

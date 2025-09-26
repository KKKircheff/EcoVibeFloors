export const scrollToEndOfElement = (id: string, offset: number = 100): void => {
    const element = document.getElementById(id);

    if (!element) {
        console.error('Element not found:', id);
        return;
    }

    const elementRect = element.getBoundingClientRect();

    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const absoluteBottomPosition = currentScrollY + elementRect.bottom;
    const scrollToPosition = absoluteBottomPosition - offset;

    window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth',
    });
};

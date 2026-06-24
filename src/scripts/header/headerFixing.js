/*
     ------------------
	|   HEADER FIXING   |
	  -----------------
*/
/**
  * Fixing header on scroll
*/
export default function headerFixing() {
    const header = document.querySelector('.js-header');

    if (header) {
        const fixedClass = 'is-fixed';
        let scrollTop = 0;
        let headerHeight;
        let lastScrollTop = 0;
        const fixing = () => {

            if (!document.querySelector('.is-menu-active') && !document.querySelector('.is-catalog-active')) {
                
                scrollTop = window.scrollY;
                headerHeight = header.offsetHeight;

                if (scrollTop > (headerHeight * 1.2)) {
                    header.classList.add(fixedClass);

                    if (scrollTop > lastScrollTop && scrollTop >= window.innerHeight * 0.5){
                        header.classList.add('is-hidden');
                    } else {
                        header.classList.remove('is-hidden');
                    }

                } else {
                    header.classList.remove(fixedClass, 'is-hidden');
                }

                lastScrollTop = scrollTop;
            }
        };

        fixing();

        window.addEventListener('scroll', () => {
            
            fixing();
        });
    }
}

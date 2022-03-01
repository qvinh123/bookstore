export const formatPrice = (price) => {
    return Intl.NumberFormat('vi-VN', /*{ style: 'currency', currency: 'VND' }*/).format(price).replace(".", ",")
}

export const saveProductLocal = (product) => {
    if (localStorage) {
        let lastViews;
        if (!localStorage['lastViews']) lastViews = [];
        else lastViews = JSON.parse(localStorage['lastViews']);
        if (!(lastViews instanceof Array)) lastViews = [];
        lastViews.unshift(product)

        const renderLastViews = lastViews.reduce((unique, o) => {
            if (!unique.some(obj => obj?._id === o?._id)) {
                unique.push(o);
            }
            return unique
        }, [])

        if (renderLastViews.length > 11) {
            renderLastViews.splice(11, renderLastViews.length)
        }

        localStorage.setItem('lastViews', JSON.stringify(renderLastViews));
    }
}

export const panigationProduct = (currentPage, resultPerPage, products) => {
    const indexOfLastProducts = (currentPage + 1) * resultPerPage;
    const indexOfFirstProducts = indexOfLastProducts - resultPerPage;
    const currentProducts = products?.slice(indexOfFirstProducts, indexOfLastProducts);

    return currentProducts
}

export function handlerRatings(fn, numberRating = "") {
    const stars = document.querySelectorAll('.star')

    stars.forEach((star, index) => {
        star.starValue = index + 1;
        if (numberRating) {
            for (let i = 0; i < numberRating; i++) {
                stars[i].classList.add('bg-rating-click')
            }
        }
        ['click', 'mouseover', 'mouseout'].forEach(function (e) {
            star.addEventListener(e, showRatings);
        })
    })

    function showRatings(e) {
        stars.forEach((star, index) => {
            if (e.type === 'click') {
                if (index < this.starValue) {
                    star.classList.add('bg-rating-click');

                    fn(this.starValue)
                } else {
                    star.classList.remove('bg-rating-click')
                }
            }

            if (e.type === 'mouseover') {
                if (index < this.starValue) {
                    star.classList.add('bg-rating-hover')
                } else {
                    star.classList.remove('bg-rating-hover')
                }
            }

            if (e.type === 'mouseout') {
                star.classList.remove('bg-rating-hover')
            }
        })
    }
}

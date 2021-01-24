import View from "./view";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
    _parentEl = document.querySelector(".pagination");

    addHandlerRender(handler) {
        this._parentEl.addEventListener("click", (e) => {
            const button = e.target.closest(".btn--inline");
            if (!button) return;

            handler(+button.dataset.goto);
        });
    }
    _generateHTML() {
        const maxPage = Math.ceil(
            this._data.results.length / this._data.resultsPerPage
        );
        const currentPage = this._data.page;

        if (currentPage === 1 && maxPage === 1) return "";
        if (currentPage === 1 && maxPage > 1)
            return this._generateNextButtonHTML(currentPage);
        if (currentPage === maxPage)
            return this._generatePrevButtonHTML(currentPage);
        return (
            this._generateNextButtonHTML(currentPage) +
            this._generatePrevButtonHTML(currentPage)
        );
    }
    _generateNextButtonHTML(currentPage) {
        return `
            <button data-goto = ${
                currentPage + 1
            } class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`;
    }

    _generatePrevButtonHTML(currentPage) {
        return `<button data-goto = ${
            currentPage - 1
        } class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currentPage - 1}</span>
                </button>`;
    }
}

export default new PaginationView();

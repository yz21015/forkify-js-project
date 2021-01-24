class SearchView {
    #parentEl = document.querySelector(".search");

    getQuery() {
        const query = this.#parentEl.querySelector("input").value;
        this.#parentEl.querySelector("input").value = "";
        return query;
    }

    addHandlerRender(handler) {
        this.#parentEl.addEventListener("submit", (e) => {
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();

import icons from "url:../../img/icons.svg";

export default class View {
    _data;

    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this.showErrorMsg();
        this._data = data;
        const html = this._generateHTML();

        if (!render) return html;

        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin", html);
    }

    update(data) {
        this._data = data;
        const newHTML = this._generateHTML();
        const newDOM = document.createRange().createContextualFragment(newHTML);
        const newElements = newDOM.querySelectorAll("*");
        const curElements = this._parentEl.querySelectorAll("*");
        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // update text elements
            if (
                !newEl.isEqualNode(curEl) &&
                curEl.firstChild?.nodeValue.trim() !== ""
            ) {
                curEl.textContent = newEl.textContent;
            }
            // update attributes
            if (!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach((attr) =>
                    curEl.setAttribute(attr.name, attr.value)
                );
            }
        });
    }

    showSpinner() {
        const html = `<div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>`;
        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin", html);
    }

    showErrorMsg(message = this._errorMessage) {
        const html = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin", html);
    }

    showMessage(message = this._message) {
        const html = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin", html);
    }

    _clear() {
        this._parentEl.innerHTML = "";
    }
}

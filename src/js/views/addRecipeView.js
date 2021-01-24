import View from "./view";

class AddRecipeView extends View {
    _message = "The recipe is uploaded Successfully :)";
    _parentEl = document.querySelector(".upload");
    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnOpen = document.querySelector(".nav__btn--add-recipe");
    _btnClose = this._window.querySelector(".btn--close-modal");

    constructor() {
        super();

        [this._btnOpen, this._btnClose, this._overlay].forEach((el) =>
            el.addEventListener("click", this.toggleWindow)
        );
    }

    toggleWindow = () => {
        this._window.classList.toggle("hidden");
        this._overlay.classList.toggle("hidden");
    };

    addHandlerAddRecipe(handler) {
        this._parentEl.addEventListener("submit", function (e) {
            e.preventDefault();
            const formData = [...new FormData(this)];
            const data = Object.fromEntries(formData);
            handler(data);
        });
    }
}

export default new AddRecipeView();

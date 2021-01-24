import View from "./view";
import PreviewView from "./previewView";

class BookmarkView extends View {
    _parentEl = document.querySelector(".bookmarks__list");
    _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";

    _generateHTML() {
        return this._data
            .map((bookmark) => PreviewView.render(bookmark, false))
            .join("");
    }

    blink() {
        const container = this._parentEl.closest(".bookmarks");
        container.style.visibility = "visible";
        container.style.opacity = 1;
        setTimeout(() => {
            container.style.visibility = "hidden";
            container.style.opacity = 0;
        }, 1000);
    }
}

export default new BookmarkView();

import View from "./view";
import PreviewView from "./previewView";

class ResultsView extends View {
    _parentEl = document.querySelector(".results");
    _errorMessage = "No recipes found for your query. Please try again :)";

    _generateHTML() {
        return this._data
            .map((result) => PreviewView.render(result, false))
            .join("");
    }
}

export default new ResultsView();

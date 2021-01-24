import * as model from "./model";
import RecipeView from "./views/recipeView";
import AddRecipeView from "./views/addRecipeView";
import SearchView from "./views/searchView";
import ResultsView from "./views/resultsView";
import BookmarkView from "./views/bookmarkView";
import PaginationView from "./views/paginationView";
import { MODAL_CLOSE_SEC } from "./config";
import "core-js/stable";
import "regenerator-runtime/runtime";

// if (module.hot) {
//     module.hot.accept();
// }

const controlRecipes = async function () {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;
        RecipeView.showSpinner();
        // update results view to show the selected recipe
        ResultsView.update(model.getSearchResultsPage());
        BookmarkView.update(model.state.bookmark);

        // 1. fetch recipe
        await model.loadRecipe(id);

        // 2. render recipe
        RecipeView.render(model.state.recipe);
    } catch (err) {
        console.log(err);
        RecipeView.showErrorMsg();
    }
};

const controlSearchResults = async function () {
    try {
        ResultsView.showSpinner();
        const query = SearchView.getQuery();
        await model.loadSearchResults(query);
        ResultsView.render(model.getSearchResultsPage());
        PaginationView.render(model.state.search);
    } catch (err) {
        console.log(err);
    }
};

const controlPagination = function (goto) {
    ResultsView.render(model.getSearchResultsPage(goto));
    PaginationView.render(model.state.search);
};

const controlServings = function (newServings) {
    model.updateServings(newServings);
    RecipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
    if (model.state.recipe.bookmarked)
        model.removeBookmark(model.state.recipe.id);
    else model.addBookmark(model.state.recipe);
    RecipeView.update(model.state.recipe);
    BookmarkView.render(model.state.bookmark);
    // BookmarkView.blink();
};

const controlAddRecipe = async function (data) {
    try {
        AddRecipeView.showSpinner();
        // upload the recipe
        await model.uploadRecipe(data);
        // display a success message
        AddRecipeView.showMessage();
        // render the newly uploaded recipe
        BookmarkView.render(model.state.bookmark);
        RecipeView.render(model.state.recipe);
        // change the id in URL
        window.history.pushState(null, "", `#${model.state.recipe.id}`);
        // close the modal after 2 secs
        setTimeout(() => {
            AddRecipeView.toggleWindow();
        }, MODAL_CLOSE_SEC * 1000);
    } catch (error) {
        AddRecipeView.showErrorMsg(error.message);
    }
};

function init() {
    BookmarkView.render(model.state.bookmark);

    RecipeView.addHandlerRender(controlRecipes);
    RecipeView.addHandlerServings(controlServings);
    RecipeView.addHandlerAddBookmark(controlAddBookmark);
    SearchView.addHandlerRender(controlSearchResults);
    PaginationView.addHandlerRender(controlPagination);
    AddRecipeView.addHandlerAddRecipe(controlAddRecipe);
}

init();

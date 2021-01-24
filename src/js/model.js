import { stat } from "fs";
import { API_URL, RESULTS_PER_PAGE, KEY } from "./config";
import { AJAX, cameliseKeys } from "./helpers";
export const state = {
    recipe: {},
    search: {
        query: "",
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
        page: 1,
    },
    bookmark: [],
};

export const loadRecipe = async function (id) {
    try {
        const res = await AJAX(`${API_URL}${id}?key=${KEY}`);
        state.recipe = cameliseKeys(res.data.recipe);
        if (state.bookmark.some((recipe) => recipe.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
    } catch (err) {
        throw err;
    }
};

export const loadSearchResults = async function (query) {
    state.search.query = query;

    try {
        const res = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.results = res.data.recipes.map(cameliseKeys);
    } catch (err) {
        throw err;
    }
};

export const getSearchResultsPage = function (page = 1) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach((ing) => {
        ing.quantity = ing.quantity * (newServings / state.recipe.servings);
    });
    state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
    state.bookmark.push(recipe);
    if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;
    persistBookmark();
};

export const removeBookmark = function (id) {
    const index = state.bookmark.findIndex((recipe) => recipe.id === id);
    if (index !== -1) state.bookmark.splice(index, 1);
    if (state.recipe.id === id) state.recipe.bookmarked = false;
    persistBookmark();
};

const persistBookmark = function () {
    localStorage.setItem("bookmark", JSON.stringify(state.bookmark));
};

export const uploadRecipe = async function (newRecipe) {
    try {
        // console.log(newRecipe);
        // loadRecipe("5ed6604591c37cdc054bc89a");
        // console.log(state.recipe);
        const ingredients = Object.entries(newRecipe)
            .filter((entrie) => {
                const [key, value] = entrie;
                return key.startsWith("ingredient") && value !== "";
            })
            .map((ing) => {
                const ingArr = ing[1].split(",").map((el) => el.trim());
                if (ingArr.length !== 3)
                    throw new Error(
                        "Wrong Format! Please use the correct format to specify ingredients"
                    );
                const [quantity, unit, description] = ingArr;
                return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description,
                };
            });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };
        const response = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = cameliseKeys(response.data.recipe);
        addBookmark(state.recipe);
    } catch (error) {
        throw error;
    }
};

const init = function () {
    const storage = localStorage.getItem("bookmark");
    if (storage) state.bookmark = JSON.parse(storage);
};

init();

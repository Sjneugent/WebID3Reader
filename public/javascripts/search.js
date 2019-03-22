export default class Search {
    constructor() {
        this.controls = {
            searchButton: document.getElementById("search-button"),
            hashSearchInput: document.getElementById("search-text")
        };
        this.controls.searchButton.onclick = this.postSearch().bind(this);
    }

    postSearch() {
    }

}



let s = new Search();
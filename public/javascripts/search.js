export default class Search {
    constructor() {
        this.controls = {
            searchButton: document.getElementById("search-button"),
            hashSearchInput: document.getElementById("search-text")
        };
        this.controls.searchButton.onclick = this.postSearch.bind(this);
    }

    postSearch() {
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', '/search', true);
        xmlHttpRequest.setRequestHeader('Content-Type', "text");
        xmlHttpRequest.send(this.controls.hashSearchInput.value);
        xmlHttpRequest.onloadend = this.searchQueryReceived.bind(this);
    }

    searchQueryReceived(e) {
        console.error("Query done");
        console.error(e);
    }

}


let s = new Search();
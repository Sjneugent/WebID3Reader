export default class Search {
    constructor() {
        this.controls = {
            searchButton: document.getElementById("search-button"),
            hashSearchInput: document.getElementById("search-text"),
            resultTable: document.getElementById("response")
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
        let  jsonObj = JSON.parse(e.currentTarget.response);
        jsonObj = jsonObj[0];
        for(let k in jsonObj){
            let tempObj = document.createElement("div");
            tempObj.classList.add("json-row");
            let key = document.createElement("div");
            let value = document.createElement("div");
            key.innerText = k;
            value.innerText = jsonObj[k];

            tempObj.appendChild(key);
            tempObj.appendChild(value);
            this.controls.resultTable.appendChild(tempObj);
        }
    }

}


let s = new Search();
export default class Search {
    constructor() {
        this.controls = {
            searchButton: document.getElementById("search-button"),
            hashSearchInput: document.getElementById("search-text"),
            searchAllButton: document.getElementById("search-all-button"),
            allSearchInput: document.getElementById("search-all-input"),
            resultTable: document.getElementById("response")
        };
        this.controls.searchButton.onclick = this.postSearch.bind(this);
        this.controls.searchAllButton.onclick = this.findStringAgainstAllColumns.bind(this);
    }

    postSearch() {
        this.controls.resultTable.innerHTML = '';
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', '/search', true);
        xmlHttpRequest.setRequestHeader('Content-Type', "text");
        xmlHttpRequest.send(this.controls.hashSearchInput.value);
        xmlHttpRequest.onloadend = this.searchQueryReceived.bind(this);
    }

    /*### findStringAgainstAllColumns
        Returns any columns that match the current value of the Fuzzy Search bar
    ###*/
    findStringAgainstAllColumns() {
        this.controls.resultTable.innerHTML = '';
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', '/findStringAgainstAllColumns', true);
        xmlHttpRequest.setRequestHeader('Content-Type', "text");
        xmlHttpRequest.send(this.controls.allSearchInput.value);
        xmlHttpRequest.onloadend = this.searchQueryReceived.bind(this);
    }

    searchQueryReceived(e) {
        let records = JSON.parse(e.currentTarget.response);
        if (!records.length) {
            this.controls.resultTable.innerText = 'No matching records found.';
            return;
        }

        for (const jsonObj of records) {
            for (const k of Object.keys(jsonObj)) {
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

}


let s = new Search();

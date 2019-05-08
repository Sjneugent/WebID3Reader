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
        this.controls.searchAllButton.onclick = this.findAllSearchableColumns.bind(this);
    }

    postSearch() {
        this.controls.resultTable.innerHTML = '';
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', '/search', true);
        xmlHttpRequest.setRequestHeader('Content-Type', "text");
        xmlHttpRequest.send(this.controls.hashSearchInput.value);
        xmlHttpRequest.onloadend = this.searchQueryReceived.bind(this);
    }

    /*### findAllSearchableColumns
        Returns all columns in the table that can be searched upon.  To be used in tandem
        with findStringAgainstAllColumns to query each column.
    ###*/
    findAllSearchableColumns() {
        this.controls.resultTable.innerHTML = '';
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', '/findAllSearchableColumns', true);
        xmlHttpRequest.setRequestHeader('Content-Type', "text");
        xmlHttpRequest.send();
        //xmlHttpRequest.onloadend = this.findStringAgainstAllColumns.bind(this);
        xmlHttpRequest.onloadend = this.searchQueryReceivedTest.bind(this);
    }

    /*### findStringAgainstAllColumns
        Returns any columns that match the current value of the Fuzzy Search bar
    ###*/
    findStringAgainstAllColumns(searchValue) {
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', '/findStringAgainstAllColumns', true);
        xmlHttpRequest.setRequestHeader('Content-Type', "text");
        let columnAndSearchValue = (this.controls.allSearchInput.value + ":" + searchValue);
        xmlHttpRequest.send(columnAndSearchValue);
        xmlHttpRequest.onloadend = this.searchQueryReceived.bind(this);
    }

    searchQueryReceived(e) {
        let  jsonObj = JSON.parse(e.currentTarget.response);
        jsonObj = jsonObj[0];
        for(let k in jsonObj){
            let tempObj = document.createElement("div");
            tempObj.classList.add("json-row");
            let key = document.createElement("div");
            let value = document.createElement("div");
            key.innerText = k;
            if(jsonObj.hasOwnProperty(k))
                value.innerText = jsonObj[k];
            else
                value.innerText = 'NULL';

            tempObj.appendChild(key);
            tempObj.appendChild(value);
            this.controls.resultTable.appendChild(tempObj);
        }
    }

    searchQueryReceivedTest(e) {
        let  jsonObj = JSON.parse(e.currentTarget.response);
        for (let j in jsonObj) {
            this.findStringAgainstAllColumns(jsonObj[j]);
        }
        
    }

}


let s = new Search();
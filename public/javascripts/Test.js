export default class Test {
    constructor(){
        console.error("Test constructed");
        this.controls = {
            myDiv: document.querySelector("div")
        }

        console.error(this.controls.myDiv);
        this.controls.myDiv.innerText = " 123 5422 ";
    }
}


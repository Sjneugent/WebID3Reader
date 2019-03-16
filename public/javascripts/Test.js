export default class Test {
    constructor(){
        this.fileData = undefined;
        this.controls = {
            myDiv: document.getElementById("upload-container"),
            startUpload: document.querySelector("button.selectUploadButton"),
            hiddenInput: document.querySelector("input[type='file']"),
            fileDescriptor: document.querySelector("div.file-descriptor"),
            postFileButton: document.getElementById("sendFile")
        };
        console.error(this.controls.startUpload);
        this.controls.startUpload.onclick = this.selectFileClick.bind(this);
        this.controls.hiddenInput.onchange = this.fileSelected.bind(this);
        this.controls.postFileButton.onclick = this.postFile.bind(this);

    }
    fileDone(e){
        console.error(e);
    }
    fileProgress(e){
        console.error(e);
    }
    postFile(e){
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', '/upload/', true);
        xmlHttpRequest.setRequestHeader('Content-Type', this.fileData.type);
        xmlHttpRequest.fileInfo = {fileName: this.fileData.name};
        xmlHttpRequest.setRequestHeader('Content-Disposition', 'attachment; filename="' + this.fileData.name + '"');
        xmlHttpRequest.upload.onprogress = this.fileProgress.bind(this);
        xmlHttpRequest.upload.onloadend =  function () {
            console.error(xmlHttpRequest);
        }

        xmlHttpRequest.onload = function() {
            console.error("on load finished");
        }


        xmlHttpRequest.send(this.fileData);

    }

    /**
     *
     * @param e
     */
    fileSelected(e){
        this.fileData = e.target.files[0];
        this.controls.fileDescriptor.innerText = e.target.files[0].name;

    }

    /**
     *
     * @param e
     */
    selectFileClick(e){
        console.error("select file clicked");
         this.simulateClick(this.controls.hiddenInput);
    }

    /**
     *
     * @param element
     */
    simulateClick(element) {
        let evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        let canceled = !element.dispatchEvent(evt);
    }
}


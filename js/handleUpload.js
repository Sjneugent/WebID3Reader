const headerParse = require('../js/parseHeader');

class HandleUpload {
    constructor(request) {
        this.request = request;
        this.fileName = headerParse(this.request.headers['content-disposition']);
    }

    getFileName() {
        return this.fileName;
    }

}

module.exports = HandleUpload;
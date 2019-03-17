/**
 *  Stolen from stack overflow :)
 * @param contentDisposition
 * @returns {string}
 */
function returnFileName(contentDisposition){
    let fileName = "";
    if(contentDisposition && contentDisposition.indexOf('attachment') !== -1){
        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        let matches = filenameRegex.exec(contentDisposition);
        if(matches && matches[1]){
            fileName = matches[1].replace(/['"]/g, '');
        }
    }
    return fileName;
}
module.exports = returnFileName;
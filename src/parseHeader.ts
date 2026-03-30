function returnFileName(contentDisposition: string): string {
    if (contentDisposition && contentDisposition.includes('attachment')) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches?.[1]) {
            return matches[1].replace(/['"]/g, '');
        }
    }
    return '';
}

export default returnFileName;
/**
 * @fileOverview public/network.js
 * Connects to a socket.io server
 * Sends path points and cut commends
 * Receives background image stream
 */

(function(exports) {

    const serverIP = 'http://192.168.0.115:5000/'; // socket.io server
    const socket = io(serverIP); // socket client

    console.log('connect to server');

    // when the socket connects to a server, send the clientName so that it can
    // be distinguished from the HoloLens client
    socket.on('connect', function() {
        console.log('connection successful');
        socket.emit('clientName', 'workbenchClient');
    });

    socket.on('ready', function() {
        setDrawingEnabled(true);
        console.log('hololens ready')
    });

    socket.on('notready', function() {
        setDrawingEnabled(false);
        console.log('hololens disconnected');
    });

    // when we receive a base64-encoded image of the AR scene projection, render it to the background
    socket.on('projection', function(data) {
        // setBackgroundImageFromBase64(data); // TODO: implement
    });

    // sets the background image given a base64-encoded jpg image
    const setBackgroundImageFromBase64 = function(data) {
        const blobUrl = decodeBase64JpgToBlobUrl(data);
        document.body.style.backgroundImage = 'url(\'' + blobUrl + '\')';
    };

    /**
     * Decodes an image/jpeg encoded as a base64 string, into a blobUrl that can be loaded as an img src
     * https://stackoverflow.com/questions/7650587/using-javascript-to-display-blob
     * @param {string} base64String - a Base64 encoded string representation of a jpg image
     * @return {string}
     */
    const decodeBase64JpgToBlobUrl = function(base64String) {
        const blob = b64toBlob(base64String, 'image/jpeg');
        return URL.createObjectURL(blob);
    };

    /**
     * https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
     * @param {string} b64Data - a Base64 encoded string
     * @param {string} contentType - the MIME type, e.g. 'image/jpeg', 'video/mp4', or 'text/plain' (
     * @param {number|undefined} sliceSize - number of bytes to process at a time (default 512). Affects performance.
     * @return {Blob}
     */
    const b64toBlob = function(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    };

    // call this on touch up to send the finished drawing path to the server
    const sendShape = function(shape) {
        console.log('stencil');
        socket.emit('stencil', JSON.stringify(shape));
    };

    // call this to stop extruding the current path
    const sendCut = function() {
        console.log('cut');
        socket.emit('cut');
    };

    // only these two functions are public to the rest of the application
    exports.sendShape = sendShape;
    exports.sendCut = sendCut;

}(window));
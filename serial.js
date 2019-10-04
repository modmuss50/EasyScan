// https://wicg.github.io/serial/
// https://github.com/noopkat/avrgirl-arduino/commit/5537c6638025f28eb231593662f0d4144e1346de

// http://info.uniden.com/twiki/pub/UnidenMan4/BC125AT/BC125AT_PC_Protocol_V1.01.pdf
// http://info.uniden.com/twiki/pub/UnidenMan4/BC125AT/BC125AT_Protocol.pdf

// https://github.com/cho45/NanoVNA-Web-Client/blob/e88208caea6dcac59f3b7ee4939f1f11e6c2c523/nanovna.js


// Enable chrome://flags/#enable-experimental-web-platform-features

rPort = null;
writer = null;

async function connect(connectionCallback) {

    navigator.serial.requestPort({}).then((sp) => {
        sp.open({ baudrate: 115200, buffersize: 10000 }).then(async (port) => {
            rPort = sp

            writer = sp.writable;

            connectionCallback();
        }).catch(async (err) => {
            alert(err);
        })
    })

}

/* Sends a message, along with the return char and then returns the output */
async function sendMessage(message) {
    reader = rPort.readable.getReader();
    const newWriter = writer.getWriter();
    newWriter.write(str2ab(message + "\r"));
    newWriter.releaseLock()


    
    var response = await readLine(reader)
    while(!response.includes("\r")){
        response = response + await readLine(reader)
    }
    reader.releaseLock()
    return response.substring(0, response.length -1);
}

/* Reads a line */
async function readLine(reader) {
    try {
        const { value, done } = await reader.read();
        return ab2str(value.buffer);
    } catch (e) {
        console.log(e);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* Some helper things */
function str2ab(str) {
    return new TextEncoder().encode(str);
}

function ab2str(buf) {
    return new TextDecoder().decode(buf);
}
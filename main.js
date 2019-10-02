function log(s) {
  document.getElementById("log").innerText = document.getElementById("log").innerText + "\n" + s;
}

function start() {
  document.getElementById('button').addEventListener('click', function (event) {
    connect(onConnected);
  });
}

async function onConnected() {

  const model = await sendMessage("MDL");

  console.log(model);

  if (model.split(",")[1] != "UBC125XLT") {
    log("Incomplatible model: " + model.split(",")[1]);
    return;
  } else {
    log("Connected to: " + model);
  }


  readChannels();

  //await sendMessage("KEY,S,P")
}

async function readChannels() {
  //Enter programming mode, so we can pull the data from it
  await sendMessage("PRG")

  var channels = []

  for (var i = 1; i <= 500; i++) {
    const rawData = await sendMessage("CIN," + i)
    const data = parseChannelData(rawData);
    channels.push(data);

    await sleep(2)

    updateProgress(i, 500, "progress_bar")
  }

  //Drop out of programming mode
  await sendMessage("EPG")

  populateTable(channels)
}

function populateTable(channels){

  for(i in channels){
    const chan = channels[i];
    
    var table = document.getElementById("channel_table")
    var row = table.insertRow(parseInt(i) + 1); //parseInt is required here becuase js
  
    addRow = (i, html) => {
      var cell = row.insertCell(i);
      cell.innerHTML = html;
    }
  
    console.log(chan)
    addRow(0, chan.index)
    addRow(1, getTextBox("name_" + i, chan.name))
    addRow(2, getTextBox("frq_" + i, chan.frq))
    addRow(3, chan.mod)
    addRow(4, chan.ctcss)
    addRow(5, chan.dly)
    addRow(6, chan.lout)
    addRow(7, chan.pri)
  }
}

function getTextBox(id, value){
  return `<input type=\"text\" name=\"${id}" id="${id}\" value="${value}\"><br>`;
}

function updateProgress(value, max, id){
  const bar = document.getElementById("progress_bar");
  bar.max = max;
  bar.value = value;
}

function parseChannelData(data) {
  const split = data.split(",");

  if (split[0] !== "CIN" || split.length != 9) {
    console.log("Invalid channel data")
    return;
  }

  return {
    index: split[1],
    name: split[2],
    frq: split[3],
    mod: split[4],
    ctcss: split[5],
    dly: split[6],
    lout: split[7],
    pri: split[8]
  }
}

start();
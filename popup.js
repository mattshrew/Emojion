import { main } from "./main.js";
var emotion = 0;
var sentiment = 0;
var mouth1 = document.getElementById("mouth");
var mouth2 = document.getElementById("othermouth");

document.addEventListener('DOMContentLoaded', function () {
    const uploadBox = document.getElementById('upload-box');
    const fileInput = document.getElementById('file-input');
  
    uploadBox.addEventListener('click', function () {
        fileInput.click();
    });
  
    fileInput.addEventListener('change', async function () {
        const file = fileInput.files[0];
        if (file) {
            console.log('Uploaded file:', file.name);
            const transcript = await main(file);
            await showTranscript(transcript);
        }
    });
  
    uploadBox.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadBox.classList.add('dragover');
    });
  
    uploadBox.addEventListener('dragleave', function () {
        uploadBox.classList.remove('dragover');
    });
  
    uploadBox.addEventListener('drop', async function (e) {
        e.preventDefault();
        uploadBox.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) {
            console.log('Dropped file:', file.name);
            const transcript = await main(file);
            await showTranscript(transcript);
        }
    });
});

async function showTranscript(transcript) {
    console.log("display transcript");
    if (sentiment_result.text == 'NEUTRAL'){
        emotion = 0;
    } else if (sentiment_result.text == 'POSITIVE'){
        emotion = 1;
    } else if (sentiment_result.text == 'NEGATIVE'){
        emotion = -1;
    }
    if (emotion != sentiment){
        if (emotion > sentiment){
            smile1();
        } else if (emotion < sentiment){
            smile2();
        }
    }
    if (emotion==0&&sentiment==0){
        mouth2.style.display = 'none';
    } else {
        mouth2.style.display = 'block';
    }
}
function smile1() {
    var id1 = null;
    var rotate = 90+(sentiment*90);
    clearInterval(id1);
    id1 = setInterval(move1, 5);
    function move1() {
        if (rotate >= 90+(emotion*90)) {
            clearInterval(id1);
            sentiment = emotion;
        } else {
            rotate+=0.5;
            mouth1.style.transform = 'rotateY('+rotate+'deg)';
        }
    }
}
function smile2() {
    var id2 = null;
    var rotate = 90+(sentiment*90);
    clearInterval(id2);
    id2 = setInterval(move2, 5);
    function move2() {
        if (rotate <= 90+(emotion*90)) {
            clearInterval(id2);
            sentiment = emotion;
        } else {
            rotate-=0.5;
            mouth2.style.transform = 'rotateY('+rotate+'deg)';
        }
    }
}

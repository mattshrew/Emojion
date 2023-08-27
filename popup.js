import { main } from "./main.js";
var emotion = 0;
var sentiment = 0;
var mouth1 = document.getElementById("mouth");
var mouth2 = document.getElementById("othermouth");
var printer = "";

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
var tex;
var senti;
var conf;
var startt;
var endd;
const wordArray = [];
const startArray = [];
const endArray = [];
async function showTranscript(transcript) {
    console.log("chingchong");
    
    for (let sentiment_result of transcript.sentiment_analysis_results) {
        tex = sentiment_result.text;
        senti = sentiment_result.sentiment;
        conf = sentiment_result.confidence;
        startt = sentiment_result.start;
        endd = sentiment_result.end;
    }
    for (let word_data of transcript.words) {
        wordArray.push(word_data.text);
        startArray.push(word_data.start);
        endArray.push(word_data.end);
    }
    runnotate();
    console.log(startArray[0]);
    console.log(tex);
    console.log(senti);
    console.log(conf);
    console.log(startt);
    console.log(endd);
    if (senti == 'NEUTRAL'){
        emotion = 0;
    } else if (senti == 'POSITIVE'){
        emotion = 1;
    } else if (senti == 'NEGATIVE'){
        emotion = -1;
    }
    console.log(emotion);
    if (emotion != sentiment){
        if (emotion > sentiment){
            smile1();
            console.log("bing");
        } else if (emotion < sentiment){
            smile2();
        }
    }
    if (emotion==0&&sentiment==0){
        mouth2.style.display = 'block';
    } else {
        mouth2.style.display = 'none';
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
    console.log(rotate);
    clearInterval(id2);
    id2 = setInterval(move2, 5);
    function move2() {
        if (rotate <= 90+(emotion*90)) {
            clearInterval(id2);
            sentiment = emotion;
        } else {
            rotate-=0.5;
            mouth1.style.transform = 'rotateY('+rotate+'deg)';
        }
    }
}
var counter = 0;
var indexWord = 0;
function runnotate(){
    if (counter<=endd){
        if (counter>=startArray[indexWord]){
            printer=printer+wordArray[indexWord]+' ';
            indexWord+=1;
            console.log("chiecken");
        }
        document.getElementById("p1").innerHTML = printer;
        console.log(counter);
        counter+=10;
        setTimeout(runnotate, 10);
    }
}

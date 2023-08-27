import { main } from "./main.js";
var emotion = 0;
var sentiment = 0;
var mouth1 = document.getElementById("mouth");
var mouth2 = document.getElementById("othermouth");
var body = document.getElementById("body");
var content = document.getElementById("content");
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
            dropDown();
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
            dropDown();
            console.log('Dropped file:', file.name);
            const transcript = await main(file);
            await showTranscript(transcript);
        }
    });
});
var tex;
const sentiArray = [];
var conf;
const starttArray = [];
const enddArray = [];
const wordArray = [];
const startArray = [];
const endArray = [];
async function showTranscript(transcript) {
    for (let sentiment_result of transcript.sentiment_analysis_results) {
        tex = sentiment_result.text;
        conf = sentiment_result.confidence;
        starttArray.push(sentiment_result.start);
        sentiArray.push(sentiment_result.sentiment);
        enddArray.push(sentiment_result.end);
    }
    for (let word_data of transcript.words) {
        wordArray.push(word_data.text);
        startArray.push(word_data.start);
        endArray.push(word_data.end);
    }
    runnotate();
    runnotate1();
}
function dropDown() {
    var id = null;
    var top = 0;
    clearInterval(id);
    id = setInterval(dropper, 10);
    function dropper() {
        if (top >= 219) {
            clearInterval(id);
        } else {
            top+=5;
            body.style.height = top+100+'px';
            content.style.height = top+'px';
        }
    }
}
function dropUp() {
    var id1 = null;
    var top1 = 220;
    clearInterval(id1);
    id1 = setInterval(dropper1, 10);
    function dropper1() {
        if (top1 <= 0) {
            clearInterval(id1);
        } else {
            top1-=5;
            body.style.height = top1+100+'px';
            content.style.height = top1+'px';
        }
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
            mouth1.style.transform = 'rotateY('+rotate+'deg)';
        }
    }
}
var counter = 0;
var indexWord = 0;
function runnotate(){
    if (counter<=enddArray[enddArray.length-1]){
        if (counter>=startArray[indexWord]){
            printer=printer+wordArray[indexWord]+' ';
            indexWord+=1;
        }
        document.getElementById("p1").innerHTML = printer;
        counter+=10;
        setTimeout(runnotate, 10);
    } else {
        console.log("bingchilling");
        setTimeout(dropUp, 5000);
    }
}
var counter1 = 0;
var indexSent = 0;
function runnotate1(){
    if (counter1<=enddArray[enddArray.length-1]){
        if (counter1>=starttArray[indexSent]){
            if (indexSent>0) {
                printer = '';
            }
            if (sentiArray[indexSent] == 'NEUTRAL'){
                emotion = 0;
            } else if (sentiArray[indexSent] == 'POSITIVE'){
                emotion = 1;
            } else if (sentiArray[indexSent] == 'NEGATIVE'){
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
                mouth2.style.display = 'block';
            } else {
                mouth2.style.display = 'none';
            }
            indexSent+=1;
        }
        counter1+=10;
        setTimeout(runnotate1, 10);
    }
}

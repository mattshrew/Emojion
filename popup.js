import { main } from "./main.js";

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
}
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
            await main(file);
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
            await main(file);
        }
    });
});


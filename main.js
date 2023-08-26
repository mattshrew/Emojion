function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (event) => {
        reject(event.target.error);
      };
      reader.readAsArrayBuffer(file);
    });
  }

async function transcribe(file, buffer) {
    const API_TOKEN = "74f68e8b77f64dd5a67a55125875323f";

    async function upload_file(api_token, name, data) {
        console.log(`Uploading file: ${name}`);
        const url = "https://api.assemblyai.com/v2/upload";
      
        try {
          const response = await fetch(url, {
            method: "POST",
            body: data,
            headers: {
              "Content-Type": "application/octet-stream",
              Authorization: api_token,
            },
          });
      
          if (response.status === 200) { // success
            const responseData = await response.json();
            return responseData["upload_url"];
          } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return null;
          }
        } catch (error) {
          console.error(`Error: ${error}`);
          return null;
        }
    }

    async function transcribeAudio(api_token, audio_url) {
        console.log("Transcribing audio... This might take a moment.");
      
        const headers = {
          authorization: api_token,
          "content-type": "application/json",
        };
      
        const params = {
          audio_url,
          sentiment_analysis: true
        };
      
        const response = await fetch("https://api.assemblyai.com/v2/transcript", {
          method: "POST",
          body: JSON.stringify( params ),
          headers,
        });
      
        const responseData = await response.json();
        const transcriptId = responseData.id;
      
        // Construct the polling endpoint URL using the transcript ID
        const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
      
        // Poll the transcription API until the transcript is ready
        while (true) {
          // Send a GET request to the polling endpoint to retrieve the status of the transcript
          const pollingResponse = await fetch(pollingEndpoint, { headers });
          const transcriptionResult = await pollingResponse.json();
      
          if (transcriptionResult.status === "completed") { // complete: return transcript object
            console.log("success");
            return transcriptionResult;
          }
          else if (transcriptionResult.status === "error") { // failed: error message
            console.log("failed");
            throw new Error(`Transcription failed: ${transcriptionResult.error}`);
          }
          else { // still in progress: wait 3s
            console.log("waiting...");
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        }
    }

    const uploadUrl = await upload_file(API_TOKEN, file.name, buffer);
    console.log(uploadUrl)

    if (!uploadUrl) {
        console.error(new Error("Upload failed. Please try again."));
        return;
    }

    const transcript = await transcribeAudio(API_TOKEN, uploadUrl);
    console.log(transcript);
    
    return transcript;
}

async function printTranscript(transcript) {
    console.log("Transcript:", transcript.text);
    for (let sentiment_result of transcript.sentiment_analysis_results) {
        console.log(sentiment_result.text)
        console.log(sentiment_result.sentiment)
        console.log(sentiment_result.confidence)
        console.log(`Timestamp: ${sentiment_result.start} - ${sentiment_result.end}`)
    }
}

export async function main(file) {
    const audioBuffer = await readFileAsArrayBuffer(file);
    const transcript = await transcribe(file, audioBuffer);
    await printTranscript(transcript);
}

export default main;
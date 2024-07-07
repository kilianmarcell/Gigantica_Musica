const textArea = document.getElementById('textArea');
const durationSeconds = document.getElementById('durationSeconds');
const promptInfluence = document.getElementById('promptInfluence');
const audio = document.getElementById("audioPlayer");
const loadingAnimation = document.getElementById("loadingAnimation");
audio.volume = 0.5;

let promptText = ""; 
const getOptions = () => { return {
     method: 'POST',
     headers: {
         'xi-api-key': 'sk_22bf14ca9343f0c3ac50559223fa7d8c5c5db4cd1e11b8e3',
         'Content-Type': 'application/json'
     },
     body: JSON.stringify({
         text: promptText,
         duration_seconds: durationSeconds.value,
         prompt_influence: promptInfluence.value
     })
}};
const audioPlayer = document.getElementById('audioPlayer');

document.getElementById('requestAudio').addEventListener('click', () => {
    loadingAnimation.classList.remove("d-none");
    promptText = textArea.value;
    console.log(getOptions());
     fetch('https://api.elevenlabs.io/v1/sound-generation', getOptions())
        //   .then(response => response.json())
          .then(response => {
              streamToAudioElement(response.body);
                loadingAnimation.classList.add("d-none");
          })
          .catch(err => console.error(err));
});

const generatedAudioContainer = document.getElementById('generatedAudioContainer');

function createDragAndDroppableElement(url) {
    const element = document.createElement('a');
    element.classList.add('p-3');
    element.draggable = true;
    element.download = promptText + ".mp3";
    element.href = url; 
    element.ondragstart = (event) => {
        event.dataTransfer.setData('DownloadURL', `application/octet-stream:${element.download}:${element.href}`);
    };
    element.textContent = promptText + ".mp3";
    generatedAudioContainer.appendChild(element);
}

async function streamToAudioElement(stream) {
     const reader = stream.getReader();
     const chunks = [];
     let done, value;
 
     while (!done) {
         ({ done, value } = await reader.read());
         if (value) {
             chunks.push(value);
         }
     }
 
     const blob = new Blob(chunks, { type: 'audio/mpeg' });
     const url = URL.createObjectURL(blob);
     createDragAndDroppableElement(url);
     audioPlayer.src = url;
 }

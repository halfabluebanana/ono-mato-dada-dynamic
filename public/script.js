//initialise and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
});

//we will be dynamically creating the sliders. create div containers for sliders. 
//Reference the sliders using getElementById method
const container = document.getElementById('sliderContainer');

let phonemeList = [];

//use Fetch method to get the phoneme data. Phoneme data is stored in json format.
fetch('/phonemes.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(phoneme => {
            createSlider(phoneme); //this function dynanimcally creates a slider for each phoneme
        });
    })
    .catch(error => console.error('error in loading phoneme data:', error));


//Function to dynamically create one slider for each phoneme

function createSlider(phoneme) {

    //For each phoneme, 
    //create a slider wrapper 
    const sliderWrapper = document.createElement('div');
    //create a label
    const label = document.createElement('label');
    //create a sample word
    const sampleWord = document.createElement('sampleword');
    //create slider input
    const slider = document.createElement('input');


    //assign css classes so we can style it
    sliderWrapper.className = 'slider-wrapper';
    label.className = 'phoneme-label';
    sampleWord.className = 'sample-word';

    label.textContent = phoneme.label;
    sampleWord.textContent = `Example: ${phoneme.sampleword}`;

    //settings for each slider
    slider.type = 'range';
    slider.min = '0.1';
    slider.max = '5';
    slider.step = '0.1';
    slider.value = '1';
    slider.setAttribute ('id', phoneme.id); 
    //each phoneme and slider has its own id. helps us identify 


    //append child elements to the wrapper
    sliderWrapper.appendChild(label);
    sliderWrapper.appendChild(sampleWord);
    sliderWrapper.appendChild(slider);
    sliderContainer.appendChild(sliderWrapper);


    //Event listener for slider value on the page
    slider.addEventListener('input', () => {
        const duration = slider.value;
        console.log('slider input: ${slider}');
        playSound(phoneme.file, duration);

        //socket listens for changes and emits
        socket.emit('sliderChange', {id: phoneme.id, duration });
    });

}


function playSound(phonemeFile, duration) {
    //use find method. p is predicate, it runs through the array and searches for the elements in ascending order. It then returns the value of the element.
    //Int8Array.find(predicate: (value: number, index: number, obj: Int8Array) => boolean, thisArg?: any): number | undefined
    // const phonemeData = phonemeList.find(p => p.id === phoneme.Id);
    // if (!phonemeData) return;

    // const duration = document.getElementById(phonemeId).value;
    // console.log(duration);

    const audio = new Audio(`/sounds/${phonemeFile}`);
    console.log(`attempt to play sound: ${phonemeFile} with duration: ${duration}`);
    audio.playbackRate = 1 / duration; // adjust playback rate
    console.log(`playback rate: ${audio.playbackRate}`);

    audio.addEventListener('canplaythrough', () => {
        console.log(`Sound ${phonemeFile} is okay to play`);
        audio.play();
    });

    audio.addEventListener('error', (e) => {
        console.error('Error loading audio file: ${phonemeFile}', e);

    });

    audio.addEventListener('play', () => {
        console.log(`Playing sound: ${phonemeFile} at speed: ${audio.playbackRate}`);

    });

}
    //listen for updates from other users using socket on
    socket.on('updateSoundDuration', (data) => {
        console.log(`Received updateSoundDuration event for ${data.id} with duration: ${data.duration}`);
        const slider = document.getElementById(data.id);
        console.log(`this is the data we're receiving: ${JSON.stringify(data)}`);


        if (slider) {
            console.log(`${slider.value}`);
            slider.value = data.duration;

            console.log(`${slider.value}`);
            updateSoundDuration(data.duration);
        } else {
            console.warn(`Slider for phoneme ID ${data.id} not found.`);
        }
    });

      // Load the phoneme data and create sliders
      phonemeList.forEach(createSlider);

    function updateSoundDuration(duration) {
        //console.log(`updated duration for ${data.id}: ${duration}`);
        // const slider = document.getElementById(data.id);

    }


//set time out or delay so that when different users are sliding, it won't continuously play on every change. 
//if sliders are changing, set a timeout to play timeout 
//if sliders change within that time frame. clear timeout, and make a new timeout 
// create a variable for the timeout
  

//=========================================================
// FOR NON DYNAMIC METHOD OF CREATING PHONEMES AND SLIDERS
//=========================================================
// // Listen for changes on the slider
// soundSlider.addEventListener('input', () => {
//     const duration = soundSlider.value;
//     socket.emit('sliderChange', { duration });
// });

// // Listen for duration updates from other users
// socket.on('updateSoundDuration', (data) => {
//     soundSlider.value = data.duration;
//     updateSoundDuration(data.duration);
// });

// // Play a sound with the current slider value as the duration
// function playSound(phoneme) {
//     const duration = soundSlider.value;

//     const audio = new Audio(`/sounds/${phoneme}.mp3`);
//     audio.playbackRate = 1 / duration; // Adjust playback speed to mimic duration effect
//     audio.play();
// }

// function updateSoundDuration(duration) {
//     console.log(`Sound duration updated to: ${duration} seconds`);
// }


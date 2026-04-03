const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const songTitle = document.getElementById("songTitle");
const progressBar = document.getElementById("progressBar");


const songs = [
  { name: "Raga Gaud Sarang", file: "songs/Raga_Gaud_Sarang.mp3" },
    { name: "Raga Hamsadhwani", file: "songs/Raga_Hamsadhwani.mp3" },
    { name: "Raga Sankarabharanam", file: "songs/Raga_Sankarabharanam.mp3" },
    { name: "Raga Yaman", file: "songs/Raga_Yaman.mp3" },
];

let currentSongIndex = 0;
let isPlaying = false;

// load song
function loadSong(index) {
    audio.src = songs[index].file;
    songTitle.textContent = songs[index].name;
}

loadSong(currentSongIndex);

// play / pause
playBtn.addEventListener("click", () => {
    if (!isPlaying) {
        audio.play();
        playBtn.textContent = "⏸️";
    } else {
        audio.pause();
        playBtn.textContent = "▶️";
    }
    isPlaying = !isPlaying;
});

// next song
nextBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸️";
});

// previous song
prevBtn.addEventListener("click", () => {
    currentSongIndex =
        (currentSongIndex - 1 + songs.length) % songs.length;  //is it fine? -1 % 4 = -1, but we want 3
    loadSong(currentSongIndex);
    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸️";
});

// update progress
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;

});

// seek
progressBar.addEventListener("input", () => {
    if (!audio.duration) return;

    let newTime = (progressBar.value / 100) * audio.duration;

    // FIX: avoid exact end
    if (newTime >= audio.duration) {
        newTime = audio.duration - 0.1;
    }

    audio.currentTime = newTime;

    // Resume if was playing
    if (isPlaying) {
        audio.play();
    }
});




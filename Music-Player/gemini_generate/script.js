/**
 * MUSIC PLAYER LOGIC
 * Note for commercialization: Replace the `mockTracks` array below with fetch() 
 * calls to your backend server, which will securely handle your API key. 
 * DO NOT expose raw external API keys directly in this frontend JavaScript file.
 */

// --- 1. State & Mock Data ---
const mockTracks = [
    {
        id: 1,
        title: "Neon Horizon",
        artist: "Synthwave Masters",
        album: "Cyber City",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&q=80",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: "6:12",
        isLiked: false
    },
    {
        id: 2,
        title: "Midnight Drive",
        artist: "Chillhop Crew",
        album: "Night Vibes",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&q=80",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        duration: "7:05",
        isLiked: true
    },
    {
        id: 3,
        title: "Acoustic Sunrise",
        artist: "The String Band",
        album: "Morning Coffee",
        cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&q=80",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: "5:44",
        isLiked: false
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();
audio.src = mockTracks[currentTrackIndex].src;

// --- 2. DOM Elements ---
const trackListContainer = document.getElementById('track-list');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const currentCover = document.getElementById('current-cover');
const currentTitle = document.getElementById('current-title');
const currentArtist = document.getElementById('current-artist');
const currentFavBtn = document.getElementById('current-fav-btn');
const muteBtn = document.getElementById('mute-btn');
const addPlaylistBtn = document.getElementById('add-playlist-btn');
const addToQueueBtn = document.getElementById('add-to-queue');

// --- 3. Initialization ---
function initPlayer() {
    renderTrackList();
    loadTrack(currentTrackIndex);
    audio.volume = volumeBar.value;
}

// --- 4. Render UI ---
function renderTrackList() {
    trackListContainer.innerHTML = '';
    mockTracks.forEach((track, index) => {
        const tr = document.createElement('div');
        tr.className = `track-item ${index === currentTrackIndex ? 'playing' : ''}`;
        tr.innerHTML = `
            <span class="track-index">${index + 1}</span>
            <div class="track-info-list">
                <img src="${track.cover}" class="track-img" alt="Cover">
                <div class="track-details-list">
                    <span class="track-title">${track.title}</span>
                    <span class="track-artist-list">${track.artist}</span>
                </div>
            </div>
            <span class="track-album">${track.album}</span>
            <span class="track-duration">${track.duration}</span>
        `;
        
        tr.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            playTrack();
            renderTrackList(); // Update playing styles
        });
        
        trackListContainer.appendChild(tr);
    });
}

function loadTrack(index) {
    const track = mockTracks[index];
    audio.src = track.src;
    currentCover.src = track.cover;
    currentTitle.textContent = track.title;
    currentArtist.textContent = track.artist;
    
    // Update Favorite Icon
    if(track.isLiked) {
        currentFavBtn.classList.add('active');
        currentFavBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    } else {
        currentFavBtn.classList.remove('active');
        currentFavBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }
}

// --- 5. Playback Controls ---
function playTrack() {
    audio.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
    renderTrackList(); // Ensure list shows active track
}

function pauseTrack() {
    audio.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
}

function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function prevTrack() {
    currentTrackIndex--;
    if (currentTrackIndex < 0) currentTrackIndex = mockTracks.length - 1;
    loadTrack(currentTrackIndex);
    playTrack();
}

function nextTrack() {
    currentTrackIndex++;
    if (currentTrackIndex > mockTracks.length - 1) currentTrackIndex = 0;
    loadTrack(currentTrackIndex);
    playTrack();
}

// --- 6. Time and Progress formatting ---
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updateProgress() {
    const { duration, currentTime } = audio;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(currentTime);
        totalTimeEl.textContent = formatTime(duration);
        
        // CSS variable for dynamic track color (Spotify style green progress)
        progressBar.style.background = `linear-gradient(to right, var(--accent) ${progressPercent}%, #535353 ${progressPercent}%)`;
    }
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// --- 7. Event Listeners ---
playPauseBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);

// Audio Events
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextTrack); // Auto play next
audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

// Bar events
progressBar.addEventListener('click', setProgress);
progressBar.addEventListener('input', (e) => {
    const duration = audio.duration;
    audio.currentTime = (e.target.value / 100) * duration;
});

// Volume
volumeBar.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    volumeBar.style.background = `linear-gradient(to right, var(--text-primary) ${e.target.value * 100}%, #535353 ${e.target.value * 100}%)`;
    
    if (audio.volume === 0) {
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else if (audio.volume < 0.5) {
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
    } else {
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
});

// Extra Features Logic
currentFavBtn.addEventListener('click', () => {
    const track = mockTracks[currentTrackIndex];
    track.isLiked = !track.isLiked;
    loadTrack(currentTrackIndex); // Refresh UI
});

addPlaylistBtn.addEventListener('click', () => {
    const playlistName = prompt("Enter new playlist name:");
    if (playlistName) {
        const ul = document.getElementById('user-playlists');
        const li = document.createElement('li');
        li.className = 'playlist-item';
        li.textContent = playlistName;
        ul.appendChild(li);
    }
});

addToQueueBtn.addEventListener('click', () => {
    alert(`"${mockTracks[currentTrackIndex].title}" added to your queue!`);
});

// Run
initPlayer();
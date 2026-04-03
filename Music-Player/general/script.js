const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const songTitle = document.getElementById("songTitle");
const progressBar = document.getElementById("progressBar");
const favBtn = document.getElementById("favBtn");

const playlistDiv = document.getElementById("playlists");
const createBtn = document.getElementById("createPlaylist");
const playlistInput = document.getElementById("playlistName");

const playlistSelect = document.getElementById("playlistSelect");
const addBtn = document.getElementById("addToPlaylist");

let songs = [];
let currentSongIndex = 0;
let isPlaying = false;
let query = "raga";

// STORAGE
let playlists = JSON.parse(localStorage.getItem("playlists")) || {
    "Favourites": []
};

// FETCH SONGS
async function fetchSongs() {
    const res = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=cb111736&format=json&limit=20&search=${query}`
    );

    const data = await res.json();

    songs = data.results
        .filter(song => song.audio && song.name)
        .map(song => ({
            name: song.name,
            file: song.audio,
            duration:
                Math.floor(song.duration / 60) +                         /*minutes*/
                ":" +
                String(song.duration % 60).padStart(2, "0")              /*seconds*/  /*why 2? because if seconds are less than 10, we want to display 0 before it. For example, if duration is 125 seconds, it should display as "2:05" instead of "2:5". The padStart(2, "0") ensures that the seconds part is always at least 2 characters long, and if it's shorter, it pads it with "0" on the left.*/
        }));

    loadSong(0);
    renderPlaylists();
    updateDropdown();
}

// LOAD SONG
function loadSong(index) {
    if (!songs[index]) return;

    const song = songs[index];
    audio.src = song.file;
    audio.load();                 //what it does? It tells the browser to load the audio file specified in the src attribute. This is necessary because when we change the src, the browser doesn't automatically start loading the new audio file. By calling audio.load(), we ensure that the new audio file is loaded and ready to play when the user clicks the play button.

    songTitle.textContent = song.name;

    const isFav = playlists["Favourites"].some(s => s.name === song.name);
    favBtn.textContent = isFav ? "💖" : "🤍";
}

// PLAY / PAUSE
playBtn.onclick = () => {
    if (!isPlaying) {
        audio.play();
        playBtn.textContent = "⏸️";
    } else {
        audio.pause();
        playBtn.textContent = "▶️";
    }
    isPlaying = !isPlaying;
};

// NEXT
nextBtn.onclick = () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    isPlaying = true;
};

// PREV
prevBtn.onclick = () => {
    currentSongIndex =
        (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    isPlaying = true;
};

// PROGRESS
audio.ontimeupdate = () => {
    if (!audio.duration) return;
    progressBar.value =
        (audio.currentTime / audio.duration) * 100;
};

// SEEK
progressBar.oninput = () => {
    if (!audio.duration) return;
    audio.currentTime =
        (progressBar.value / 100) * audio.duration;
};

// END
audio.onended = () => {                           //changes to be done when a song ends
    isPlaying = false;
    playBtn.textContent = "▶️";
};

// FAVOURITES
favBtn.onclick = () => {
    const song = songs[currentSongIndex];
    let fav = playlists["Favourites"];

    const exists = fav.find(s => s.name === song.name);    //checking if song already exists

    if (!exists) fav.push(song);
    else playlists["Favourites"] = fav.filter(s => s.name !== song.name);   //It removes the current song from the “Favourites” playlist by keeping all songs whose name is not equal to the selected song.

    savePlaylists();
    loadSong(currentSongIndex);
    renderPlaylists();
};

// CREATE PLAYLIST
createBtn.onclick = () => {
    const name = playlistInput.value.trim();
    if (!name) return;

    playlists[name] = [];
    playlistInput.value = "";

    savePlaylists();
    renderPlaylists();
    updateDropdown();
};

// ADD TO PLAYLIST
addBtn.onclick = () => {
    const selected = playlistSelect.value;
    const song = songs[currentSongIndex];

    if (!playlists[selected]) return;

    const exists = playlists[selected].some(s => s.name === song.name);

    if (!exists) {
        playlists[selected].push(song);
        savePlaylists();
        renderPlaylists();
    }
};

// RENDER PLAYLISTS
function renderPlaylists() {
    playlistDiv.innerHTML = "";

    for (let name in playlists) {
        const div = document.createElement("div");
        div.className = "playlist";

        // 🔥 TITLE ROW (with delete playlist)
        const titleRow = document.createElement("div");
        titleRow.style.display = "flex";
        titleRow.style.justifyContent = "space-between";
        titleRow.style.alignItems = "center";

        const title = document.createElement("h4");
        title.textContent = name;

        titleRow.appendChild(title);

        // ❌ Don't delete Favourites
        if (name !== "Favourites") {
            const deletePlaylistBtn = document.createElement("button");
            deletePlaylistBtn.textContent = "🗑️";
            deletePlaylistBtn.className = "delete-btn";

            deletePlaylistBtn.onclick = () => {
                delete playlists[name];
                savePlaylists();
                renderPlaylists();
                updateDropdown();
            };

            titleRow.appendChild(deletePlaylistBtn);
        }

        div.appendChild(titleRow);

        // 🎵 SONGS
        playlists[name].forEach((song, index) => {
            const songDiv = document.createElement("div");
            songDiv.className = "song";

            songDiv.innerHTML = `
                <span>${song.name}</span>
                <span>${song.duration}</span>
                <button class="delete-btn">❌</button>
            `;

            // ▶️ Play song
            songDiv.onclick = () => {
                audio.src = song.file;
                audio.play();
                songTitle.textContent = song.name;   //fix done by me
                isPlaying = true;
                playBtn.textContent = "⏸️";
            };

            // 🗑️ Delete song
            songDiv.querySelector(".delete-btn").onclick = (e) => {
                e.stopPropagation();
                playlists[name].splice(index, 1);
                savePlaylists();
                renderPlaylists();
            };

            div.appendChild(songDiv);
        });

        playlistDiv.appendChild(div);
    }
}

// DROPDOWN
function updateDropdown() {
    playlistSelect.innerHTML = "";

    for (let name in playlists) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        playlistSelect.appendChild(option);
    }
}

// SAVE
function savePlaylists() {
    localStorage.setItem("playlists", JSON.stringify(playlists));
}

// START
fetchSongs();
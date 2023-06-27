const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
var musicElement = document.getElementById('audio');
var toogleBtn = $('.btn.btn-toggle-play');
var h2Element = document.getElementsByTagName('h2')[0];
var cdThumb = $('.cd-thumb');
var playerElement = $('.player');
var nextSongBtn = $('.btn.btn-next');
var prevSongBtn = $('.btn.btn-prev');
var randomSongBtn = $('.btn.btn-random');
var repeatBtn = $('.btn.btn-repeat');
var playList = $('.playlist');
var currentIndex = 0;
var isPlaying = false;
var isRandom = false;
var isRepeat = false;
const PLAYER_STORAGE_KEY = 'HUYROOT';
var config = JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {};
const songs = [
    {
        name: 'Cô đơn trên Sofa',
        singer: 'Trung Quân',
        path: '../assets/music/song1.mp3',
        image: '../assets/img/song1.jpg'
    },
    {
        name: 'Đã sai từ lúc đầu',
        singer: 'Trung Quân ft Bùi Anh Tuấn',
        path: '../assets/music/song2.mp3',
        image: '../assets/img/song2.jpg'
    },
    {
        name: 'Đơn giản anh yêu em',
        singer: 'Hồ Quốc Việt',
        path: '../assets/music/song3.mp3',
        image: '../assets/img/song3.jpg'
    },
    {
        name: 'Hoa Cỏ Lau Remix',
        singer: 'Phong Max',
        path: '../assets/music/song4.mp3',
        image: '../assets/img/song4.jpg'
    },
    {
        name: 'Kẹo Bông Gòn',
        singer: 'H2K',
        path: '../assets/music/song5.mp3',
        image: '../assets/img/song5.jpg'
    },
    {
        name: 'Ngày mai em đi mất',
        singer: 'Đạt G',
        path: '../assets/music/song6.mp3',
        image: '../assets/img/song6.jpg'
    },
    {
        name: 'Em là kẻ đáng thương',
        singer: 'Phát Huy T4',
        path: '../assets/music/song7.mp3',
        image: '../assets/img/song7.jpg'
    },
    {
        name: 'Hôm nay em cưới rồi',
        singer: 'Khải Đăng',
        path: '../assets/music/song8.mp3',
        image: '../assets/img/song8.jpg'
    },
    {
        name: 'Anh tự do nhưng cô đơn',
        singer: 'Đạt G',
        path: '../assets/music/song9.mp3',
        image: '../assets/img/song9.jpg'
    }
]

function setConfig(key,value){
    config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(config));
}
function loadConfig(){
    isRandom = config['isRandom'];
    isRepeat = config['isRepeat'];
}
function defineProperties() {
    Object.defineProperty(this, 'currentSong', {
        get: function () {
            return songs[currentIndex];
        }

    })
}
function render() {
    var html = songs.map((song, index) => {
        return `
                <div class="song ${index == 0 ? 'active' : ''}" data-id="${index}">
                    <div class="thumb" style="background-image: url('${song.image}');">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                 </div>
        `
    }).join('\n');
    var playList = $('.playlist');
    playList.innerHTML = html;

}
function handleEvents() {
    ///xử lý scroll
    var cdElement = $('.cd');
    const cdWidth = cdElement.offsetWidth;
    document.onscroll = function () {
        const scrollY = document.documentElement.scrollTop;
        var newWidth = cdWidth - scrollY;
        cdElement.style.width = newWidth > 0 ? newWidth + 'px' : 0;
        cdElement.style.opacity = newWidth / cdWidth;
    }
    ///xử lý quay cd
    const cdAnimate = cdThumb.animate([{
        transform: "rotate(360deg)"
    }], {
        duration: 10000,
        iterations: Infinity
    })
    cdAnimate.pause();
    ///xử lý play/pause music
    toogleBtn.onclick = function () {
        if (!isPlaying) {
            musicElement.play();
        }
        else {
            musicElement.pause();
        }
    }
    musicElement.onplay = function () {
        isPlaying = true;
        playerElement.classList.add("playing");
        cdAnimate.play();

    }
    musicElement.onpause = function () {
        isPlaying = false;
        playerElement.classList.remove("playing");
        cdAnimate.pause();

    }
    ///xử lý next/prev bài hát
    nextSongBtn.onclick = function () {
        isRandom ? randomSong() : nextSong();
        musicElement.play();
        scrollToActiveSong();
    }
    prevSongBtn.onclick = function () {
        isRandom ? randomSong() : prevSong();
        musicElement.play();
        scrollToActiveSong();
    }
    //xử lý random bài hát
    randomSongBtn.onclick = function () {
        isRandom = !isRandom;
        randomSongBtn.classList.toggle('active');
        setConfig('isRandom', isRandom);
    }
    ///xử lý repeat bài hát
    repeatBtn.onclick = function () {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('active');
        setConfig('isRepeat', isRepeat);
    }

    ///xử lý next repeat khi ended
    musicElement.onended = function () {
        if (!isRepeat) {
            isRandom ? randomSong() : nextSong();
        }
        musicElement.play();
    }


}
function audioTiming() {
    var processEle = $('#progress');
    var currentTime = musicElement.currentTime;
    var duration = musicElement.duration;

    musicElement.ontimeupdate = function () {
        duration = musicElement.duration;
        currentTime = musicElement.currentTime;
        if (duration) {
            processEle.value = currentTime / duration * 100;
        }


    }
    processEle.oninput = function (event) {
        duration = musicElement.duration;
        const seekTime = event.target.value / 100 * duration;
        musicElement.currentTime = seekTime;

    }


}
function repeatSong() {
    currentIndex
    loadCurrentSong();
}
function nextSong() {
    if (currentIndex >= songs.length - 1) {
        currentIndex = 0;
    }
    else {
        currentIndex++;
    }
    loadCurrentSong();
    activeSong();
}
function prevSong() {
    if (currentIndex == 0) {
        currentIndex = songs.length - 1;
    }
    else {
        currentIndex--;
    }
    loadCurrentSong();
    activeSong();
}
function randomSong() {
    var newIndex;
    do {
        newIndex = Math.floor(Math.random() * songs.length);
    }
    while (newIndex === currentIndex)
    if (newIndex == songs.length) {
        newIndex--;
    }
    currentIndex = newIndex;
    loadCurrentSong();
    activeSong();
}
function loadCurrentSong() {
    h2Element.innerText = currentSong.name;
    cdThumb.style.backgroundImage = `url(${currentSong.image})`
    musicElement.src = currentSong.path;
}
function activeSong() {
    var elementSongs = $$(".song");
    $('.song.active').classList.remove('active');
    elementSongs[currentIndex].classList.add('active');
}
function selectSong() {
    playList.onclick = function (e) {
        if (e.target.closest('.song:not(.active)') && !e.target.closest('.option')) {
            currentIndex = e.target.closest('.song').dataset.id;
            loadCurrentSong();
            activeSong();
            musicElement.play();
        }
        if (e.target.closest('.option')) {
            console.log('Cài đặt');
        }
    }
}
function scrollToActiveSong() {
    $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'end'
    })
}
function start() {
    defineProperties();
    loadConfig();
    repeatBtn.classList.toggle('active',isRepeat);
    randomSongBtn.classList.toggle('active',isRandom);
    handleEvents();
    loadCurrentSong();
    this.render();
    audioTiming();
    selectSong();


}
start();


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'THANHTHUONG-PLAYER'

const playList = $('.playlist')
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');


const app = {
    //lấy ra chỉ mục đầu tiên của mảng
    currentIndex: 0,
    isPlaying: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs:[
        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/MuonRoiMaSaoCon-SonTungMTP-7011803.mp3',
            image: './assets/img/mrmsc.jpg'
        },
        {
            name: 'Do for love',
            singer: 'Bray X Amee',
            path: './assets/music/B RAY x AMEE x MASEW - DO FOR LOVE - Official MV.mp3',
            image: './assets/img/1581612119736_500.jpg'
        },
        {
            name: 'Bất chấp',
            singer: 'Whee',
            path: './assets/music/BẤT CHẤP - WHEE! (Official Music Video).mp3',
            image: './assets/img/1615363863146_640.jpg'
        },
        {
            name: 'Dù cho mai về sau',
            singer: 'Buitruonglinh',
            path: './assets/music/Dù Cho Mai Về Sau (Official Music Video) - buitruonglinh.mp3',
            image: './assets/img/download.jpg'
        },
        {
            name: 'Mộng mơ',
            singer: 'Masew X Bray',
            path: './assets/music/Masew x RedT - Mộng Mơ - Official M-V.mp3',
            image: './assets/img/mm.jpg'
        },{
            name: 'Vì yêu cứ đâm đầu',
            singer: 'Min',
            path: './assets/music/VÌ YÊU CỨ ĐÂM ĐẦU (CM1X & VRT REMIX) - MIN x ĐEN x JUSTATEE.mp3',
            image: './assets/img/ci-yeu.jpg'
        },
        {
            name: 'Mơ',
            singer: 'Vũ Cát Tường',
            path: './assets/music/Vu Cat Tuong - Mơ (Dreaming) - Official MV.mp3',
            image: './assets/img/maxresdefault.jpg'
        },
        {
            name: 'Tìm hành tinh khác',
            singer: 'Vũ Cát Tường',
            path: './assets/music/Vũ Cát Tường ft. Onic - Tìm Hành Tinh Khác - Official MV.mp3',
            image: './assets/img/maxresdefault (1).jpg'
        },
        {
            name: 'Xin đừng nhấc máy',
            singer: 'Bray X Amee',
            path: './assets/music/XIN ĐỪNG NHẤC MÁY - B RAY X HAN SARA [OFFICIAL MV].mp3',
            image: './assets/img/634f2223e10d196ed8f049464eb5ae66.jpg'
        },
        {
            name: 'Xuân hạ thu đông rồi lại xuân',
            singer: 'Ái Phương',
            path: './assets/music/Xuân Hạ Thu Đông Rồi Lại Xuân - Ái Phương.mp3',
            image: './assets/img/maxresdefault (2).jpg'
        },
    ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function(){
        const html = this.songs.map((song, index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
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
        })
        playList.innerHTML = html.join('');
    },

    definedProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    //lắng nghe sự kiện cả trang document
    handleEvent: function(){
        const _this = this;//đặt biến _this = this bên ngoài
        //lắng nghe sự kiện cả trang document
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;//lấy kích thước chiều ngang
        //Xử lí phóng to thu nhỏ CD
        document.onscroll = function(){
            //lấy kích thước khi hành động kéo cửa sổ theo chiều dọc
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;//để ẩn cd đi
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;//set width mới nếu > 0 thì nhận còn không thì sẽ = 0
            cd.style.opacity = newCdWidth / cdWidth;//opacity mờ dần
        }
         //xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate(
        [
          {
            transform: 'rotate(360deg)',
          },
        ],
        {
          duration: 10000,
          iterations: Infinity,
        }
      );
      cdThumbAnimate.pause();
        //Xử lý khi clickplay
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
                
            }else{
                audio.play();
                
            }
            //khi song play
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add('playing')
                cdThumbAnimate.play();
            }
            //khi song pause
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove('playing')
                cdThumbAnimate.pause();
            }
            //khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent;
                }
            }
            //xử lí khi tua
            progress.onchange = function(e){
                const seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            }
            
         };
         //Khi next bài hát
         nextBtn.onclick = function(){
             if(_this.isRandom){
                _this.playRandomSong();
             }else{
                 _this.nextSong();
             }
             audio.play();
             _this.render();
             _this.scrollToActiveSong();
             cdThumbAnimate.play();
         }
         //Prev song
         prevBtn.onclick = function(){
             if(_this.isRandom){
               _this.playRandomSong();
             }else{
                 _this.prevSong();
             }
             audio.play();
             _this.render();
             _this.scrollToActiveSong();
         }
         //Bật tắt random
         randomBtn.onclick = function(){
             _this.isRandom = !_this.isRandom;
             _this.setConfig('isRandom', _this.isRandom)
             randomBtn.classList.toggle('active', _this.isRandom);
         }
         //Xử lý next song khi audio ended
         audio.onended = function(){
             if(_this.isRepeat){
                 audio.play()
             }else{
                 nextBtn.click();//tự bấm click
             }
         }
         //Xử lý phát lại bài hát
         repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat);
         }
         //lắng nghe hành vi click vào playlist
         playList.onclick = function(e){
             const songNode = e.target.closest('.song:not(.active)');
             //Xử lý khi click chuyển đến bài
             if( songNode || e.target.closest('.option')){
                if(songNode){
                    //lấy ra index của Song khi click
                  _this.currentIndex = Number(songNode.dataset.index);//do chỗ này get xong sẽ thành chuỗi nên convert sang Number
                  _this.loadCurrentSong();
                  audio.play();
                  _this.render();
                }
                //Xử lý khi click vào option
             }
         }
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex > this.songs.length - 1) {
          this.currentIndex = 0;
        }
        this.loadCurrentSong();
      },
      prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
          this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong();
      },
      playRandomSong: function(){
          let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
      },
      scrollToActiveSong: function () {
        setTimeout(() =>{
            const scrollActive = $('.song.active')
            if(this.currentIndex === 1 || 2 || 3){
                scrollActive.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            }else{
                scrollActive.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                })
            }
        }, 300)
      },

    start: function(){
        //gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        //Định nghĩa các thuộc tính cho obj
        this.definedProperties()

        //lắng nghe xử lý các sự kiện
        this.handleEvent()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //render lại danh sách bài hát
        this.render()

        //cấu hình ban đầu
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
}
app.start();
export const MusicPlayer = {
  _player: null,
  _ready: false,
  _playing: false,
  _toastShown: false,
  _toastRef: null,
  PLAYLIST_ID: 'PL6NdkXsPL07KN01gH2vucrHCEyyNmVEx4',

  init(toastRef) {
    this._toastRef = toastRef;

    const div = document.createElement('div');
    div.id = 'yt-player';
    div.style.cssText = 'position:absolute;opacity:0;pointer-events:none;width:1px;height:1px;top:-9999px;left:-9999px;';
    document.body.appendChild(div);

    window.onYouTubeIframeAPIReady = () => this._createPlayer();
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);

    // Expose globally for volume dropdown
    window._musicPlayer = this;
  },

  _createPlayer() {
    this._player = new YT.Player('yt-player', {
      height: '1', width: '1',
      playerVars: {
        listType: 'playlist', list: this.PLAYLIST_ID,
        autoplay: 0, controls: 0, playsinline: 1, enablejsapi: 1,
      },
      events: {
        onReady: e => this._onReady(e),
        onStateChange: e => this._onStateChange(e),
      },
    });
    document.addEventListener('visibilitychange', () => {
      if (!this._ready) return;
      if (document.hidden) { this._player?.pauseVideo(); }
      else if (this._playing) { this._player?.playVideo(); }
    });
  },

  _onReady(event) {
    this._ready = true;
    event.target.playVideo();
  },

  _onStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      this._playing = true;
      if (!this._toastShown) {
        this._toastShown = true;
        setTimeout(() => {
          const d = this._player.getVideoData();
          this._toastRef?.current?.showNowPlaying(d.title || 'lofi mix', d.video_id);
        }, 500);
      }
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
      this._playing = false;
    }
  },

  play() { this._player?.playVideo(); },
  pause() { this._player?.pauseVideo(); },
  toggle() { this._playing ? this.pause() : this.play(); },
  next() { this._player?.nextVideo(); },
  prev() { this._player?.previousVideo(); },
  setVolume(v) { this._player?.setVolume(v); },
  isPlaying() { return this._playing; },
};

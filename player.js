function htmlPlayer(id,opts){
  //
  if(!id) return false;

  this.player = document.getElementById(id);

  if(!this.player.volume){
    return false;
  }

  this.opts = opts;

  this.init();
}
htmlPlayer.prototype = {
  init:function(){
    var _self = this
      ,_player = _self.player
      ,apiMap
      ,browserApi
      ,specApi
      ,fullscreenAPI={}
    ;

    //全屏相关事件
    apiMap = [
      // Spec: https://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror'
      ],
      // WebKit
      [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror'
      ],
      // Old WebKit (Safari 5.1)
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror'
      ],
      // Mozilla
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror'
      ],
      // Microsoft
      [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError'
      ]
    ];
    specApi = apiMap[0];
    // determine the supported set of functions
    for (i=0; i<apiMap.length; i++) {
      // check for exitFullscreen function
      if (apiMap[i][1] in document) {
        browserApi = apiMap[i];
        break;
      }
    }
    if (browserApi) {
      for (i=0; i<browserApi.length; i++) {
        fullscreenAPI[specApi[i]] = browserApi[i];
      }
    }

    _self.fullscreenAPI = fullscreenAPI;
    _self.isFullScreen = false;// 是否全屏

    _player.autoplay = true;
    _player.load();
  }
  ,requestFullscreen:function(){//全屏
    var _self = this
        ,_apiMap = _self.fullscreenAPI
        ,_player = _self.player
    ;
    if(_self.isFullScreen) return false;

    if(_apiMap.requestFullscreen){
        _player[_apiMap.requestFullscreen]();
    }else{
      console.log('full');
    }

    _self.isFullScreen = true;
  }
  ,exitFullscreen:function(){//退出全屏
    var _self = this
        ,_apiMap = _self.fullscreenAPI
        ,_player = _self.player
        ,_fn = _player[_apiMap.exitFullscreen]
    ;
    if(!_self.isFullScreen) return false;

    if(_apiMap.exitFullscreen){
        _player[_apiMap.exitFullscreen]();
    }else{
      console.log('exit');
    }

    _self.isFullScreen = false;
  }
  ,getVol:function(){//获取音量
    //
    var _self = this
      ,_player = _self.player
    ;
    return _player.volume;
  }
  ,setVol:function(num){//设置音量
    //
    var _self = this
      ,_player = _self.player
    ;

    if(typeof num === 'number' && num<=1){
      _player.volume = num;
    }
  }
  ,getDuration:function(){
    var _self = this
      ,_player = _self.player
    ;
    return _player.duration;
  }
  ,getTime:function(){//当前时间点
    var _self = this
      ,_player = _self.player
    ;
    return _player.currentTime;
  }
  ,setTime:function(num){//设置播放点
    var _self = this
      ,_player = _self.player
    ;
    if(typeof num === 'number'){
      _player.currentTime = num;
    }
  }
  ,checkMuted:function(){//判断是否静音
    var _self = this
      ,_player = _self.player
    ;

    return _player.muted;
  }
  ,setMuted:function(){//设置成静音
    var _self = this
      ,_player = _self.player
    ;
    _player.muted = true;
  }
  ,calMuted:function(){//取消静音
    var _self = this
      ,_player = _self.player
    ;
    _player.muted = false;
  }
  ,on:function(type,fn){
    var _self = this
      ,_player = _self.player
    ;
    if(type && typeof fn === 'function'){
      _player.addEventListener(type,fn);
    }

    return _self;
  }
  ,off:function(type,fn){
    var _self = this
      ,_player = _self.player
    ;
    if(!type && typeof fn === 'function'){
      _player.removeEventListener(type,fn);
    }

    return _self;
  }
  ,play:function(){//播放
    var _self = this
      ,_player = _self.player
    ;

    _player.play();
  }
  ,pause:function(){//暂停
    var _self = this
      ,_player = _self.player
    ;

    _player.pause();
  }
  ,getBuffer:function(){//获取缓存
    var _self = this
      ,_player = _self.player
    ;
    return _player.buffered.end(_player.buffered.length-1);
  }
  ,setSrc:function(url){
    var _self = this
      ,_player = _self.player
    ;
    if(url){
      _player.src = url;
    }
  }
  ,getSrc:function(){
    var _self = this
      ,_player = _self.player
    ;
    return _player.src;
  }
  ,formatSecond:function(secondParam){
    var timestamp = "00:00:00";
    if (typeof secondParam === 'number') {
      var second = Number(secondParam);
      var minute = 0;
      var hour = 0;
      if (second >= 60) {
        minute = Number(second / 60);
        second = Number(second % 60);
        if (minute >= 60) {
          hour = Number(minute / 60);
          minute = Number(minute % 60);
        }
      }
      if (second < 10) {// 秒
        timestamp = ":0" + parseInt(second,10);
      } else {
        timestamp = ":" + parseInt(second,10);
      }
      if (minute < 10) {// 分
        timestamp = ":0" + parseInt(minute,10) + timestamp;
      } else {
        timestamp = ":" + parseInt(minute,10) + timestamp;
      }
      if (hour < 10) {// 时
        timestamp = "0" + parseInt(hour,10) + timestamp;
      } else {
        timestamp = "" + parseInt(hour,10) + timestamp;
      }
    }
    return timestamp;
  }
  ,getTolTimeStr:function(){
    var _self = this
      ,_player = _self.player
      ,_tol = _self.getDuration()
    ;
    return _self.formatSecond(_tol);
  }
  ,getTimeStr:function(){
    var _self = this
      ,_player = _self.player
      ,_time = _self.getTime()
    ;
    return _self.formatSecond(_time);
  }
};
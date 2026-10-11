<script setup>
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useAudioPlayerStore } from '@/stores/AudioJS';
import { storeToRefs } from 'pinia';

const searchkeywords = ref('')
const router = useRouter()
const usePlayer = useAudioPlayerStore()

const { PlayingSongUrl, isplaying, currentTime, duration, PlayingId, PlayingSong } = storeToRefs(usePlayer)


const handlesearch = () => {
  const keyword = searchkeywords.value.trim()
  if (!keyword) return
  router.push({
    name: 'search',
    query: { keyword }
  })

}
const userstore = useUserStore()
const userInfo = userstore.user
const quiteLogin = () => {
  userstore.clearUser()
}

const audioRef = ref(null)

const formatTime = (value) => {
  if (!Number.isFinite(value) || value <= 0) return '00:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const togglePlayback = () => {
  if (isplaying.value) {
    usePlayer.pause()
  } else {
    usePlayer.play()
  }
}

const playNextSong = () => {
  usePlayer.playNext()
}

const playPrevSong = () => {
  usePlayer.playPrev()
}

const handleLoadedMetadata = () => {
  if (audioRef.value) {
    usePlayer.setDuration(audioRef.value.duration || 0)
  }
}

const handleTimeUpdate = () => {
  if (audioRef.value) {
    usePlayer.setProgress(audioRef.value.currentTime || 0)
  }
}

const handleEnded = () => {
  usePlayer.pause()
  usePlayer.setProgress(0)
}

const handleSeek = (event) => {
  const nextTime = Number(event.target.value)
  usePlayer.setProgress(nextTime)
  if (audioRef.value) {
    audioRef.value.currentTime = nextTime
  }
}

watch(isplaying, (value) => {
  if (!audioRef.value) return
  if (value) {
    audioRef.value.play().catch(() => { })
  } else {
    audioRef.value.pause()
  }
}, { immediate: true })

watch(PlayingSongUrl, (url) => {
  if (!audioRef.value) return
  if (isplaying.value && url) {
    audioRef.value.play().catch(() => { })
  }
})


</script>

<template>
  <div class="app">
    <div class="top-nav">
      <div class="top-nav-inner">
        <h1 class="logo">
          <a href="/#" hidefocus="true"></a>
        </h1>
        <div class="nav-links">
          <RouterLink to="/" class="nav-link">音乐馆</RouterLink>
          <RouterLink to="/mymusic" class="nav-link">我的音乐</RouterLink>
        </div>
        <div class="nav-actions">
          <div class="search-box">
            <input v-model="searchkeywords" type="text" class="search-input" placeholder="搜索歌曲/歌手/专辑"
              @keyup.enter="handlesearch">
          </div>
          <div class="login-box">
            <RouterLink v-if="!userstore.isLogin" to="/login" class="login-btn">登录</RouterLink>
            <div class="user-avatar" v-else>
              <div>
                <img class="userImg" :src="userstore.user.avatar" alt="">
              </div>
              <!-- 下拉框 -->
              <div class="user-drop">
                <div class="userName">{{ userInfo.nickname }}</div>
                <button class="unlogin" @click="quiteLogin()">退出登录</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <main class="main-content">
      <RouterView />
    </main>
    <div class="bottom">
      <div class="btm-cnt">
        <div class="cnt-btn">
          <button class="ctrl-btn" @click="playPrevSong">上一首</button>
          <button class="ctrl-btn primary" @click="togglePlayback">
            {{ isplaying ? '暂停' : '播放' }}
          </button>
          <button class="ctrl-btn" @click="playNextSong">下一首</button>
        </div>
        <div class="s">
          <span class="time">{{ formatTime(currentTime) }}</span>
          <input class="progress-bar" type="range" min="0" :max="Math.max(1, Math.floor(duration))"
            :value="Math.floor(currentTime)" @input="handleSeek" />
          <span class="ss">{{ formatTime(duration) }}</span>
        </div>
      </div>
      <audio ref="audioRef" :src="PlayingSongUrl" @loadedmetadata="handleLoadedMetadata" @timeupdate="handleTimeUpdate"
        @ended="handleEnded" autoplay />
    </div>
  </div>
</template>
<style scoped>
.app {
  --top-height: 90px;
  --bottom-height: 90px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #eeeeee;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-display: swap;
}

.top-nav {
  height: 90px;
  display: flex;
  background-color: #242424;
  color: #333;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  z-index: 1;
  top: 0;
  width: 100%;
}

.top-nav-inner {
  width: 100%;
  max-width: 800px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-items: flex-start;
}

.logo {
  background: url(./assets/topbar.png) no-repeat 0 9999px;
  float: left;
  height: 69px;
  width: 176px;
  background-position: 0 0;
}

.logo a {
  float: left;
  width: 157px;
  height: 100px;
  padding-right: 20px;
  text-indent: -9999px;
}

.nav-links {
  display: flex;
  gap: 24px;
  margin-left: 24px;
}

.nav-link {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 18px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #fff;
  background-color: red;
}

.nav-actions {
  display: flex;
  align-items: center;
  margin: auto 0 auto auto;

}

.search-input {
  padding: 5px;
  border-radius: 20px;
  border: none;
}

.login-box {
  border-radius: 18px;
  margin-left: 16px;
}

.login-btn {
  padding: 8px 16px;
  color: red;
  text-decoration: none;
  border: 1px solid red;
  font-size: 14px;
  background: none;
  border-radius: 20px;
}

.main-content {
  /* reserve space for fixed top-nav and bottom player using CSS variables */
  position: relative;
  display: block;
  padding-top: var(--top-height);
  padding-bottom: var(--bottom-height);
  box-sizing: border-box;
  min-height: calc(100vh - var(--top-height) - var(--bottom-height));
}

.user-avatar {
  width: 50px;
  height: 50px;
  text-align: center;
}

.userImg {
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 50%;
}

.user-avatar:hover .user-drop {
  display: block;
}

.user-drop {
  width: 100px;
  height: 100px;
  font-size: 14px;
  background-color: white;
  text-align: center;
  display: none;
  position: relative;
  border-radius: 0 0 5px 5px;
}

.userName {
  padding-top: 10px;
}

.unlogin {
  border: none;
  margin: 10px;
}

.bottom {
  background-color: #242424;
  width: 100%;
  height: 90px;
  position: fixed;
  bottom: 0;
}

.btm-cnt {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  gap: 12px;
  padding: 16px;
  border-radius: 10px;
  margin-top: 10px;
}

.cnt-btn {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.ctrl-btn {
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  color: #fff;
  background: #4d4d4d;
  cursor: pointer;
}

.ctrl-btn.primary {
  background: #ff3b3b;
}

.s {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f0f0f0;
  width: 50%;
}

.progress-bar {
  flex: 1;
  accent-color: #ff3b3b;
  width: 80%;
}
</style>

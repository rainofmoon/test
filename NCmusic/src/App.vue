<script setup>
import { RouterView, RouterLink } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';
const searchkeywords = ref('')
const handlesearch = () => {
  const keyword = searchkeywords.value.trim()
  console.log(keyword)
}
const userstore = useUserStore()
console.log(userstore.isLogin)

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

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>
<style scoped>
.app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #eeeeee;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

}

.top-nav {
  height: 90px;
  display: flex;
  background-color: #242424;
  color: #333;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
}

.main-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  width: 50px;
  height: 50px;
}

.userImg {
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 50%;
}
</style>

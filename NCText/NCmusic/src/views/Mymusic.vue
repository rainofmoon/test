<template>
    <div class="my-content">
        <div class="user-content">
            <div class="user-content-detail">
                <div class="user-content-detail-left">
                    <div class="user-img">
                        <img class="userImg" :src="avator" />
                    </div>
                </div>
                <div class="uset-content-detail-rigth">
                    <div class="user-name">
                        <span>{{ nickname }}</span>
                    </div>
                    <div class="user-other">
                        <div class="user-other-item">
                            <span class="extre">{{ userEvents.length }}</span>
                            <span>动态</span>
                        </div>
                        <div class="user-other-item">
                            <span class="extre">{{ userFollows.length }}</span>
                            <span>关注</span>
                        </div>
                        <div class="user-other-item">
                            <span class="extre">{{ userFans.length }}</span>
                            <span>粉丝</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="user-playlist">
                <div class="user-playlist-title">
                    <span class="title">我创建的歌单（{{ UserCreatedPlayLists.length }}）</span>
                </div>
                <div class="user-playlist-content">
                    <Listcard :list="UserCreatedPlayLists" />
                </div>
            </div>
            <div class="user-playlist">
                <div class="user-playlist-title">
                    <span class="title">我收藏的歌单（{{ UserCollectedPlayLists.length }}）</span>
                </div>
                <div class="user-playlist-content">
                    <Listcard :list="UserCollectedPlayLists" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import http from '@/http/axios';
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import Listcard from '@/components/Listcard.vue';

const userInfo = useUserStore()
const { user } = storeToRefs(userInfo)

const avator = computed(() => user.value?.avatar || '')
const nickname = computed(() => user.value?.nickname || '未知用户')
const userId = computed(() => user.value?.id || '')

const userFollows = ref([])
const userFans =ref([])
const userEvents = ref([])
const UserCreatedPlayLists = ref([])
const UserCollectedPlayLists = ref([])

const fetchUserDetails = async (id) => {
    if (!id) return;
    try {
        const follows = await http.get('/user/follows', {
            uid: id
        })
        const events = await http.get('/user/event', {
            uid: id
        })
        const fans = await http.get('/user/followeds', {
            uid: id
        })
        userFollows.value = follows.follow
        userEvents.value = events.events
        userFans.value = fans.followeds
    } catch (err) {
        console.error(err)
    }
}
const fetchUserPlaylists = async (id) => {
    if (!id) return;
    try {
        const res = await http.get('/user/playlist', {
            uid: id
        })
        const data = res.playlist
        UserCreatedPlayLists.value = data.filter((item) => item.userId === id)
        UserCollectedPlayLists.value = data.filter((item) => item.userId !== id)
    } catch (err) {
        console.error(err)
    }
}

onMounted(() => {
    fetchUserDetails(userId.value)
    fetchUserPlaylists(userId.value)
})

</script>

<style scoped>
.my-content {
    width: 800px;
    background-color: #fff;
    margin: 0 auto;
    border: 1px solid rgb(221, 221, 221);
    padding: 40px;
}

.user-content {
    width: 100%;
    height: auto;
}

.user-content-detail {
    display: flex;
    margin-bottom: 20px;
}

.uset-content-detail-rigth {
    margin: 10px 0 0 20px;
    width: 100%;
}

.user-name {
    width: 100%;
    font-size: 24px;
    font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
    padding-bottom: 12px;
    margin-bottom: 10px;
    border-bottom: 1px solid rgb(221, 221, 221);
}

.user-other {
    display: flex;
}

.user-other-item {
    margin-right: 20px;
    padding-right: 20px;
    font-size: 14px;
    border-right: 1px solid rgb(221, 221, 221);
    display: flex;
    flex-direction: column;
}

.extre {
    font-size: 22px;
    font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
    color: rgb(125, 125, 125)
}

.user-playlist {
    width: 100%;
    height: auto;
}

.user-playlist-title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
    border-bottom: 1px solid rgb(194, 12, 12);
}
</style>
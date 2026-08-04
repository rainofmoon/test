<template>
    <div class="listcard">
        <div class="card-content" v-for="list in List.list" :key="list.id" @click="songlist(list.id)">
            <div class="card-content-img">
                <img :src="list.coverImgUrl">
            </div>
            <div class="card-content-name">
                <div>{{ list.name }}</div>
            </div>
        </div>
    </div>
</template>

<script setup name="listcard">
import { ref,defineProps } from 'vue';
import { useRouter } from 'vue-router';
import http from '@/http/axios';

const router = useRouter();
const List = defineProps(['list'])
const songlist = (id) => {
    router.push({
        name:'musiclist',
        query:{id}
    })
}
</script>
<style>
.listcard {
    width: 800px;
    display:inline-grid;
    grid-template-columns:auto auto auto auto auto;
}

.card-content-img {
    width: 125px;
    height: 125px;
}

img {
    width: 125px;
    height: 125px;
    object-fit: cover;
    border-radius: 10px;
    margin: 10px
}

.card-content-name {
    width: 125px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 10px;
    padding-top: 5px
}
</style>
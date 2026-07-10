import { ref,computed } from 'vue';
import { defineStore } from 'pinia';


//本地存储的key
const STORAGE_KEY = 'NC_USER';

export const useUserStore = defineStore('user',() => {
    const user = ref(null);

    //判断是否登录
    const isLogin = computed(() => !!user.value);


    //状态管理的存储，包括本地存储和pinia状态管理
    const setUser = (userInfo) => {
        console.log(userInfo)

        if(!userInfo) return;

        console.log(userInfo)
        const normalized = {
            id: userInfo.id,
            nickname: userInfo.nickname,
            avatar: userInfo.avatar,
        }
        console.log(normalized)
        user.value = normalized;
        localStorage.setItem(STORAGE_KEY,JSON.stringify(normalized));
    }

    //清除用户信息
    const clearUser = () => {
        user.value = null;
        localStorage.removeItem(STORAGE_KEY);
    }

    //从本地存储中初始化用户信息
    const initUser = () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if(!raw) return;
        const parsed = JSON.parse(raw);
        if(parsed && parsed.id) {
            user.value = parsed;
        }
    }


    initUser();

    return {
        user,
        isLogin,
        setUser,
        clearUser,
    }
})
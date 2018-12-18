<template>
    <div>
        <button>
            <router-link to='/vue2_1'>vue2_1</router-link>
        </button>
        <button>
            <router-link to='/testChildren/vue2_2'>vue2_2</router-link>
        </button>
        <button>
            <router-link to='/testChildren/vue2_3'>vue2_3</router-link>
        </button>
    </div>
</template>

<script>
    export default {
        watch: {
            '$route' () {
                console.log('路由改变了', this.$route);
            }
        },
        beforeRouteEnter (to, from, next) {
            console.log('进入');
            next();
        },
        beforeRouteLeave (to, from, next) {
            console.log('离开');
            next();
        },
    };
</script>

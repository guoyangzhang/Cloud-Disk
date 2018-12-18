<template>
    <h3>vue2_1111</h3>
</template>

<script>
    export default {
        watch: {
            '$route' () {
                console.log('路由改变了', this.$route);
            }
        },
        beforeRouteEnter (to, from, next) {
            console.log('进入 vue2_1');
            next();
        },
        beforeRouteLeave (to, from, next) {
            console.log('离开 vue2_1');
            next();
        },
    };
</script>

<style scoped>

</style>

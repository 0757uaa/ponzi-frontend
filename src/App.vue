<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import './styles/main.scss';
#app {
  font-family: 'Microsoft Yahei', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
</style>

<!--<style lang="less">
  @import './styles/two/variables';
  @import './styles/two/element-ui';
  @import './styles/two/common';
  @import './styles/two/scrollBar';
</style>-->

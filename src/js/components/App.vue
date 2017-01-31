<template>
  <div id="my-component">
    I'm the component : {{msg}}
  </div>
</template>

<script>
  export default {
    name: 'my-component',
    data () {
      return {
        msg: 'Vue.js App'
      }
    }
  }
</script>
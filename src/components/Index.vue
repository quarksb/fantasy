<template>
  <div id="container" >
    <h1>Welcome to quark homePage!</h1>
    <p>
      <router-link to="/lotus">Go to lotus</router-link>
      <router-link to="/magicText">Go to magic text</router-link>
      <router-link to="/heartFlowers">Go to heart flowers</router-link>
      <router-link to="/collision">Go to collision</router-link>
    </p>
  </div>
</template>

<script type="text/javascript">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HelloVue',
  data () {
    return {
    }
  },
  methods: {

  }
})
</script>

<style type="text/css">
</style>

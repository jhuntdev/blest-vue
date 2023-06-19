<script setup>
import Component1 from './components/Component1.vue'
import Component2 from './components/Component2.vue'
import Component3 from './components/Component3.vue'
import Component4 from './components/Component4.vue'
</script>

<template>
  <BlestProvider url='http://localhost:8080'>
    <div>
      <h1>BLEST Vue Example</h1>
      <hr />
      <Component1 />
      <hr />
      <Component2 />
      <hr />
      <Component3 />
      <hr />
      <Component4 />
    </div>
  </BlestProvider>
</template>

<script>
import { BlestProvider } from 'blest-vue'
export default {
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  },
};
</script>
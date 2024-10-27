<template>
  <div>
    <h3>["greet", {"name": "<input type="text" auto-complete="off" v-model="name" />"}]</h3>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <p v-else>{{ JSON.stringify(data) }}</p>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { blestLazyRequest } from 'blest-vue'
export default {
  setup() {
    const name = ref('Steve')
    const [greet, queryState]= blestLazyRequest('greet', { auth: 'myToken' })
    greet({ name: name.value })
    watch(name, (newName) => {
      greet({ name: newName })
    })
    return {
      name,
      ...queryState
    }
  }
};
</script>
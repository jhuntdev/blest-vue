<template>
  <div>
    <h3>["greet", { "name": "Steve" }]</h3>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <p v-else>{{ JSON.stringify(data) }}</p>
  </div>
</template>

<script>
import { blestRequest } from 'blest-vue'
export default {
  setup() {
    const queryState = blestRequest('greet', { name: 'Steve' })
    return queryState
  }
};
</script>
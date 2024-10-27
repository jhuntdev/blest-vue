# BLEST Vue

A Vue client for BLEST (Batch-able, Lightweight, Encrypted State Transfer), an improved communication protocol for web APIs which leverages JSON, supports request batching by default, and provides a modern alternative to REST.

To learn more about BLEST, please visit the website: https://blest.jhunt.dev

## Features

- Built on JSON - Reduce parsing time and overhead
- Request Batching - Save bandwidth and reduce load times
- Compact Payloads - Save even more bandwidth
- Single Endpoint - Reduce complexity and improve data privacy
- Fully Encrypted - Improve data privacy

## Installation

Install BLEST Vue from npm

With npm:
```bash
npm install --save blest-vue
```
or using yarn:
```bash
yarn add blest-vue
```

## Usage

Wrap your app (or just part of it) with `BlestProvider`.

```html
<template>
  <BlestProvider url='http://localhost:8080' options={{ headers: { Authorization: 'Bearer token' } }}>
    <!-- Your app here -->
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
```

Use the `blestRequest` function to perform passive requests on mount and when parameters change.

```html
<template>
  <div>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <p v-else>{{ JSON.stringify(data) }}</p>
  </div>
</template>

<script>
import { blestRequest } from 'blest-vue'
export default {
  setup() {
    const { data, error, loading } = blestRequest('listItems', { limit: 24 }, ['data', ['pageInfo', ['endCursor', 'hasNextPage']]])

    return { data, error, loading }
  }
};
</script>
```

Use the `blestCommand` function to generate a request function you can call when needed.

```html
<template>
  <div>
    <!-- Your form here -->
    <button v-on:click="handleSubmit()">Submit</button>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <p v-else>{{ JSON.stringify(data) }}</p>
  </div>
</template>

<script>
import { blestCommand } from 'blest-vue'
export default {
  setup() {
    const [submitForm, { data, loading, error }] = blestCommand('submitForm')

    const handleSubmit = () => {
      submitForm({
        hello: 'World'
      })
    }

    return { handleSubmit, data, loading, error }
  }
};
</script>
```

## License

This project is licensed under the [MIT License](LICENSE).
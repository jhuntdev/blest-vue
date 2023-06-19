import { ref, reactive, provide, inject, onMounted, watchEffect } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const BlestSymbol = Symbol()

export const BlestProvider = {
  props: {
    url: String,
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { slots }) {
    const queue = reactive([])
    const state = reactive({})
    const timeout = ref()

    const enqueue = (id, route, params, selector) => {
        if (timeout.value) clearTimeout(timeout.value)
        state[id] = {
            loading: false,
            error: null,
            data: null
        }
        queue.push([id, route, params, selector])
    }

    watchEffect(() => {
        if (queue.length > 0) {
            const headers = options?.headers && typeof options?.headers === 'object' ? options.headers : {}
            const myQueue = [...queue]
            const requestIds = queue.map((q) => q[0])
            queue.splice(0)
            timeout.value = setTimeout(() => {
                for (let i = 0; i < requestIds.length; i++) {
                    const id = requestIds[i]
                    state[id] = {
                        loading: true,
                        error: null,
                        data: null
                    }
                }
                fetch(props.url, {
                    body: JSON.stringify(myQueue),
                    mode: 'cors',
                    method: 'POST',
                    headers: {
                        ...headers,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                .then(async (result) => {
                    const results = await result.json()
                    for (let i = 0; i < results.length; i++) {
                        const item = results[i]
                        state[item[0]] = {
                            loading: false,
                            error: item[3],
                            data: item[2]
                        }
                    }
                })
                .catch((error) => {
                    for (let i = 0; i < myQueue.length; i++) {
                        const id = requestIds[i]
                        state[id] = {
                            loading: false,
                            error: error,
                            data: null
                        }
                    }
                })
            }, 1)
        }
    })

    provide(BlestSymbol, { queue, state, enqueue })

    return () => slots.default()
  }
}

export function blestContext() {
  const context = inject(BlestSymbol)
  onMounted(() => {
    console.warn('useBlestContext() is a utility function for debugging')
  })
  return context
}

export function blestRequest(route, params, selector) {
    const { state, enqueue } = inject(BlestSymbol)
    const requestId = ref(null)
    const data = ref(null)
    const error = ref(null)
    const loading = ref(false)
    const lastRequest = ref()

    watchEffect(() => {
        const requestHash = route + JSON.stringify(params || {}) + JSON.stringify(selector || {})
        if (lastRequest.value !== requestHash) {
            lastRequest.value = requestHash
            const id = uuidv4()
            requestId.value = id
            enqueue(id, route, params, selector)
        }
        if (requestId.value && state[requestId.value]) {
            const reqState = state[requestId.value]
            data.value = reqState.data
            error.value = reqState.error
            loading.value = reqState.loading
        }
    })
  
    return {
        data,
        error,
        loading
    }
}

export function blestCommand(route, selector) {
    const { state, enqueue } = inject(BlestSymbol)
    const requestId = ref(null)
    const data = ref(null)
    const error = ref(null)
    const loading = ref(false)
  
    const request = (params) => {
        const id = uuidv4()
        requestId.value = id
        enqueue(id, route, params, selector)
    }

    watchEffect(() => {
        if (requestId.value && state[requestId.value]) {
            const reqState = state[requestId.value]
            data.value = reqState.data
            error.value = reqState.error
            loading.value = reqState.loading
        }
    })

    return [request, {
        data,
        error,
        loading
    }]
}

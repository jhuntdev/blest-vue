import { ref, reactive, provide, inject, onMounted, watchEffect, SetupContext } from 'vue'
import { v1 as uuid } from 'uuid'

interface BlestRequestState {
    loading: boolean;
    error: any;
    data: any;
  }
  
interface BlestGlobalState {
    [id: string]: BlestRequestState;
}

type BlestSelector = Array<string | BlestSelector>

type BlestQueueItem = [string, string, any?, BlestSelector?]

interface BlestContextValue {
    queue: BlestQueueItem[],
    state: BlestGlobalState,
    enqueue: any
}

const BlestSymbol = Symbol()

interface BlestProviderProps {
    url: string
    options: BlestProviderOptions
}

interface BlestProviderOptions {
  maxBatchSize?: number
  bufferDelay?: number
  headers?: any
}

export const BlestProvider = {
  props: {
    url: String,
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup({ url, options }: BlestProviderProps, { slots }: SetupContext) {
    // const queue = reactive<[string, string, any?, any?][]>([])
    const state = reactive<BlestGlobalState>({})
    const queue = ref<[string, string, any?, any?][]>([])
    const timeout = ref<number | null>(null)

    const maxBatchSize = options?.maxBatchSize && typeof options.maxBatchSize === 'number' && options.maxBatchSize > 0 && Math.round(options.maxBatchSize) === options.maxBatchSize && options.maxBatchSize || 25
    const bufferDelay = options?.bufferDelay && typeof options.bufferDelay === 'number' && options.bufferDelay > 0 && Math.round(options.bufferDelay) === options.bufferDelay && options.bufferDelay || 10
    const headers = options?.headers && typeof options.headers === 'object' ? options.headers : {}

    const enqueue = (id: string, route: string, params?: any, selector?: BlestSelector) => {
        state[id] = {
            loading: false,
            error: null,
            data: null
        }
        queue.value.push([id, route, params, selector])
        if (!timeout.value) {
            timeout.value = setTimeout(() => { process() }, bufferDelay)
        }
    }

    const process = () => {
        if (timeout.value) {
          clearTimeout(timeout.value)
          timeout.value = null
        }
        if (!queue.value.length) {
            return
        }
        const copyQueue: BlestQueueItem[] = queue.value.map((q: BlestQueueItem) => [...q])
        queue.value.splice(0)
        const batchCount = Math.ceil(copyQueue.length / maxBatchSize)
        for (let i = 0; i < batchCount; i++) {
          const myQueue = copyQueue.slice(i * maxBatchSize, (i + 1) * maxBatchSize)
          const requestIds = myQueue.map((q: BlestQueueItem) => q[0])
          for (let i = 0; i < requestIds.length; i++) {
              const id = requestIds[i]
              state[id] = {
                  loading: true,
                  error: null,
                  data: null
              }
          }
          fetch(url, {
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
        }
    }

    provide(BlestSymbol, { queue, state, enqueue })

    if (!slots.default) {
        throw new Error('Expecting a default slot')
    }

    // @ts-expect-error
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

export const blestRequest = (route: string, params?: any, selector?: BlestSelector) => {
    // @ts-expect-error
    const { state, enqueue } = inject<BlestContextValue>(BlestSymbol)
    const requestId = ref<string | null>(null)
    const data = ref<any | null>(null)
    const error = ref<any | null>(null)
    const loading = ref<boolean>(false)
    const lastRequest = ref<string | null>(null)

    watchEffect(() => {
        const requestHash = route + JSON.stringify(params || {}) + JSON.stringify(selector || {})
        if (lastRequest.value !== requestHash) {
            lastRequest.value = requestHash
            const id = uuid()
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

export const blestLazyRequest = (route: string, selector?: BlestSelector) => {
    // @ts-expect-error
    const { state, enqueue } = inject<BlestContextValue>(BlestSymbol)
    const requestId = ref<string | null>(null)
    const data = ref<any | null>(null)
    const error = ref<any | null>(null)
    const loading = ref<boolean>(false)
  
    const request = (params?: any) => {
        const id = uuid()
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

export const blestCommand = blestLazyRequest
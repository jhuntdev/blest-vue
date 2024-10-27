import { SetupContext } from 'vue';
interface BlestProviderProps {
    url: string;
    options: BlestProviderOptions;
}
interface BlestProviderOptions {
    maxBatchSize?: number;
    bufferDelay?: number;
    httpHeaders?: any;
}
export declare const BlestProvider: {
    props: {
        url: StringConstructor;
        options: {
            type: ObjectConstructor;
            default: () => {};
        };
    };
    setup({ url, options }: BlestProviderProps, { slots }: SetupContext): () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[];
};
export declare function blestContext(): unknown;
export declare const blestRequest: (route: string, body?: any, headers?: any) => {
    data: import("vue").Ref<any, any>;
    error: import("vue").Ref<any, any>;
    loading: import("vue").Ref<boolean, boolean>;
};
export declare const blestLazyRequest: (route: string, headers?: any) => (((body?: any) => void) | {
    data: import("vue").Ref<any, any>;
    error: import("vue").Ref<any, any>;
    loading: import("vue").Ref<boolean, boolean>;
})[];
export {};

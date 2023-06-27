import { SetupContext } from 'vue';
type BlestSelector = Array<string | BlestSelector>;
interface BlestProviderProps {
    url: string;
    options: any;
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
export declare function blestRequest(route: string, params?: any, selector?: BlestSelector): {
    data: any;
    error: any;
    loading: import("vue").Ref<boolean>;
};
export declare function blestCommand(route: string, selector?: BlestSelector): (((params?: any) => void) | {
    data: any;
    error: any;
    loading: import("vue").Ref<boolean>;
})[];
export {};

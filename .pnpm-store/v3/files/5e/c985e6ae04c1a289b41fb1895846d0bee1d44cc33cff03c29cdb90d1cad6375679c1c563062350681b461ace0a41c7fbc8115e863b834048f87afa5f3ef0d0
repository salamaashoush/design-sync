import { Accessor } from "solid-js";
import { ImageLoadingStatus } from "./types";
export interface ImageContextValue {
    fallbackDelay: Accessor<number | undefined>;
    imageLoadingStatus: Accessor<ImageLoadingStatus>;
    onImageLoadingStatusChange: (status: ImageLoadingStatus) => void;
}
export declare const ImageContext: import("solid-js").Context<ImageContextValue>;
export declare function useImageContext(): ImageContextValue;

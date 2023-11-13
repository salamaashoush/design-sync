import { CollectionNode } from "./types";
interface BuildNodesParams {
    dataSource: any[];
    getKey?: string | ((data: any) => string);
    getTextValue?: string | ((data: any) => string);
    getDisabled?: string | ((data: any) => boolean);
    getSectionChildren?: string | ((section: any) => any[]);
    startIndex?: number;
    startLevel?: number;
}
/**
 * Generate a flatted array of `CollectionNode` from a custom data source.
 */
export declare function buildNodes(params: BuildNodesParams): Array<CollectionNode>;
export {};

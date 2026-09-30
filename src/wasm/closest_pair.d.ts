/* tslint:disable */
/* eslint-disable */

export class Canvas {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    initializeCanvas(amount: number, xsize: number, ysize: number): void;
    returnClosestDistance(): number;
    returnOperation(): string[];
    returnPointsX(): string[];
    returnPointsY(): Point[];
}

export class Point {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
}

export function initializeClosestPointsX(amount: number, xSize: number, ySize: number): Point[];

export function initializeClosestPointsY(amount: number, xSize: number, ySize: number): Point[];

export function instantiateStruct(): Canvas;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_canvas_free: (a: number, b: number) => void;
    readonly __wbg_point_free: (a: number, b: number) => void;
    readonly canvas_initializeCanvas: (a: number, b: number, c: number, d: number) => void;
    readonly canvas_returnClosestDistance: (a: number) => number;
    readonly canvas_returnOperation: (a: number) => [number, number];
    readonly canvas_returnPointsX: (a: number) => [number, number];
    readonly canvas_returnPointsY: (a: number) => [number, number];
    readonly initializeClosestPointsX: (a: number, b: number, c: number) => [number, number];
    readonly initializeClosestPointsY: (a: number, b: number, c: number) => [number, number];
    readonly instantiateStruct: () => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;

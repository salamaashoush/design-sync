import { MaybeAccessor, Many, Directive } from '@solid-primitives/utils';
import { JSX, Accessor, Component } from 'solid-js';

type EventListenerOptions = boolean | AddEventListenerOptions;
type TargetWithEventMap = Window | Document | XMLDocument | HTMLBodyElement | HTMLFrameSetElement | HTMLMediaElement | HTMLVideoElement | HTMLElement | SVGSVGElement | SVGElement | MathMLElement | Element | AbortSignal | AbstractWorker | Animation | BroadcastChannel | CSSAnimation | CSSTransition | FileReader | IDBDatabase | IDBOpenDBRequest | IDBRequest | IDBTransaction | MediaDevices | MediaKeySession | MediaQueryList | MediaRecorder | MediaSource | MediaStream | MediaStreamTrack | MessagePort | Notification | PaymentRequest | Performance | PermissionStatus | PictureInPictureWindow | RemotePlayback | ScreenOrientation | ServiceWorker | ServiceWorkerContainer | ServiceWorkerRegistration | ShadowRoot | SharedWorker | SourceBuffer | SourceBufferList | SpeechSynthesis | SpeechSynthesisUtterance | VisualViewport | WebSocket | Worker | XMLHttpRequest | XMLHttpRequestEventTarget | XMLHttpRequestUpload | EventSource;
type EventMapOf<Target> = Target extends Window ? WindowEventMap : Target extends Document | XMLDocument ? DocumentEventMap : Target extends HTMLBodyElement ? HTMLBodyElementEventMap : Target extends HTMLFrameSetElement ? HTMLFrameSetElementEventMap : Target extends HTMLMediaElement ? HTMLMediaElementEventMap : Target extends HTMLVideoElement ? HTMLVideoElementEventMap : Target extends HTMLElement ? HTMLElementEventMap : Target extends SVGSVGElement ? SVGSVGElementEventMap : Target extends SVGElement ? SVGElementEventMap : Target extends MathMLElement ? MathMLElementEventMap : Target extends Element ? ElementEventMap : Target extends AbortSignal ? AbortSignalEventMap : Target extends AbstractWorker ? AbstractWorkerEventMap : Target extends Animation ? AnimationEventMap : Target extends BroadcastChannel ? BroadcastChannelEventMap : Target extends CSSAnimation ? AnimationEventMap : Target extends CSSTransition ? AnimationEventMap : Target extends FileReader ? FileReaderEventMap : Target extends IDBDatabase ? IDBDatabaseEventMap : Target extends IDBOpenDBRequest ? IDBOpenDBRequestEventMap : Target extends IDBRequest ? IDBRequestEventMap : Target extends IDBTransaction ? IDBTransactionEventMap : Target extends MediaDevices ? MediaDevicesEventMap : Target extends MediaKeySession ? MediaKeySessionEventMap : Target extends MediaQueryList ? MediaQueryListEventMap : Target extends MediaRecorder ? MediaRecorderEventMap : Target extends MediaSource ? MediaSourceEventMap : Target extends MediaStream ? MediaStreamEventMap : Target extends MediaStreamTrack ? MediaStreamTrackEventMap : Target extends MessagePort ? MessagePortEventMap : Target extends Notification ? NotificationEventMap : Target extends PaymentRequest ? PaymentRequestEventMap : Target extends Performance ? PerformanceEventMap : Target extends PermissionStatus ? PermissionStatusEventMap : Target extends PictureInPictureWindow ? PictureInPictureWindowEventMap : Target extends RemotePlayback ? RemotePlaybackEventMap : Target extends ScreenOrientation ? ScreenOrientationEventMap : Target extends ServiceWorker ? ServiceWorkerEventMap : Target extends ServiceWorkerContainer ? ServiceWorkerContainerEventMap : Target extends ServiceWorkerRegistration ? ServiceWorkerRegistrationEventMap : Target extends ShadowRoot ? ShadowRootEventMap : Target extends SharedWorker ? AbstractWorkerEventMap : Target extends SourceBuffer ? SourceBufferEventMap : Target extends SourceBufferList ? SourceBufferListEventMap : Target extends SpeechSynthesis ? SpeechSynthesisEventMap : Target extends SpeechSynthesisUtterance ? SpeechSynthesisUtteranceEventMap : Target extends VisualViewport ? VisualViewportEventMap : Target extends WebSocket ? WebSocketEventMap : Target extends Worker ? WorkerEventMap : Target extends XMLHttpRequest ? XMLHttpRequestEventMap : Target extends XMLHttpRequestEventTarget ? XMLHttpRequestEventTargetEventMap : Target extends XMLHttpRequestUpload ? XMLHttpRequestEventTargetEventMap : Target extends EventSource ? EventSourceEventMap : never;
type EventListenerDirectiveProps = [
    type: string,
    handler: (e: any) => void,
    options?: EventListenerOptions
];
declare module "solid-js" {
    namespace JSX {
        interface Directives {
            eventListener: EventListenerDirectiveProps;
        }
    }
}
type E = JSX.Element;

/**
 * Creates an event listener, that will be automatically disposed on cleanup.
 * @param target - ref to HTMLElement, EventTarget
 * @param type - name of the handled event
 * @param handler - event handler
 * @param options - addEventListener options
 * @returns Function clearing all event listeners form targets
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/event-listener#makeEventListener
 * @example
 * const clear = makeEventListener(element, 'click', e => { ... }, { passive: true })
 * // remove listener (will also happen on cleanup)
 * clear()
 */
declare function makeEventListener<Target extends TargetWithEventMap, EventMap extends EventMapOf<Target>, EventType extends keyof EventMap>(target: Target, type: EventType, handler: (event: EventMap[EventType]) => void, options?: EventListenerOptions): VoidFunction;
declare function makeEventListener<EventMap extends Record<string, Event>, EventType extends keyof EventMap = keyof EventMap>(target: EventTarget, type: EventType, handler: (event: EventMap[EventType]) => void, options?: EventListenerOptions): VoidFunction;
/**
 * Creates a reactive event listener, that will be automatically disposed on cleanup,
 * and can take reactive arguments to attach listeners to new targets once changed.
 * @param target - ref to HTMLElement, EventTarget or Array thereof
 * @param type - name of the handled event
 * @param handler - event handler
 * @param options - addEventListener options
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/event-listener#createEventListener
 * @example
 * const [targets, setTargets] = createSignal([element])
 * createEventListener(targets, 'click', e => { ... }, { passive: true })
 * setTargets([]) // <- removes listeners from previous target
 * setTargets([element, button]) // <- adds listeners to new targets
 */
declare function createEventListener<Target extends TargetWithEventMap, EventMap extends EventMapOf<Target>, EventType extends keyof EventMap>(target: MaybeAccessor<Many<Target | undefined>>, type: MaybeAccessor<Many<EventType>>, handler: (event: EventMap[EventType]) => void, options?: EventListenerOptions): void;
declare function createEventListener<EventMap extends Record<string, Event>, EventType extends keyof EventMap = keyof EventMap>(target: MaybeAccessor<Many<EventTarget | undefined>>, type: MaybeAccessor<Many<EventType>>, handler: (event: EventMap[EventType]) => void, options?: EventListenerOptions): void;
/**
 * Provides an reactive signal of last captured event.
 *
 * @param target - ref to HTMLElement, EventTarget or Array thereof
 * @param type - name of the handled event
 * @param options - addEventListener options
 *
 * @returns Signal of last captured event & function clearing all event listeners
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/event-listener#createEventSignal
 *
 * @example
 * const lastEvent = createEventSignal(el, 'click', { passive: true })
 *
 * createEffect(() => {
 *    console.log(lastEvent())
 * })
 */
declare function createEventSignal<Target extends TargetWithEventMap, EventMap extends EventMapOf<Target>, EventType extends keyof EventMap>(target: MaybeAccessor<Many<Target>>, type: MaybeAccessor<Many<EventType>>, options?: EventListenerOptions): Accessor<EventMap[EventType]>;
declare function createEventSignal<EventMap extends Record<string, Event>, EventType extends keyof EventMap = keyof EventMap>(target: MaybeAccessor<Many<EventTarget>>, type: MaybeAccessor<Many<EventType>>, options?: EventListenerOptions): Accessor<EventMap[EventType]>;
/**
 * Directive Usage. Creates an event listener, that will be automatically disposed on cleanup.
 *
 * @param props [eventType, handler, options]
 *
 * @example
 * <button use:eventListener={["click", () => {...}]}>Click me!</button>
 */
declare const eventListener: Directive<EventListenerDirectiveProps>;

type EventHandlersMap<EventMap> = {
    [EventName in keyof EventMap]: (event: EventMap[EventName]) => void;
};
/**
 * A helpful primitive that listens to a map of events. Handle them by individual callbacks.
 *
 * @param target accessor or variable of multiple or single event targets
 * @param handlersMap e.g. `{ mousemove: e => {}, click: e => {} }`
 * @param options e.g. `{ passive: true }`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/event-listener#createEventListenerMap
 *
 * @example
 * createEventListenerMap(element, {
 *   mousemove: mouseHandler,
 *   mouseenter: e => {},
 *   touchend: touchHandler
 * });
 */
declare function createEventListenerMap<Target extends TargetWithEventMap, EventMap extends EventMapOf<Target>, HandlersMap extends Partial<EventHandlersMap<EventMap>>>(target: MaybeAccessor<Many<Target>>, handlersMap: HandlersMap, options?: EventListenerOptions): void;
declare function createEventListenerMap<EventMap extends Record<string, Event>>(target: MaybeAccessor<Many<EventTarget>>, handlersMap: Partial<EventHandlersMap<EventMap>>, options?: EventListenerOptions): void;

type WindowEventProps = {
    [K in keyof WindowEventMap as `on${Capitalize<K>}` | `on${K}`]?: (event: WindowEventMap[K]) => void;
};
type DocumentEventProps = {
    [K in keyof DocumentEventMap as `on${Capitalize<K>}` | `on${K}`]?: (event: DocumentEventMap[K]) => void;
};
/**
 * Listen to the `window` DOM Events, using a component.
 *
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/event-listener#WindowEventListener
 *
 * @example
 * <WindowEventListener onMouseMove={e => console.log(e.x, e.y)} />
 */
declare const WindowEventListener: Component<WindowEventProps>;
/**
 * Listen to the `document` DOM Events, using a component.
 *
 * @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/event-listener#DocumentEventListener
 *
 * @example
 * <DocumentEventListener onMouseMove={e => console.log(e.x, e.y)} />
 */
declare const DocumentEventListener: Component<DocumentEventProps>;

type EventListenerStackOn<EventMap extends Record<string, any>> = {
    <T extends keyof EventMap>(type: T, handler: (event: EventMap[T]) => void, options?: EventListenerOptions): VoidFunction;
};
/**
 * Creates a stack of event listeners, that will be automatically disposed on cleanup.
 * @param target - ref to HTMLElement, EventTarget
 * @param options - addEventListener options
 * @returns Function clearing all event listeners form targets
 * @example
 * const [listen, clear] = makeEventListenerStack(target, { passive: true });
 * listen("mousemove", handleMouse);
 * listen("dragover", handleMouse);
 * // remove listener (will also happen on cleanup)
 * clear()
 */
declare function makeEventListenerStack<Target extends TargetWithEventMap, EventMap extends EventMapOf<Target>>(target: Target, options?: EventListenerOptions): [listen: EventListenerStackOn<EventMap>, clear: VoidFunction];
declare function makeEventListenerStack<EventMap extends Record<string, Event>>(target: EventTarget, options?: EventListenerOptions): [listen: EventListenerStackOn<EventMap>, clear: VoidFunction];

/**
 * Calls `e.preventDefault()` on the `Event` and calls the {@link callback}
 *
 * @param callback Event handler
 * @returns Event handler matching {@link callback}'s type
 * @example
 * ```tsx
 * const handleClick = (e) => {
 *    concole.log("Click!", e)
 * }
 * makeEventListener(window, "click", preventDefault(handleClick), true);
 * // or in jsx:
 * <div onClick={preventDefault(handleClick)} />
 * ```
 */
declare const preventDefault: <E extends Event>(callback: (event: E) => void) => (event: E) => void;
/**
 * Calls `e.stopPropagation()` on the `Event` and calls the {@link callback}
 *
 * @param callback Event handler
 * @returns Event handler matching {@link callback}'s type
 * @example
 * ```tsx
 * const handleClick = (e) => {
 *    concole.log("Click!", e)
 * }
 * makeEventListener(window, "click", stopPropagation(handleClick), true);
 * // or in jsx:
 * <div onClick={stopPropagation(handleClick)} />
 * ```
 */
declare const stopPropagation: <E extends Event>(callback: (event: E) => void) => (event: E) => void;
/**
 * Calls `e.stopImmediatePropagation()` on the `Event` and calls the {@link callback}
 *
 * @param callback Event handler
 * @returns Event handler matching {@link callback}'s type
 * @example
 * ```tsx
 * const handleClick = (e) => {
 *    concole.log("Click!", e)
 * }
 * makeEventListener(window, "click", stopImmediatePropagation(handleClick), true);
 * // or in jsx:
 * <div onClick={stopImmediatePropagation(handleClick)} />
 * ```
 */
declare const stopImmediatePropagation: <E extends Event>(callback: (event: E) => void) => (event: E) => void;

export { DocumentEventListener, DocumentEventProps, E, EventHandlersMap, EventListenerDirectiveProps, EventListenerOptions, EventListenerStackOn, EventMapOf, TargetWithEventMap, WindowEventListener, WindowEventProps, createEventListener, createEventListenerMap, createEventSignal, eventListener, makeEventListener, makeEventListenerStack, preventDefault, stopImmediatePropagation, stopPropagation };

// src/mutationObserver.ts
import { getDefaultState } from "./mutation.js";
import { notifyManager } from "./notifyManager.js";
import { Subscribable } from "./subscribable.js";
import { shallowEqualObjects } from "./utils.js";
var MutationObserver = class extends Subscribable {
  constructor(client, options) {
    super();
    this.#currentResult = void 0;
    this.#client = client;
    this.setOptions(options);
    this.bindMethods();
    this.#updateResult();
  }
  #client;
  #currentResult;
  #currentMutation;
  #mutateOptions;
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    this.options = this.#client.defaultMutationOptions(options);
    if (!shallowEqualObjects(prevOptions, this.options)) {
      this.#client.getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: this.#currentMutation,
        observer: this
      });
    }
    this.#currentMutation?.setOptions(this.options);
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#currentMutation?.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    this.#updateResult();
    this.#notify(action);
  }
  getCurrentResult() {
    return this.#currentResult;
  }
  reset() {
    this.#currentMutation = void 0;
    this.#updateResult();
    this.#notify();
  }
  mutate(variables, options) {
    this.#mutateOptions = options;
    this.#currentMutation?.removeObserver(this);
    this.#currentMutation = this.#client.getMutationCache().build(this.#client, this.options);
    this.#currentMutation.addObserver(this);
    return this.#currentMutation.execute(variables);
  }
  #updateResult() {
    const state = this.#currentMutation?.state ?? getDefaultState();
    this.#currentResult = {
      ...state,
      isPending: state.status === "pending",
      isSuccess: state.status === "success",
      isError: state.status === "error",
      isIdle: state.status === "idle",
      mutate: this.mutate,
      reset: this.reset
    };
  }
  #notify(action) {
    notifyManager.batch(() => {
      if (this.#mutateOptions && this.hasListeners()) {
        if (action?.type === "success") {
          this.#mutateOptions.onSuccess?.(
            action.data,
            this.#currentResult.variables,
            this.#currentResult.context
          );
          this.#mutateOptions.onSettled?.(
            action.data,
            null,
            this.#currentResult.variables,
            this.#currentResult.context
          );
        } else if (action?.type === "error") {
          this.#mutateOptions.onError?.(
            action.error,
            this.#currentResult.variables,
            this.#currentResult.context
          );
          this.#mutateOptions.onSettled?.(
            void 0,
            action.error,
            this.#currentResult.variables,
            this.#currentResult.context
          );
        }
      }
      this.listeners.forEach((listener) => {
        listener(this.#currentResult);
      });
    });
  }
};
export {
  MutationObserver
};
//# sourceMappingURL=mutationObserver.js.map
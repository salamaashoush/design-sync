import { createStore } from "solid-js/store";
const [state, setState] = createStore({
    toasts: [],
});
function add(toast) {
    setState("toasts", prev => [...prev, toast]);
}
function get(id) {
    return state.toasts.find(toast => toast.id === id);
}
function update(id, toast) {
    const index = state.toasts.findIndex(toast => toast.id === id);
    if (index != -1) {
        setState("toasts", prev => [...prev.slice(0, index), toast, ...prev.slice(index + 1)]);
    }
}
function dismiss(id) {
    setState("toasts", toast => toast.id === id, "dismiss", true);
}
function remove(id) {
    setState("toasts", prev => prev.filter(toast => toast.id !== id));
}
function clear() {
    setState("toasts", []);
}
export const toastStore = {
    toasts: () => state.toasts,
    add,
    get,
    update,
    dismiss,
    remove,
    clear,
};

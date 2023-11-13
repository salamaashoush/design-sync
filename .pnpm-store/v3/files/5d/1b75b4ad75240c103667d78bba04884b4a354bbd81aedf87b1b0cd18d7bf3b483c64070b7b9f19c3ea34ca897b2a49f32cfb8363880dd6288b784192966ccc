const eventHandlers = {};
let currentId = 0;
export function on(name, handler) {
    const id = `${currentId}`;
    currentId += 1;
    eventHandlers[id] = { handler, name };
    return function () {
        delete eventHandlers[id];
    };
}
export function once(name, handler) {
    let done = false;
    return on(name, function (...args) {
        if (done === true) {
            return;
        }
        done = true;
        handler(...args);
    });
}
export const emit = typeof window === 'undefined'
    ? function (name, ...args) {
        figma.ui.postMessage([name, ...args]);
    }
    : function (name, ...args) {
        window.parent.postMessage({
            pluginMessage: [name, ...args]
        }, '*');
    };
function invokeEventHandler(name, args) {
    let invoked = false;
    for (const id in eventHandlers) {
        if (eventHandlers[id].name === name) {
            eventHandlers[id].handler.apply(null, args);
            invoked = true;
        }
    }
    if (invoked === false) {
        throw new Error(`No event handler with name \`${name}\``);
    }
}
if (typeof window === 'undefined') {
    figma.ui.onmessage = function (args) {
        if (!Array.isArray(args)) {
            return;
        }
        const [name, ...rest] = args;
        if (typeof name !== 'string') {
            return;
        }
        invokeEventHandler(name, rest);
    };
}
else {
    window.onmessage = function (event) {
        if (typeof event.data.pluginMessage === 'undefined') {
            return;
        }
        const args = event.data.pluginMessage;
        if (!Array.isArray(args)) {
            return;
        }
        const [name, ...rest] = event.data.pluginMessage;
        if (typeof name !== 'string') {
            return;
        }
        invokeEventHandler(name, rest);
    };
}
//# sourceMappingURL=events.js.map
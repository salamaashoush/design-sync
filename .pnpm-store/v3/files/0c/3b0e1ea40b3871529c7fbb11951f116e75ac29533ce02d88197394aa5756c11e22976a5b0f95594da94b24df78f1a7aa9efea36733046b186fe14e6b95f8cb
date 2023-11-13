/**
 * Create a function that call the setter with an id and return a function to reset it.
 */
export function createRegisterId(setter) {
    return (id) => {
        setter(id);
        return () => setter(undefined);
    };
}

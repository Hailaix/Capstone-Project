import { useState, useEffect } from 'react';

/** Allows storage of strings in localStorage
 *  Notably only works with strings, not arrays or objects
 */
const useLocalStorage = (key) => {
    //set state from local storage
    const [state, setState] = useState(() => {
        //retrieve state from localStorage
        return localStorage.getItem(key);
    });
    //any time state is changed, set it in localStorage as well
    useEffect(() => {
        if (state === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, state);
        }
    }, [key, state]);
    return [state, setState];
}

export default useLocalStorage;
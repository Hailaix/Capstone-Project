import { useState, useEffect } from 'react';

const useLocalStorage = (key, defaultVal = null) => {
    //set state either from local storage or defaultVal
    const [state, setState] = useState(() => {
        //if for some reason JSON.parse errors, just use defaultVal
        try {
            return JSON.parse(localStorage.getItem(key)) || defaultVal;
        } catch (e) {
            return defaultVal;
        }
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
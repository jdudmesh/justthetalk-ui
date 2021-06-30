import React from 'react';
const { createContext, useContext } = React;


const targetValues = {
    loaded: false,
    user: null,
};


const userHandler = () => {
    return {
        get: function(target, prop, receiver) {
            return target[prop];
        },
        set: function(target, prop, value) {
            target[prop] = value;
            return target[prop];
        }
    }
}

export async function createUserContextValue(accessToken) {

    targetValues.user = null;

    const handler = userHandler();
    const proxy = new Proxy(targetValues, handler);

    targetValues.loaded = true;

    return proxy;

}

export const UserContext = createContext({ loaded: false, user: null });
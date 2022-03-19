import { configureStore } from '@reduxjs/toolkit';
import createOidcMiddleware from 'redux-oidc';
import userManager from '../utils/userManager';
import { reducer as oidc } from 'redux-oidc';
import homeReducer from '../features/home/homeSlice'
const rootReducer = {
    home: homeReducer,
    oidc,
}
const oidcMiddleware = createOidcMiddleware(userManager);
const middleware = [oidcMiddleware];

const store = configureStore({
    reducer: rootReducer,
    middleware: middleware,
})

export default store;
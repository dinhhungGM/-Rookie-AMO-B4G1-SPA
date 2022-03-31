
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createOidcMiddleware from 'redux-oidc';
import userManager from '../utils/userManager';
import { reducer as oidc } from 'redux-oidc';
import homeReducer from '../features/home/homeSlice'

import userReducer from '../features/users/userSlice'


const rootReducer = {
    home: homeReducer,
    user: userReducer,
    oidc,
}

const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware({
        serializableCheck: false
      }), (createOidcMiddleware(userManager))]
})

export default store;
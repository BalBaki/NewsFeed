import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { userReducer } from './slices/userSlice';
import { notificationReducer } from './slices/notificationSlice';
import { userApi } from './apis/userApi';
import { newsApi } from './apis/newsApi';
import apiLimitMiddleware from './middlewares/apiLimitMiddleware';

const store = configureStore({
    reducer: {
        user: userReducer,
        notifications: notificationReducer,
        [userApi.reducerPath]: userApi.reducer,
        [newsApi.reducerPath]: newsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(userApi.middleware).concat(newsApi.middleware).concat(apiLimitMiddleware);
    },
});

setupListeners(store.dispatch);

export default store;
export { addNotification, updateNotifications, deleteNotification } from './slices/notificationSlice';
export { useRegisterMutation, useLoginMutation, useLazyVerifyQuery, useSaveSettingsMutation } from './apis/userApi';
export { useSearchMutation, useFetchFilterOptionsQuery, useFetchApisQuery } from './apis/newsApi';
export { logout } from './slices/userSlice';

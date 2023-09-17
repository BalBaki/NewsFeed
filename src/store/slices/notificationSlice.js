import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: [],
    reducers: {
        addNotification: (state, action) => {
            state.push(action.payload);
        },
        updateNotifications: (state, action) => {
            return action.payload;
        },
        deleteNotification: (state, action) => {
            return state.filter((notification) => notification.id !== action.payload.id);
        },
    },
});

export const notificationReducer = notificationSlice.reducer;
export const { addNotification, updateNotifications, deleteNotification } = notificationSlice.actions;

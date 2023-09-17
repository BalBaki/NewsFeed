import { createSlice } from '@reduxjs/toolkit';
import { register, login, verify } from '../apis/userApi';

const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        logout: (state, action) => {
            return {};
        },
    },
    extraReducers(builder) {
        builder.addMatcher(register.matchFulfilled, (state, action) => {
            if (action.payload.register) {
                const { token, ...others } = action.payload.user;

                return others;
            }
        });

        builder.addMatcher(login.matchFulfilled, (state, action) => {
            if (action.payload.login) {
                const { token, ...others } = action.payload.user;

                return others;
            }
        });

        builder.addMatcher(verify.matchFulfilled, (state, action) => {
            if (action.payload.valid) return action.payload.user;
        });
    },
});

export const userReducer = userSlice.reducer;
export const { logout } = userSlice.actions;

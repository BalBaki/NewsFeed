import { nanoid } from '@reduxjs/toolkit';

const ADD_NOTIFICATION = 'notification/addNotification';

const apiLimitMiddleware = (store) => {
    return (next) => {
        return (action) => {
            const result = next(action);

            if (action?.error?.message === 'Rejected' && action?.payload?.originalStatus === 429) {
                store.dispatch({
                    type: ADD_NOTIFICATION,
                    payload: {
                        duration: 5,
                        type: 'error',
                        messages: action?.payload?.data || 'Too Much Request. Wait a few minute',
                        id: nanoid(),
                        time: Date.now(),
                    },
                });
            }

            return result;
        };
    };
};

export default apiLimitMiddleware;

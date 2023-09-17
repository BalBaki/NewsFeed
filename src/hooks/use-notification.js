import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { addNotification } from '../store';

const useNotification = () => {
    const dispatch = useDispatch();

    return useCallback(
        (data) => {
            dispatch(addNotification({ ...data, id: nanoid(), time: Date.now(), duration: data.duration ?? 5 }));
        },
        [dispatch]
    );
};

export { useNotification };

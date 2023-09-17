import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { GoAlert, GoCheck } from 'react-icons/go';
import { useSelector, useDispatch } from 'react-redux';
import { updateNotifications, deleteNotification } from '../store';

function Notification() {
    const dispatch = useDispatch();
    const notifications = useSelector(({ notifications }) => notifications);
    const icons = {
        error: <GoAlert className="w-12 h-full" />,
        success: <GoCheck className="w-12 h-full" />,
    };

    const handleDeleteNotificationClick = (notification) => {
        dispatch(deleteNotification(notification));
    };

    useEffect(() => {
        let notificationInterval;

        if (notifications.length > 0) {
            notificationInterval = setInterval(() => {
                const filteredNotifications = notifications.filter(
                    (notification) => Date.now() < notification.time + notification.duration * 1000
                );

                filteredNotifications.length !== notifications.length &&
                    dispatch(updateNotifications(filteredNotifications));
            }, 300);
        }

        return () => clearInterval(notificationInterval);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notifications]);

    const renderednotifications = notifications.map((notification) => {
        const formattedMessages = Array.isArray(notification.messages)
            ? notification.messages
            : typeof notification.messages === 'object'
            ? [...Object.values(notification.messages)]
            : typeof notification.messages === 'string' && notification.messages
            ? [...[], notification.messages]
            : [];

        const renderedMessages = formattedMessages.map((message) => {
            return (
                <div key={message} className="break-words m-2">
                    {message}
                </div>
            );
        });

        const classes = classNames(
            'relative flex items-center justify-center text-lg text-white rounded-2xl px-2 min-h-[5rem] w-60 mt-2 animate-disappear',
            {
                'bg-red-500': notification.type === 'error',
                'bg-green-500': notification.type === 'success',
            }
        );

        return (
            <div
                key={notification.id}
                id={notification.id}
                className={classes}
                style={{ animationDelay: `${notification.duration}s` }}
            >
                <div
                    className="absolute right-3 top-0 cursor-pointer text-base"
                    onClick={() => handleDeleteNotificationClick(notification)}
                >
                    x
                </div>
                <div>{icons[notification.type]}</div>
                <div className="w-40 text-center ">{renderedMessages}</div>
            </div>
        );
    });

    return (
        notifications.length > 0 &&
        createPortal(
            <div className="fixed z-50 bottom-5 right-5">{renderednotifications}</div>,
            document.querySelector('.notification-container')
        )
    );
}

export default Notification;

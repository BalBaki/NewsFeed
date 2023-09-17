import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store';
import { useNotification } from '../../hooks/use-notification';

export default function Header() {
    const user = useSelector(({ user }) => user);
    const dispatch = useDispatch();
    const notification = useNotification();

    const handleLogoutClick = () => {
        document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT';

        dispatch(logout());

        notification({
            type: 'success',
            messages: 'Successfully Logouted',
        });
    };

    let content;

    if (user?.id) {
        content = (
            <>
                <button className="bg-red-400 w-24 h-7 rounded-xl text-white text-center" onClick={handleLogoutClick}>
                    LogOut
                </button>
            </>
        );
    } else {
        content = (
            <>
                <Link to="/login" className="py-1 px-7 bg-green-400 rounded-xl text-center text-white">
                    Login
                </Link>
                <Link to="/register" className="py-1 px-5 bg-green-400 rounded-xl text-center mr-2 text-white">
                    Register
                </Link>
            </>
        );
    }

    return <div className="flex flex-row-reverse items-center mt-2 mr-1">{content}</div>;
}

import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Notification from './components/Notification';
import { useLazyVerifyQuery } from './store';
import Loading from './components/Loading';

export default function App() {
    const [checkToken, { data, isLoading, error }] = useLazyVerifyQuery();
    const token = document.cookie.match(`(^|;)\\s*token\\s*=\\s*([^;]+)`)?.pop() || '';

    useEffect(() => {
        if (token) checkToken(token);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (token && data?.valid === false) {
        document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            <Notification />
        </>
    );
}

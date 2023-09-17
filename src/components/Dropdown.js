import { useState, useEffect, useRef } from 'react';
import { AiOutlineRight, AiOutlineDown } from 'react-icons/ai';

export default function Dropdown({ placeholder, children }) {
    const [isOpened, setIsOpened] = useState(false);
    const divEl = useRef();

    useEffect(() => {
        const handle = (event) => {
            if (!divEl.current) return;

            if (!divEl.current.contains(event.target)) {
                setIsOpened(false);
            }
        };

        document.addEventListener('click', handle, true);

        return () => {
            document.removeEventListener('click', handle);
        };
    }, []);

    const handleShowClick = () => {
        setIsOpened((c) => !c);
    };

    return (
        <div ref={divEl} className="relative border-2 capitalize break-all ">
            <div className="pl-1 flex justify-between items-center" onClick={handleShowClick}>
                <div>{placeholder}</div>
                {!isOpened ? <AiOutlineRight /> : <AiOutlineDown />}
            </div>
            {isOpened && (
                <div className="absolute w-full bg-white z-50 border-2 max-h-48 overflow-y-auto overflow-x-hidden left-[-2px] box-content">
                    {children}
                </div>
            )}
        </div>
    );
}

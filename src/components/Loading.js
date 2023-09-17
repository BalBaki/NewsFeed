import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function Loading() {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40">
            <div className="relative">
                <AiOutlineLoading3Quarters className="animate-spin h-full w-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                    <div className="text-sm">Loading</div>
                </div>
            </div>
        </div>
    );
}

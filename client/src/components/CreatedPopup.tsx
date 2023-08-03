import { useRef } from 'react';

type Props = {
    gameLink: string;
    expiryHours: number;
    closePopup: () => void;
    isDarkMode: boolean;
};

const CreatedPopup = ({ gameLink, expiryHours, closePopup, isDarkMode }: Props) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleCopyLink = () => {
        if (gameLink) {
            navigator.clipboard.writeText(gameLink);
        }
    };

    return (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} transition-opacity duration-500 ease-in-out`}>
            <div className={`relative max-w-[650px] rounded-lg p-8 shadow-lg w-1/2 h-2/5 flex flex-col items-center justify-around animate-bounceOnce ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} transition-colors duration-500 ease-in-out`}>
                <div className="absolute top-2 right-2">
                    <button onClick={closePopup} className="focus:outline-none">
                        <svg className={`fill-current w-6 h-6 ${isDarkMode ? "text-white" : "text-gray-600"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M10 8.586l4.95-4.95 1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10 3.636 5.05l1.414-1.414L10 8.586z" />
                        </svg>
                    </button>
                </div>

                <h1 className="text-2xl font-bold text-center">Generated a custom connections game!</h1>
                <textarea ref={textAreaRef} className="w-full h-1/4 bg-transparent border-none text-center" readOnly value={gameLink} />
                <div className="flex items-center justify-center">
                    <button onClick={handleCopyLink} className="py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:outline-none">Copy Link</button>
                </div>
                <p className="text-center">This link expires in {expiryHours} hours.</p>
            </div>
        </div>
    );
};

export default CreatedPopup;
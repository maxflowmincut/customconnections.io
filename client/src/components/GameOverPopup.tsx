interface GameOverPopupProps {
    selectionHistory: number[];
    lives: number;
    onClose: () => void;
    isDarkMode: boolean;
}

interface ColorMapping {
    [key: number]: string;
}

const GameOverPopup: React.FC<GameOverPopupProps> = ({ selectionHistory, lives, onClose, isDarkMode }) => {
    const colors: ColorMapping = {
        1: 'bg-game-yellow',
        2: 'bg-game-green',
        3: 'bg-game-blue',
        4: 'bg-game-purple',
    };

    const chunkedSelectionHistory = selectionHistory.reduce((resultArray: number[][], item, index) => {
        const chunkIndex = Math.floor(index / 4);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item + 1);

        return resultArray;
    }, [] as number[][]);

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className={`rounded-lg text-center overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                    <div className="absolute top-2 right-2">
                        <button onClick={onClose} className="focus:outline-none">
                            <svg className={`fill-current w-6 h-6 ${isDarkMode ? "text-white" : "text-gray-600"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M10 8.586l4.95-4.95 1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10 3.636 5.05l1.414-1.414L10 8.586z" />
                            </svg>
                        </button>
                    </div>
                    <h3 className="text-lg leading-6 font-medium" id="modal-title">
                        {lives <= 0 ? 'Oh no, you lost!' : 'Congratulations, you won!'}
                    </h3>
                    <div className="mt-2">
                        {lives > 0 &&
                            <p className="text-sm">
                                You finished the game with {lives} {lives === 1 ? 'life' : 'lives'} left.
                            </p>
                        }
                        <p className="text-sm">Here are your selected rows:</p>
                        <div className="flex flex-col items-center mt-2">
                            {chunkedSelectionHistory.map((chunk, index) =>
                                <div key={index} className="flex justify-center mb-2">
                                    {chunk.map((value, i) =>
                                        <div key={i} className={`w-6 h-6 ${colors[value]} m-1`}></div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameOverPopup;
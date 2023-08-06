import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import GameGrid from '../components/GameGrid';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../core/darkModeSlice';
import Alert from '../components/Alert';
import GameOverPopup from '../components/GameOverPopup'
import Confetti from 'react-confetti';

interface GameData {
    _id: string;
    texts: string[];
    rowNames: string[];
    lives: number;
    createdAt: string;
}

interface CategoryCompletion {
    category: number;
    position: number;
}

const CustomGamePage = () => {
    const isDarkMode = useSelector(selectIsDarkMode);
    const { gameId } = useParams();
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [randomTexts, setRandomTexts] = useState<{ text: string, originalIndex: number, isSelectable: boolean }[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const navigate = useNavigate();
    const [completedCategories, setCompletedCategories] = useState<CategoryCompletion[]>([]);
    const [lives, setLives] = useState<number>(0);
    const [previousLives, setPreviousLives] = useState<number>(0);
    const livesRef = useRef(lives);
    livesRef.current = lives;
    const [alertText, setAlertText] = useState("");
    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [selectionHistory, setSelectionHistory] = useState<number[]>([]);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [submittedSets, setSubmittedSets] = useState<number[][]>([]);
    const [shake, setShake] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const closeGameOverPopup = () => {
        setGameOver(false);
    }

    useEffect(() => {
        if (lives === 0 && previousLives !== 0 && gameData) {
            setSelectedIndices([]);
            revealCategories();
        }
        if (lives > 0 && completedCategories.length === 4) {
            setShowConfetti(true);
            setTimeout(() => {
                setGameOver(true);
            }, 1500);
            setTimeout(() => {
                setShowConfetti(false);
            }, 6000);
        }
    }, [lives, previousLives, gameData, completedCategories]);

    const revealRow = (i: number) => () => {
        setRandomTexts(prevRandomTexts => {
            let newRandomTexts = [...prevRandomTexts];
            for (let j = i * 4; j < (i + 1) * 4; j++) {
                const index = newRandomTexts.findIndex(item => item.originalIndex === j);
                newRandomTexts[index].isSelectable = false;
            }
            return newRandomTexts.sort((a, b) => (a.isSelectable === b.isSelectable ? 0 : a.isSelectable ? 1 : -1));
        });
        setCompletedCategories(prev => [...prev, { category: i, position: prev.length }]);
    }

    const revealCategories = () => {
        if (!gameData) return;

        const categoriesToReveal = [];
        for (let i = 0; i < gameData.rowNames.length; i++) {
            if (!completedCategories.some(({ category }) => category === i)) {
                categoriesToReveal.push(i);
            }
        }

        categoriesToReveal.sort((a, b) => a - b);

        let revealSpeed = 1000;
        for (const category of categoriesToReveal) {
            setTimeout(revealRow(category), revealSpeed);
            revealSpeed += 1000;
        }

        revealSpeed += 1200;

        setTimeout(() => {
            setGameOver(true);
        }, revealSpeed);
    }

    useLayoutEffect(() => {
        const updateSize = () => {
            if (headerRef.current) {
                setHeaderHeight((headerRef.current as HTMLElement).offsetHeight);
            }
        };

        const interval = setInterval(updateSize, 100);

        window.addEventListener('resize', updateSize);

        return () => {
            window.removeEventListener('resize', updateSize);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setPreviousLives(livesRef.current);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleRectangleClick = (originalIndex: number) => {
        setSelectedIndices((prev) => {
            if (prev.includes(originalIndex)) {
                return prev.filter(i => i !== originalIndex);
            }
            return [...prev, originalIndex].slice(0, 4);
        });
    };

    useEffect(() => {
        const fetchGameData = async () => {
            const response = await fetch(`/api/game/${gameId}`);
            if (!response.ok) {
                navigate('/404');
                return;
            }
            const gameData: GameData = await response.json();
            setGameData(gameData);
            setLives(gameData.lives);
            setPreviousLives(gameData.lives);

            const indices = Array.from({ length: gameData.texts.length }, (_, i) => i);
            let randomizedTexts = [];

            while (indices.length > 0) {
                const randomIndex = Math.floor(Math.random() * indices.length);
                randomizedTexts.push({ text: gameData.texts[indices[randomIndex]], originalIndex: indices[randomIndex], isSelectable: true });
                indices.splice(randomIndex, 1);
            }

            setRandomTexts(randomizedTexts);
        };

        fetchGameData();
    }, [gameId, navigate]);

    const handleSubmit = () => {
        if (lives <= 0) {
            setAlertText("You've Already Lost!");
            return;
        }
        if (completedCategories.length === 4) {
            setAlertText("You've Already Won!");
            return;
        }
        if (selectedIndices.length < 4) {
            setAlertText("Please select 4 items.");
            return;
        }


        const sortedIndices = [...selectedIndices].sort();
        if (submittedSets.some(set => set.every((value, index) => value === sortedIndices[index]))) {
            setAlertText("Already submitted");
            return;
        }

        const categories = selectedIndices.map(index => Math.floor(index / 4));

        setSelectionHistory(prevRows => [...prevRows, ...categories]);
        setSubmittedSets(prevSets => [...prevSets, sortedIndices]);

        const categoryCounts = categories.reduce((counts, category) => {
            counts[category] = (counts[category] || 0) + 1;
            return counts;
        }, {} as { [key: number]: number });

        const uniqueCategories = Object.keys(categoryCounts);
        const allSameCategory = uniqueCategories.length === 1;
        const offByOne = uniqueCategories.length === 2 && Object.values(categoryCounts).includes(3);

        if (allSameCategory) {
            let newRandomTexts = [...randomTexts];
            selectedIndices.forEach((originalIndex) => {
                const index = newRandomTexts.findIndex(item => item.originalIndex === originalIndex);
                newRandomTexts[index].isSelectable = false;
            });
            setRandomTexts(newRandomTexts.sort((a, b) => (a.isSelectable === b.isSelectable ? 0 : a.isSelectable ? 1 : -1)));
            setSelectedIndices([]);
            setCompletedCategories(prev => [...prev, { category: categories[0], position: prev.length }]);
        } else {
            if (lives === 1) {
                setAlertText("You Lost!");
            }
            else {
                setAlertText(offByOne ? "One off" : "Incorrect");
            }
            setLives(lives - 1);
        }
    }

    const handleDeselectAll = () => {
        setSelectedIndices([]);
    }

    const handleShuffle = () => {
        if (!gameData || lives === 0 || completedCategories.length === 4) {
            return;
        }

        let uncompletedTexts = randomTexts.filter(item => item.isSelectable);
        let completedTexts = randomTexts.filter(item => !item.isSelectable);

        let completedRows = completedCategories.map(({ position }) => position);

        let rows: { text: string, originalIndex: number, isSelectable: boolean }[][] = Array.from({ length: gameData.rowNames.length }, () => []);

        for (let text of completedTexts) {
            let row = completedCategories.find(category => category.category === Math.floor(text.originalIndex / 4))?.position;
            if (typeof row === 'undefined') continue;
            rows[row].push(text);
        }

        for (let i = uncompletedTexts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [uncompletedTexts[i], uncompletedTexts[j]] = [uncompletedTexts[j], uncompletedTexts[i]];
        }

        let uncompletedRowIndex = 0;
        for (let text of uncompletedTexts) {
            while (completedRows.includes(uncompletedRowIndex) || rows[uncompletedRowIndex].length >= 4) {
                uncompletedRowIndex++;
                if (uncompletedRowIndex >= gameData.rowNames.length) {
                    uncompletedRowIndex = 0;
                }
            }
            rows[uncompletedRowIndex].push(text);

            do {
                uncompletedRowIndex = (uncompletedRowIndex + 1) % gameData.rowNames.length;
            } while (completedRows.includes(uncompletedRowIndex) && rows[uncompletedRowIndex].length < 4);
        }

        let newRandomTexts = rows.flat();
        setRandomTexts(newRandomTexts);
    };

    if (!gameData) {
        return (
            <div className={`relative container mx-auto h-screen flex flex-col ${isDarkMode ? 'text-white' : 'text-black'}`}>
                <div ref={headerRef}>
                    <Header />
                </div>
                <div className="mt-4"></div>
                <div className="flex justify-center mt-20">
                    <div className="text-4xl">Loading...</div>
                </div>
            </div>
        )
    }

    const isMobile = windowWidth < 768;

    return (
        <div className={`relative container mx-auto h-screen flex flex-col ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <div ref={headerRef}>
                <Header />
            </div>
            <Alert text={alertText} setText={setAlertText} headerHeight={headerHeight} />
            <div className="flex flex-1 flex-col items-center justify-between pt-20">
                <GameGrid
                    values={randomTexts}
                    onRectangleClick={handleRectangleClick}
                    selectedIndices={selectedIndices}
                    submitClicked={false}
                    completedCategories={completedCategories}
                    rowNames={gameData.rowNames}
                />
                {showConfetti && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
                        <Confetti />
                    </div>
                )}
                {gameOver &&
                    <div className={`transition-all duration-400 ease-in-out ${isDarkMode ? "bg-black text-white" : "bg-white text-gray-900"}`}>
                        <GameOverPopup
                            selectionHistory={selectionHistory}
                            lives={lives}
                            onClose={closeGameOverPopup}
                            isDarkMode={isDarkMode}
                        />
                    </div>
                }
                <div className="mt-4"></div>
                <div className="flex items-center">
                    <div className={`text-2xl mr-4 ${isMobile ? 'text-lg' : ''}`}>Mistakes remaining:</div>
                    <div className="flex items-center justify-center">
                        {Array.from({ length: previousLives }).map((_, i) => (
                            <div
                                key={i}
                                className={`mx-1 w-4 h-4 bg-[#5A594E] rounded-full flex items-center justify-center ${previousLives > lives && i >= lives ? 'animate-fadeOut' : ''}`}
                                onAnimationEnd={() => setPreviousLives(lives)}
                            ></div>
                        ))}
                    </div>
                </div>
                <div className="mt-4"></div>
                <div className="flex justify-center space-x-4">
                    <button
                        className={`rounded-lg py-3 px-10 shadow-lg text-xl tracking-wide font-semibold ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} transform transition-transform duration-500 ease-in-out hover:scale-105 active:scale-95 ${isMobile ? 'py-2 px-3 text-sm' : ''}`}
                        onClick={handleShuffle}
                    >
                        Shuffle
                    </button>

                    <button
                        className={`rounded-lg py-3 px-10 shadow-lg text-xl tracking-wide font-semibold ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} transform transition-transform duration-500 ease-in-out hover:scale-105 active:scale-95 ${isMobile ? 'py-2 px-3 text-sm' : ''}`}
                        onClick={handleDeselectAll}
                    >
                        Deselect All
                    </button>

                    <button
                        className={`rounded-lg py-3 px-10 shadow-lg text-xl tracking-wide font-semibold ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} transform transition-transform duration-500 ease-in-out hover:scale-105 active:scale-95 ${lives === 0 || completedCategories.length === 4 ? 'opacity-50 cursor-not-allowed' : ''} ${isMobile ? 'py-2 px-3 text-sm' : ''}`}
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
                <div className="flex-grow"></div>
            </div>
        </div>
    );
};

export default CustomGamePage;
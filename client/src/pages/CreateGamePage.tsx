import { useState, FormEvent, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../core/darkModeSlice';
import BubbleCreator from '../components/BubbleCreator';
import CreatedPopup from '../components/CreatedPopup';

const CreateGamePage = () => {
    const isDarkMode = useSelector(selectIsDarkMode);
    const rows = 4;
    const cols = 4;
    const colors = ['#FBD400', '#B5E352', '#729EEB', '#BC70C4'];
    const maxChars = 22;
    const maxLeftChars = 40;

    const [texts, setTexts] = useState<string[]>(Array(rows * cols).fill(''));
    const [rowNames, setRowNames] = useState<string[]>(Array(rows).fill(''));
    const [selectedRectangle, setSelectedRectangle] = useState<number | null>(null);
    const [isLeftSelected, setIsLeftSelected] = useState<boolean>(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [lives, setLives] = useState(4);
    const [gameLink, setGameLink] = useState<string | null>(null);
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

    const scaleStyles = windowWidth <= 768 ? {
        transform: 'scale(0.44) translateX(63%)',
        transformOrigin: 'top left'
    } : {};

    const rectangleStyles = windowWidth <= 768 ? {
        fontSize: '16px'
    } : {};

    const headerStyles = windowWidth <= 768 ? {
        fontSize: '18px'
    } : {};


    const handleChange = (event: FormEvent<HTMLInputElement>, index: number) => {
        const newValues = [...texts];
        const value = event.currentTarget.value.replace(/\n/g, ' ').slice(0, maxChars);
        newValues[index] = value;
        setTexts(newValues);
    };

    const handleRowNameChange = (event: FormEvent<HTMLInputElement>, index: number) => {
        const newRowNames = [...rowNames];
        const value = event.currentTarget.value.slice(0, maxLeftChars);
        newRowNames[index] = value;
        setRowNames(newRowNames);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    useEffect(() => {
        if (selectedRectangle !== null) {
            inputRefs.current[selectedRectangle]?.focus();
        }
    }, [selectedRectangle]);

    const handleSubmit = () => {
        const allInputs = [...texts, ...rowNames];
        if (allInputs.some(input => input === '')) {
            alert('Please fill all the boxes before submitting');
        } else {
            const gameData: { texts: string[], rowNames: string[], lives: number } = { texts, rowNames, lives };

            fetch('/api/game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(data => {
                    const link = `${window.location.origin}/game/${data.id}`;
                    setGameLink(link);
                })
                .catch(err => {
                    if (typeof err.text === 'function') {
                        err.text().then((errorMessage: any) => {
                            alert(JSON.parse(errorMessage).error);
                        });
                    } else {
                        console.log(err);
                    }
                });
        }
    };

    const closePopup = () => {
        setGameLink(null);
    };

    return (
        <div className={`container mx-auto h-screen flex flex-col ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <Header />
            <div className="flex items-start justify-center pt-12">
                <div className="p-6 grid justify-items-center"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '200px repeat(4, 1fr)',
                        rowGap: '0.75rem',
                        columnGap: '10px',
                        ...scaleStyles
                    }}
                >
                    <h2 className="col-span-1 text-center text-2xl font-bold" style={headerStyles}>Category</h2>
                    <h2 className="col-span-4 text-center text-2xl font-bold" style={headerStyles}>Items</h2>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <>
                            <div
                                className={`w-200 min-h-70 h-80 rounded-lg cursor-pointer relative flex items-center justify-center transition-border-color duration-50 ease-in-out ${rowIndex === selectedRectangle && isLeftSelected ? (isDarkMode ? 'border-2 border-white' : 'border-2 border-black') : ''}`}
                                onClick={() => {
                                    setSelectedRectangle(rowIndex);
                                    setIsLeftSelected(true);
                                }}
                                style={{
                                    backgroundColor: '#5A594E',
                                    fontFamily: 'LibreFranklin-Black',
                                    fontWeight: 900,
                                    lineHeight: '1.15',
                                    ...rectangleStyles
                                }}
                            >
                                <div
                                    className="w-full h-full absolute top-0 left-0 flex items-center justify-center z-10 text-white"
                                    style={{
                                        wordWrap: 'break-word',
                                        textAlign: 'center',
                                        pointerEvents: 'none',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-all'
                                    }}
                                >
                                    {rowNames[rowIndex]}
                                </div>
                                <input
                                    type="text"
                                    ref={(el) => inputRefs.current[rowIndex] = el}
                                    value={rowNames[rowIndex]}
                                    onInput={(event) => handleRowNameChange(event, rowIndex)}
                                    className="w-full h-full absolute top-0 left-0 opacity-0 z-20 text-white border-none outline-none rounded-lg focus:border-black focus:border-2 focus:outline-none"
                                    style={{ backgroundColor: 'transparent' }}
                                />
                            </div>
                            {Array.from({ length: cols }).map((_, colIndex) => {
                                const index = rowIndex * cols + colIndex;
                                return (
                                    <div
                                        className={`w-150 min-h-70 h-80 rounded-lg cursor-pointer relative flex items-center justify-center transition-border-color duration-50 ease-in-out ${(index + rows) === selectedRectangle && !isLeftSelected ? (isDarkMode ? 'border-2 border-white' : 'border-2 border-black') : ''}`}
                                        onClick={() => {
                                            setSelectedRectangle(index + rows);
                                            setIsLeftSelected(false);
                                        }}
                                        style={{
                                            backgroundColor: colors[Math.floor(index / cols)],
                                            fontFamily: 'LibreFranklin-Black',
                                            fontSize: '20px',
                                            fontWeight: 900,
                                            lineHeight: '1.15',
                                            overflow: 'hidden',
                                            padding: '0',
                                            ...rectangleStyles
                                        }}
                                    >
                                        <div
                                            className="w-full h-full absolute top-0 left-0 flex items-center justify-center z-10 text-black"
                                            style={{
                                                wordWrap: 'break-word',
                                                textAlign: 'center',
                                                pointerEvents: 'none',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-all'
                                            }}
                                        >
                                            {texts[index]}
                                        </div>
                                        <input
                                            type="text"
                                            ref={(el) => inputRefs.current[index + rows] = el}
                                            className="w-full h-full absolute top-0 left-0 opacity-0 z-20"
                                            maxLength={maxChars}
                                            value={texts[index]}
                                            onInput={(event) => handleChange(event, index)}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                )
                            })}
                        </>
                    ))}
                </div>
            </div>
            <BubbleCreator lives={lives} setLives={setLives} />
            <button
                className={`my-10 mx-auto rounded-lg py-3 px-10 shadow-lg text-xl tracking-wide font-semibold ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} transform transition-transform duration-500 ease-in-out hover:scale-105 active:scale-95 hover:shadow-xl`}
                onClick={handleSubmit}
            >
                Create
            </button>
            {gameLink && <CreatedPopup gameLink={gameLink} expiryHours={24} closePopup={closePopup} isDarkMode={isDarkMode} />}
        </div>
    );
};

export default CreateGamePage;
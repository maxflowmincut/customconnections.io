import { useState, useEffect } from 'react';
import { useTransition, animated, config, useSpring } from 'react-spring';
import '../fonts.css';

interface Rectangle {
    text: string;
    originalIndex: number;
    isSelectable: boolean;
}

interface CategoryCompletion {
    category: number;
    position: number;
}

interface GameGridProps {
    values: Rectangle[];
    onRectangleClick: (originalIndex: number) => void;
    selectedIndices: number[];
    submitClicked: boolean;
    completedCategories: CategoryCompletion[];
    rowNames: string[];
}

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

const GameGrid: React.FC<GameGridProps> = ({ values, onRectangleClick, selectedIndices, submitClicked, completedCategories, rowNames }) => {
    const { width } = useWindowSize();
    const rectangleWidth = width < 768 ? 90 : 150;
    const rectangleHeight = width < 768 ? 48 : 80;

    const completedFontSize = width < 768 ? 15 : 20;
    const completedSubtextFontSize = width < 768 ? 10 : 15;


    const margin = 4;
    const columns = 4;
    const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);
    const colors = {
        'game-yellow': 'bg-game-yellow',
        'game-green': 'bg-game-green',
        'game-blue': 'bg-game-blue',
        'game-purple': 'bg-game-purple',
    };

    useEffect(() => {
        setPositions(
            values.map((_, i) => ({
                x: (i % columns) * (rectangleWidth + margin),
                y: Math.floor(i / columns) * (rectangleHeight + margin),
            }))
        );
    }, [values, rectangleWidth, rectangleHeight, margin, columns]);

    const transitions = useTransition(values, {
        keys: (item) => item.originalIndex,
        from: { transform: 'translate(0px, 0px)', opacity: 1 },
        update: (item) => {
            const index = values.findIndex((rect) => rect.originalIndex === item.originalIndex);
            const opacity = completedCategories.find(cat => cat.category === Math.floor(item.originalIndex / 4)) ? 0 : 1;
            const scale = clickedIndex === index ? 'scale(0.95)' : 'scale(1)';
            return { transform: `translate(${positions[index].x}px, ${positions[index].y}px) ${scale}`, opacity };
        },
        config: { duration: 500, delay: 100 },
    });

    const completedTransitions = useTransition(completedCategories, {
        keys: (item) => item.category,
        from: { opacity: 0 },
        enter: { opacity: 1, delay: 300 },
        leave: { opacity: 0 },
        config: { duration: 500, delay: 600 },
    });

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setClickedIndex(null);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, []);


    return (
        <div className="relative" style={{ width: columns * (rectangleWidth + margin), height: Math.ceil(values.length / columns) * (rectangleHeight + margin) }}>
            {transitions(({ transform, opacity }, item, _, index) => (
                <animated.div
                    key={item.originalIndex}
                    onMouseDown={() => item.isSelectable && setClickedIndex(index)}
                    className={`absolute flex items-center justify-center ${item.isSelectable ? 'bg-gray-200 cursor-pointer text-black' : 'bg-gray-300 cursor-not-allowed text-white'} ${selectedIndices.includes(item.originalIndex) ? 'bg-gray-500 text-white' : ''} rounded text-lg font-custom`}
                    style={{
                        transform,
                        opacity,
                        width: rectangleWidth,
                        height: rectangleHeight,
                        fontSize: 20,
                        wordWrap: 'break-word',
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        padding: '4px',
                        lineHeight: '24px',
                        overflow: 'hidden',
                    }}
                    onClick={() => item.isSelectable && onRectangleClick(item.originalIndex)}
                >
                    {item.text}
                </animated.div>
            ))}
            {completedTransitions(({ opacity }, { category, position }) => {
                const colorClasses = Object.values(colors);
                const colorClass = colorClasses[category % colorClasses.length];

                const itemsInCategory = values
                    .filter(item => Math.floor(item.originalIndex / 4) === category)
                    .map(item => item.text);

                return (
                    <animated.div
                        key={category}
                        className={`absolute flex flex-col items-center justify-center ${colorClass} text-white select-none rounded text-xl font-custom`}
                        style={{
                            opacity,
                            width: columns * rectangleWidth + (columns - 1) * margin,
                            height: rectangleHeight,
                            transform: `translate(0px, ${position * (rectangleHeight + margin)}px)`,
                            fontSize: completedFontSize
                        }}
                    >
                        <div className="flex flex-col items-center justify-center space-y-1 h-full">
                            <div>{rowNames[category]}</div>
                            <div className="font-custom-2" style={{ fontSize: completedSubtextFontSize }}>{itemsInCategory.join(', ')}</div>
                        </div>
                    </animated.div>
                );
            })}
        </div>
    );
};

export default GameGrid;
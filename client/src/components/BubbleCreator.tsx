import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { FaHeart } from 'react-icons/fa';

type SetStateNumber = Dispatch<SetStateAction<number>>;

const BubbleCreator = ({ lives, setLives }: { lives: number, setLives: SetStateNumber }) => {
    const [shake, setShake] = useState(false);

    const increaseBubbles = () => {
        if (lives < 14) setLives(prevBubbles => prevBubbles + 1);
    }

    const decreaseBubbles = () => {
        if (lives > 1) setLives(prevBubbles => prevBubbles - 1);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center">
            <button onClick={decreaseBubbles} className="mx-2 bg-red-500 text-white text-lg font-bold rounded-full w-8 h-8">-</button>
            {Array.from({ length: lives }).map((_, i) => (
                <div key={i} className="mx-1 w-4 h-4 bg-[#5A594E] rounded-full flex items-center justify-center">
                    {/* <FaHeart className={`h-2 w-2 text-red-500 ${shake ? 'animate-fast-shake' : ''}`} /> */}
                </div>
            ))}
            <button onClick={increaseBubbles} className="mx-2 bg-green-500 text-white text-lg font-bold rounded-full w-8 h-8">+</button>
        </div>
    );
};


export default BubbleCreator;
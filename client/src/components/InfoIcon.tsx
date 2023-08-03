import { useState, useEffect } from 'react';
import { AiOutlineQuestionCircle, AiFillGithub, AiOutlineCoffee, AiOutlineArrowRight } from "react-icons/ai";
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../core/darkModeSlice';

const InfoIcon = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [visible, setVisible] = useState(false);
    const isDarkMode = useSelector(selectIsDarkMode);
    const [menuClasses, setMenuClasses] = useState(`absolute right-0 w-full md:w-96 py-2 mt-2 z-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'} rounded shadow-xl text-sm leading-6 transition-all duration-500 ease-in-out transform opacity-0 scale-95 font-poppins`);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (showMenu) {
            setVisible(true);
            timer = setTimeout(() => {
                setMenuClasses(`absolute right-0 w-full md:w-96 py-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'} rounded shadow-xl text-sm leading-6 transition-all duration-500 ease-in-out transform opacity-100 scale-100 font-poppins`);
            }, 10);
        } else {
            setMenuClasses(`absolute right-0 w-full md:w-96 py-2 mt-2 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'} rounded shadow-xl text-sm leading-6 transition-all duration-500 ease-in-out transform opacity-0 scale-95 font-poppins`);
            timer = setTimeout(() => {
                setVisible(false);
            }, 500);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isDarkMode, showMenu]);

    return (
        <div className="relative z-20">
            <AiOutlineQuestionCircle className={`h-10 w-10 cursor-pointer ${isDarkMode ? 'text-white' : 'text-black'} transition-colors duration-500`} onClick={() => setShowMenu(!showMenu)} />
            {visible && (
                <div className={menuClasses}>
                    <h2 className="px-4 py-2 text-lg font-bold text-indigo-600">How to play Connections</h2>
                    <div className="px-4 py-2">
                        <p className="mb-2"><b>Goal of the game:</b></p>
                        <ul className="pl-5 list-disc space-y-1">
                            <li>Select four items and tap 'Submit' to see if your guess is correct.</li>
                            <li>Find the groups without making 4 mistakes! Easy... right?</li>
                        </ul>
                    </div>
                    <hr className="border-gray-400 mx-4" />
                    <div className="px-4 py-2">
                        <p className="text-lg font-bold text-indigo-600 mb-2">Category Examples</p>
                        <ul className="pl-5 list-disc space-y-1">
                            <li>FISH: Bass, Flounder, Salmon, Trout</li>
                            <li>FIRE ___: Ant, Drill, Island, Opal</li>
                        </ul>
                        <p className="mt-2">Each puzzle has only one solution. Watch out for words that seem to belong to multiple categories!</p>
                    </div>
                    <hr className="border-gray-400 mx-4" />
                    <p className="px-4 py-2 text-sm">This game was heavily inspired by <a href="https://www.nytimes.com/games/connections" className={`underline ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} transition-colors duration-500`}>The New York Times's online Connections game</a>, which in turn is based on the British TV show quiz 'Only Connect'.</p>
                    <hr className="border-gray-400 mx-4" />
                    <p className="px-4 py-2">Got a problem or an idea? <a href="mailto:customconnectionsio@gmail.com" className={`underline ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} transition-colors duration-500`}><AiOutlineArrowRight className="inline w-4 h-4" /> Drop me an email</a>.</p>
                    <hr className="border-gray-400 mx-4" />
                    <a href="https://www.buymeacoffee.com/imaad" className={`flex items-center space-x-2 px-4 py-2 hover:bg-indigo-500 hover:text-white ${isDarkMode ? 'text-white' : 'text-black'} transition-colors duration-500`}><AiOutlineCoffee className="w-5 h-5" /><span>Enjoying the game? Buy me a coffee - sincerely a broke college student</span></a>
                    <a href="https://github.com/imaad-f/customconnections.io" className={`flex items-center space-x-2 px-4 py-2 hover:bg-indigo-500 hover:text-white ${isDarkMode ? 'text-white' : 'text-black'} transition-colors duration-500`}><AiFillGithub className="w-5 h-5" /><span>Check out and star the github repository</span></a>
                </div>
            )}
        </div>
    );
};

export default InfoIcon;

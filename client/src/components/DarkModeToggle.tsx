import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode, selectIsDarkMode } from '../core/darkModeSlice';

const DarkModeToggle = () => {
    const dispatch = useDispatch();
    const isDarkMode = useSelector(selectIsDarkMode);

    const handleClick = () => {
        dispatch(toggleDarkMode());
    };

    return (
        <div onClick={handleClick} className="w-14 h-8 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full p-1 cursor-pointer shadow-lg transition-all duration-300 ease-in-out">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full shadow-inner bg-white transform duration-300 ease-in-out ${isDarkMode ? 'translate-x-6 bg-black' : 'translate-x-0'}`}>
                <span className={`block text-lg leading-5 ${isDarkMode ? 'text-white' : 'text-black'}`}>{isDarkMode ? '🌚' : '🌞'}</span>
            </div>
        </div>
    );
};

export default DarkModeToggle;

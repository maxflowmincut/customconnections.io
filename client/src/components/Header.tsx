import DarkModeToggle from './DarkModeToggle';
import Title from './Title';
import InfoIcon from './InfoIcon';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../core/darkModeSlice';

const Header = () => {
    const isDarkMode = useSelector(selectIsDarkMode);

    return (
        <header className={`p-2 md:p-4 flex justify-between items-center border-b-2 border-gray-300 dark:border-gray-700 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <Title />
            <div className="flex items-center space-x-2 md:space-x-4">
                <InfoIcon />
                <DarkModeToggle />
            </div>
        </header>
    );
};
export default Header;
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../core/darkModeSlice';

const PlayGamePage = () => {
    const isDarkMode = useSelector(selectIsDarkMode);

    return (
        <div className={`container mx-auto h-screen flex flex-col ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <Header />
            Play Game
        </div>
    );
};

export default PlayGamePage;
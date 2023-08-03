import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../core/darkModeSlice';
import DarkModeToggle from '../components/DarkModeToggle';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const isDarkMode = useSelector(selectIsDarkMode);

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-500 ${isDarkMode ? 'text-white bg-black' : 'text-black bg-white'}`}>
            <h1 className="text-6xl">404: Page Not Found!</h1>
            <p className="mt-4 text-xl">Oops! It seems like you've wandered off into the unknown... 👾</p>
            <p className="mt-2 text-xl">Let's get you back on track.</p>
            <button
                onClick={() => navigate('/')}
                className={`px-6 py-3 mt-10 text-lg font-semibold transition-colors duration-200 transform rounded-lg hover:text-white focus:outline-none ${isDarkMode ? 'text-black bg-white hover:bg-yellow-500' : 'text-white bg-black hover:bg-yellow-500'}`}
            >
                Return to Base 🚀
            </button>
            <div className={`absolute top-0 right-0 p-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                <DarkModeToggle />
            </div>
        </div>
    );
}

export default NotFoundPage;
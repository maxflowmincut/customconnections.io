import Header from '../components/Header';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../core/darkModeSlice';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const isDarkMode = useSelector(selectIsDarkMode);
    const navigate = useNavigate();

    const gameModes = [
        {
            title: "Infinite Mode",
            description: "Infinite Mode boasts a never-ending stream of games. Perfect for honing your skills, and in future updates, earn unique cosmetics to showcase your mastery!",
            disabled: true,
            link: "/play/infinite",
        },
        {
            title: "Custom Mode",
            description: "Custom Mode offers a unique twist - build your own connections game from scratch! Choose your preferred themes, craft challenging puzzles, and share the fun with friends.",
            disabled: false,
            link: "/create/game",
        },
        {
            title: "Versus Mode",
            description: "Does your friend always say connections is too easy? Challenge them to see who is truly better, with real time head-to-head matches against a friend or a stranger! Includes leaderboards, trackable stats, and unique cosmetics.",
            disabled: true,
            link: "/play/versus",
        },
    ];

    const handleClick = (link: string, disabled: boolean) => {
        if (!disabled) {
            navigate(link);
        }
    }

    return (
        <div className={`container mx-auto h-screen flex flex-col ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <Header />
            <div className="flex flex-col items-center justify-center pt-20">
                <div className="flex flex-1 justify-center items-start flex-wrap">
                    {gameModes.map((mode, index) => (
                        <div key={index}
                            className={`m-4 p-8 rounded-lg overflow-hidden shadow-2xl flex flex-col ${!mode.disabled && 'transition-all duration-500 ease-in-out transform hover:scale-105'} md:max-w-md lg:max-w-lg w-full md:w-auto`}
                            style={{
                                opacity: mode.disabled ? 0.5 : 1,
                                minHeight: '450px',
                                maxWidth: '350px',
                                backgroundImage: isDarkMode ? 'linear-gradient(315deg, #2a2a72 0%, #009ffd 74%)' : 'linear-gradient(315deg, #d8d8d8 0%, #fafafa 74%)',
                            }}>
                            <h2 className="text-2xl font-bold mb-2 text-3d text-shadow">{mode.title}</h2>
                            <hr className={`border ${isDarkMode ? 'border-white' : 'border-black'} mb-4`} />
                            <p className="flex-grow text-3d text-shadow">{mode.description}</p>
                            <p
                                className={`${mode.disabled ? '' : 'cursor-pointer'} mt-4 ${isDarkMode ? 'bg-blue-500' : 'bg-gray-800'} px-4 py-2 rounded text-white ${!mode.disabled && 'hover:bg-blue-700 transition-all duration-500 ease-in-out transform hover:scale-105'}`}
                                onClick={() => handleClick(mode.link, mode.disabled)}
                            >
                                {mode.disabled ? "In Development" : "Play"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

};

export default HomePage;
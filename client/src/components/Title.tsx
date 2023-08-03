import { Link } from 'react-router-dom';

const Title = () => {
    return (
        <Link to="/" className="text-4xl sm:text-5xl lg:text-6xl font-black">
            <span className="text-5xl sm:text-6xl lg:text-7xl">C</span>ustom
            <span className="text-5xl sm:text-6xl lg:text-7xl">C</span>onnections
            <span className="text-5xl sm:text-6xl lg:text-7xl">.</span>io
        </Link>
    );
};

export default Title;
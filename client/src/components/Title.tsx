import { Link } from 'react-router-dom';

const Title = () => {
    return (
        <Link to="/" className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black">
            <span className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl">C</span>ustom
            <span className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl">C</span>onnections
            <span className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl">.</span>io
        </Link>
    );
};


export default Title;
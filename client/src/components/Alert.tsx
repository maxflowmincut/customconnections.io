import { useEffect, useState } from 'react';
import { a, useSpring } from 'react-spring';

interface AlertProps {
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
    headerHeight: number;
}

const Alert: React.FC<AlertProps> = ({ text, setText, headerHeight }) => {
    const [show, setShow] = useState(false);

    const alertAnimation = useSpring({
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0px)" : "translateY(-100px)",
    });

    useEffect(() => {
        if (text !== "") {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [text]);

    useEffect(() => {
        if (!show) {
            setText("");
        }
    }, [show, setText]);

    return (
        <a.div
            style={{ ...alertAnimation, top: `${headerHeight + 8}px` }}
            className={`custom-alert self-center w-3/4 max-w-xl bg-red-500 text-white text-center py-2 rounded mt-2 fixed`}
        >
            {text}
        </a.div>
    );
}

export default Alert;
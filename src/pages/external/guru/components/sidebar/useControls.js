import { useEffect, useState } from "react";

export default (topicChain) => {
    const [ width, setWidth ] = useState(1/5);

    const handleIncreaseWidth = () => {
        setWidth(width + 1/5);
    }

    const handleDecreaseWidth = () => {
        setWidth(width - 1/5);
    }

    const toggleFullScreen = () => {
        setWidth(width === 1/5 ? 1 : 1/5);
    }

    useEffect(() => {
        if (topicChain?.length) setWidth(1/5 * (topicChain.length + 1))
    }, [topicChain])

    return {
        width,
        handleIncreaseWidth,
        handleDecreaseWidth,
        toggleFullScreen
    }
}
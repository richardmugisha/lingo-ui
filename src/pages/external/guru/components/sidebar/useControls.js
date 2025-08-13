import { useEffect, useState } from "react";

export default (topicChain) => {
    const [ width, setWidth ] = useState("210px");
    // const [ width, setWidth ] = useState(1/5);

    const handleIncreaseWidth = () => {
        setWidth(width + 1/5);
    }

    const handleDecreaseWidth = () => {
        setWidth("210px");
    }
    // const handleDecreaseWidth = () => {
    //     setWidth(width - 1/5);
    // }

    const toggleFullScreen = () => {
        setWidth(width == "210px" ? "fit-content": "210px");
    }
    // const toggleFullScreen = () => {
    //     setWidth(width === 1/5 ? 1 : 1/5);
    // }

    useEffect(() => {
        // if (topicChain?.length) setWidth(1/5 * (topicChain.length + 1))
        setWidth("fit-content")
    }, [topicChain?.length])

    return {
        width,
        handleIncreaseWidth,
        handleDecreaseWidth,
        toggleFullScreen
    }
}
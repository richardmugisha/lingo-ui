
import { useState, useEffect } from "react"

const Counter = ({ status, setStatus }) => {
    const [counter, setCounter] = useState(3)

    useEffect(() => {
        if (status !== "countdown") return
        const intervalId = setInterval(() => {
            setCounter(counter - 1)
            if (counter - 1 === 0) {
              clearInterval(intervalId);
              setStatus("playing")
            }
        }, 1000);

        return () => clearInterval(intervalId)

    }, [counter, status])

  return <div>{counter}</div>

}

export default Counter

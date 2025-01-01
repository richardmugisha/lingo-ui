import Button from "../playing/components/game-button/Button"
import "./Catalog.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const catalog = [
    {
        title: "Story Time",
        image: "https://images-na.ssl-images-amazon.com/images/I/71eF8g1WdYL.jpg",
        description: "Collaborate with friends on a story",
        type: "story"
    },
    {
        title: "Vocabulary quiz",
        image: "https://images-na.ssl-images-amazon.com/images/I/71eF8g1WdYL.jpg",
        description: "Compete with friends on vocabulary mastery",
        type: "quiz"
    },
]


const Catalog = () => {
    const navigate = useNavigate()
    // const [searchParams] = useSearchParams()
    const handleChooseGame = (typeOfGame) => {
        navigate(`../playing/?isCreator=true&&typeOfGame=${typeOfGame}`)
    }

  return (
    <div className="catalog">
      {
        catalog.map((game, i) => (
            <div key={i} className="game">
                <h3>{game.title}</h3>
                <img src={game.image} alt={game.title} />
                <p>
                    <p>{game.description}</p>
                    <Button text="Play" handleClick={() => handleChooseGame(game.type)}/>
                </p>
            </div>
            ))
      }
    </div>
  )
}

export default Catalog


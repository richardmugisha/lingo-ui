import "./Chat.css";
import ChatView from './components/chat-view/ChatView';
import PairCatalg from "./components/assistant-catalog/pair-catalog/Catalog";
import SingleCatalog from "./components/assistant-catalog/single-catalog/Catalog";
import AddNewAgent from "./components/assistant-catalog/add-new-agent/Add";
import { useState } from "react";

const Chat = () => {
  const [pair, setPair] = useState(null)
  const [page, setPage] = useState(!pair && "pair-catalog")

  return (
    pair ? <ChatView pair={pair}/> :
    page === "pair-catalog" ? <PairCatalg setPage={setPage} setPair={setPair}/> :
    page === "single-catalog" ? <SingleCatalog setPage={setPage}/> :
    page === "add-new" ? <AddNewAgent setPage={setPage}/>:
    <></>
  )
};

export default Chat;
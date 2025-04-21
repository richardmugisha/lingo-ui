
import Home from "./Home";
import OptionModal from "./modals/OptionModal";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Personal = () => 

    <Routes>
      <Route path='/' element={<Home page=""/>} />
      <Route path='/topics' element={<Home page="topics"/>} />
      <Route path='/words' element={<Home page="words"/>} />
      <Route path='/learning' element={<Home page="learning"/>} />
      <Route path='/my-learning' element={<Home page="my-learning"/>} />
      <Route path='/stories' element={<Home page="stories"/>} />
      <Route path='/chats' element={<Home page="chats"/>} />
      <Route path='/fyp' element={<Home page="fyp"/>} />
      <Route path='*' element={<OptionModal />} />
    </Routes>


export default Personal;


import Home from "./Home";
import Modal from "./modals/Modal"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Personal = () => {
  return  <Routes>
            <Route path='' element={<Home />} />
            <Route path='*' element={<Modal />} />
          </Routes>
}

export default Personal;

  
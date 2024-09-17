import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, userAuthed }) => {
  console.log(userAuthed)
  return userAuthed ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;

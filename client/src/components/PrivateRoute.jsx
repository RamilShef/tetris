import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>;
  return user ? children : <Navigate to="/auth?mode=login" />;
};

export default PrivateRoute;
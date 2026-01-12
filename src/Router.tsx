
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Blogs } from './pages/Blogs';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />

        <Route path='/login' element={<Login />} />

        <Route path='/blogs' element={<Blogs />} />

      </Routes>
    </div>
  );
}

export default App;
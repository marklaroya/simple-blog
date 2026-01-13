import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Blogs } from './pages/Blogs';
import { EditBlog } from './pages/Editblog';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/edit/:id" element={<EditBlog />} />
      </Routes>
    </div>
  );
}

export default App;
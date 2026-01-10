import './App.css';
import 'flowbite';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(()=> import('./pages/Home'));
const Reserva = lazy(()=> import('./pages/Reserva'));

function App() {
  const session = JSON.parse(localStorage.getItem("datos"));
  const permisos = JSON.parse(localStorage.getItem("permisos"));
  
  return (
    <Router basename="/administrador">
        <Routes>
          <Route exact path="/" element={<Suspense><Home/></Suspense>} />
          <Route path="/reserva" element={<Suspense><Home/></Suspense>} />
          <Route path="/imprimir-reserva" element={<Suspense><Reserva/></Suspense>} />
          <Route path="/reserva/:id" element={<Suspense><Home/></Suspense>} />
        </Routes>
      </Router>
  );
}

export default App;

import './App.css';
import 'flowbite';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';


const Home = lazy(() => import('./pages/Home'));
const Reserva = lazy(() => import('./pages/Reserva'));

function App() {
  const session = JSON.parse(localStorage.getItem("datos"));
  const permisos = JSON.parse(localStorage.getItem("permisos"));

  if (!session || !permisos) {
    if (window.location.hostname !== "localhost") {
      window.open("https://visitaecuador.com", "_self");
    }
  }

  return (
    <Router
      basename="/administrador"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Suspense fallback={<div className="flex flex-col items-center justify-center min-h-screen"><div className="w-12 h-12 border-4 border-greenVE-100 border-t-greenVE-500 rounded-full animate-spin mb-4"></div><p className="text-gray-500 animate-pulse font-medium">Cargando...</p></div>}>

        <Routes>
          {/* Una sola entrada a Home */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/audiovisuales" element={<Home />} />
          <Route path="/suscriptores" element={<Home />} />
          <Route path="/smart" element={<Home />} />
          <Route path="/call-center" element={<Home />} />
          <Route path="/reserva" element={<Home />} />
          <Route path="/reserva/:id" element={<Home />} />

          <Route path="/imprimir-reserva" element={<Reserva />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

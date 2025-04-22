import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout'; 
 
import DashboardPage from './pages/dashboard/pages/DashboardPage';
import ChamadosPage from './pages/chamados/pages/ChamadosPage';
import SituacoesPage from './pages/situacoes/pages/SituacoesPage';
import CategoriasPage from './pages/categorias/pages/CategoriasPage';
import ChamadosFormPage from './pages/chamados/pages/ChamadosFormPage';
import SituacoesFormPage from './pages/situacoes/pages/SituacoesFormPage';
import CategoriasFormPage from './pages/categorias/pages/CategoriasFormPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* // Dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* // Chamados */}
          <Route path="chamados" element={<ChamadosPage />} />
          <Route path="chamados/:id" element={<ChamadosFormPage />} />
          <Route path="chamados/new" element={<ChamadosFormPage />} />

          {/* // Situações */}
          <Route path="situacoes" element={<SituacoesPage />} />
          <Route path="situacoes/:id" element={<SituacoesFormPage />} />
          <Route path="situacoes/new" element={<SituacoesFormPage />} />

          {/* // Categorias */}
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="categorias/:id" element={<CategoriasFormPage />} />
          <Route path="categorias/new" element={<CategoriasFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

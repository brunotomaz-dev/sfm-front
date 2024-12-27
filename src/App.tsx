import { Route, Routes } from 'react-router-dom';
import './App.css';

import PrivateRoute from './api/PrivateRoute';
import Sidebar from './components/sidebar';
import { groupLevels } from './helpers/constants';
import HomeFake from './pages/example';
import HistoricLines from './pages/histLines';
import Home from './pages/home';
import LiveLines from './pages/liveLines';
import LoginPage from './pages/login';
import Management from './pages/management';
import ProductionLive from './pages/productionLive';
import ShopFloor from './pages/sfm';

function App() {
  return (
    <>
      <main className="d-flex w-100">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="sfm" element={<PrivateRoute element={<ShopFloor />} allowedGroups={[...groupLevels[5]]} />} />
          <Route
            path="p-live"
            element={<PrivateRoute element={<ProductionLive />} allowedGroups={[...groupLevels[4]]} />}
          />
          <Route path="live" element={<PrivateRoute element={<LiveLines />} allowedGroups={[...groupLevels[5]]} />} />
          <Route
            path="h-lines"
            element={<PrivateRoute element={<HistoricLines />} allowedGroups={[...groupLevels[4]]} />}
          />
          <Route
            path="management"
            element={<PrivateRoute element={<Management />} allowedGroups={[...groupLevels[4]]} />}
          />
          <Route path="init" element={<HomeFake />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

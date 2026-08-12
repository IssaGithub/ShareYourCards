import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Customers } from './pages/Customers';
import { Orders } from './pages/Orders';
import { Repairs } from './pages/Repairs';
import { Appointments } from './pages/Appointments';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="repairs" element={<Repairs />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;

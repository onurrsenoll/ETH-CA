import { Outlet } from 'react-router-dom';
import { VLProvider } from './ValueLossContext';
import ValueLossSidebar from './ValueLossSidebar';
import './ValueLoss.css';

export default function ValueLossLayout() {
  return (
    <VLProvider>
      <div className="vl-layout">
        <ValueLossSidebar />
        <main className="vl-main">
          <Outlet />
        </main>
      </div>
    </VLProvider>
  );
}

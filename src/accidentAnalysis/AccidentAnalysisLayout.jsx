import { Outlet } from 'react-router-dom';
import { AAProvider } from './AccidentAnalysisContext';
import AccidentAnalysisSidebar from './AccidentAnalysisSidebar';

export default function AccidentAnalysisLayout() {
  return (
    <AAProvider>
      <div className="aa-layout">
        <AccidentAnalysisSidebar />
        <main className="aa-main">
          <Outlet />
        </main>
      </div>
    </AAProvider>
  );
}

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, CheckSquare, Square } from 'lucide-react';
import { generatePDFReport } from '../utils/pdfExport';

export default function Reports() {
  const { branches, productions, targets, settings } = useApp();
  const [selectedBranchIds, setSelectedBranchIds] = useState(['all']);

  function toggleBranch(branchId) {
    if (branchId === 'all') {
      setSelectedBranchIds(['all']);
      return;
    }

    setSelectedBranchIds(prev => {
      const filtered = prev.filter(id => id !== 'all');
      if (filtered.includes(branchId)) {
        const result = filtered.filter(id => id !== branchId);
        return result.length === 0 ? ['all'] : result;
      }
      return [...filtered, branchId];
    });
  }

  function selectAll() {
    setSelectedBranchIds(['all']);
  }

  function handleGenerateReport() {
    generatePDFReport({
      productions,
      branches,
      selectedBranchIds,
      targets,
      stepLevel: settings.currentStep,
      companyName: settings.companyName,
    });
  }

  const isAllSelected = selectedBranchIds.includes('all');

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Raporlar</h2>
          <p className="page-subtitle">Şube bazlı PDF raporları oluşturun ve indirin</p>
        </div>
      </div>

      <div className="form-card" style={{ maxWidth: 600 }}>
        <h3 className="form-card-title">
          <FileText size={20} />
          Rapor Oluştur
        </h3>

        <p className="form-description">
          Rapor oluşturmak istediğiniz şubeleri seçin. Birden fazla şube seçebilirsiniz.
          Her şube için ayrı sayfa oluşturulacaktır.
        </p>

        <div className="branch-select-list">
          <div
            className={`branch-select-item ${isAllSelected ? 'selected' : ''}`}
            onClick={selectAll}
          >
            {isAllSelected ? <CheckSquare size={18} /> : <Square size={18} />}
            <span>Tüm Şubeler (Genel Rapor)</span>
          </div>

          {branches.map(branch => {
            const isSelected = !isAllSelected && selectedBranchIds.includes(branch.id);
            return (
              <div
                key={branch.id}
                className={`branch-select-item ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleBranch(branch.id)}
              >
                {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                <span>
                  {branch.name}
                  {branch.isMain && <span className="badge badge-primary" style={{ marginLeft: 8 }}>Merkez</span>}
                </span>
              </div>
            );
          })}
        </div>

        <div className="report-info">
          <p>
            <strong>Rapor İçeriği:</strong>
          </p>
          <ul>
            <li>Seçili şubelerin özet metrikleri</li>
            <li>Branş bazlı prim ve poliçe adetleri</li>
            <li>Hedef karşılaştırma tablosu</li>
            <li>Önceki dönem değişim oranları</li>
            <li>Basamak: {settings.currentStep} ({settings.currentYear})</li>
          </ul>
        </div>

        <button className="btn btn-primary btn-full" onClick={handleGenerateReport}>
          <Download size={18} />
          PDF Rapor İndir
        </button>
      </div>
    </div>
  );
}

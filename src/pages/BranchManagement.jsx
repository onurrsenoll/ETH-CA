import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, PlusCircle, Pencil, Trash2, Check, X, Crown } from 'lucide-react';

export default function BranchManagement() {
  const { branches, addBranch, updateBranch, removeBranch, productions } = useApp();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    addBranch(newName.trim());
    setNewName('');
  }

  function startEdit(branch) {
    setEditingId(branch.id);
    setEditName(branch.name);
  }

  function saveEdit() {
    if (editName.trim()) {
      updateBranch(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName('');
  }

  function getBranchProductionCount(branchId) {
    return productions.filter(p => p.branchId === branchId).length;
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Şube Yönetimi</h2>
          <p className="page-subtitle">Şubelerinizi ekleyin ve yönetin</p>
        </div>
      </div>

      <div className="form-card" style={{ maxWidth: 600, marginBottom: '1.5rem' }}>
        <h3 className="form-card-title">Yeni Şube Ekle</h3>
        <form onSubmit={handleAdd} className="form-row" style={{ gap: '0.75rem' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Şube adı..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <PlusCircle size={18} />
            Ekle
          </button>
        </form>
      </div>

      <div className="branch-list">
        {branches.map(branch => (
          <div key={branch.id} className="branch-card">
            <div className="branch-card-left">
              <div className="branch-icon-wrapper">
                {branch.isMain ? <Crown size={20} /> : <Building2 size={20} />}
              </div>
              {editingId === branch.id ? (
                <div className="branch-edit-row">
                  <input
                    type="text"
                    className="form-input"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <button className="btn-icon btn-success-icon" onClick={saveEdit}><Check size={16} /></button>
                  <button className="btn-icon" onClick={cancelEdit}><X size={16} /></button>
                </div>
              ) : (
                <div>
                  <p className="branch-name">
                    {branch.name}
                    {branch.isMain && <span className="badge badge-primary">Merkez</span>}
                  </p>
                  <p className="branch-stat">{getBranchProductionCount(branch.id)} üretim kaydı</p>
                </div>
              )}
            </div>
            {editingId !== branch.id && (
              <div className="branch-card-actions">
                <button className="btn-icon" onClick={() => startEdit(branch)} title="Düzenle">
                  <Pencil size={16} />
                </button>
                {!branch.isMain && (
                  <button
                    className="btn-icon btn-danger-icon"
                    onClick={() => {
                      if (confirm(`"${branch.name}" şubesini ve tüm üretim kayıtlarını silmek istediğinize emin misiniz?`)) {
                        removeBranch(branch.id);
                      }
                    }}
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

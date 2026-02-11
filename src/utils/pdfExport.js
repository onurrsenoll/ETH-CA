import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { INSURANCE_TYPES, formatCurrency, formatNumber, formatPercent } from './constants';
import { calculateBranchSummary, calculateTotals } from './calculations';

export function generatePDFReport({
  productions,
  branches,
  selectedBranchIds,
  targets,
  stepLevel,
  companyName,
}) {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const currentYear = new Date().getFullYear();
  const dateStr = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const branchesToReport = selectedBranchIds.includes('all')
    ? [{ id: 'all', name: 'Tum Subeler (Genel)' }, ...branches]
    : branches.filter(b => selectedBranchIds.includes(b.id));

  branchesToReport.forEach((branch, index) => {
    if (index > 0) doc.addPage();

    const summary = calculateBranchSummary(productions, branch.id, targets, stepLevel);
    const totals = calculateTotals(summary);

    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138);
    doc.text(companyName || 'Acente', 14, 15);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Uretim Raporu - ${branch.name}`, 14, 23);

    doc.setFontSize(9);
    doc.text(`Tarih: ${dateStr} | Yil: ${currentYear} | Basamak: ${stepLevel}`, 14, 30);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const summaryData = [
      ['Toplam Prim', formatCurrency(totals.totalCurrentPremium)],
      ['Onceki Donem', formatCurrency(totals.totalPrevPremium)],
      ['Hedef Prim', formatCurrency(totals.totalTargetPremium)],
      ['Gerceklesme', formatPercent(totals.overallAchievementRate)],
      ['Degisim', formatPercent(totals.overallChangeRate)],
      ['Trafik Orani', formatPercent(totals.trafikRate)],
    ];

    doc.autoTable({
      startY: 35,
      head: [['Metrik', 'Deger']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      tableWidth: 80,
      margin: { left: 14 },
    });

    const tableData = INSURANCE_TYPES.map(type => {
      const s = summary[type.key];
      return [
        type.label,
        formatCurrency(s.currentPremium),
        formatNumber(s.currentPolicyCount),
        formatCurrency(s.prevPremium),
        formatPercent(s.premiumChangeRate),
        formatCurrency(s.targetPremium),
        formatNumber(s.targetPolicyCount),
        formatPercent(s.premiumAchievementRate),
      ];
    });

    const totalRow = [
      'TOPLAM',
      formatCurrency(totals.totalCurrentPremium),
      formatNumber(totals.totalCurrentPolicyCount),
      formatCurrency(totals.totalPrevPremium),
      formatPercent(totals.overallChangeRate),
      formatCurrency(totals.totalTargetPremium),
      formatNumber(totals.totalTargetPolicyCount),
      formatPercent(totals.overallAchievementRate),
    ];
    tableData.push(totalRow);

    doc.autoTable({
      startY: 35,
      head: [[
        'Brans',
        'Cari Prim',
        'Police Adet',
        'Onceki Donem',
        'Degisim %',
        'Hedef Prim',
        'Hedef Adet',
        'Gerceklesme %',
      ]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 110 },
      tableWidth: pageWidth - 124,
      didParseCell: function(data) {
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [240, 240, 250];
        }
      },
    });

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Sayfa ${index + 1} / ${branchesToReport.length} - Acente Uretim Takip Sistemi`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 5,
      { align: 'center' }
    );
  });

  doc.save(`uretim-raporu-${new Date().toISOString().split('T')[0]}.pdf`);
}

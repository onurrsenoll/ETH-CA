import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { VIOLATION_ITEMS } from './faultCalculation';

export function generateAccidentPDF(analysis) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 15;

  const { result, accidentInfo, vehicleA, vehicleB, witness, impactAnalysis } = analysis;

  // Başlık
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('TRAFIK KAZA TESPIT TUTANAGI', pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.text('KUSUR ANALIZ RAPORU', pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Dosya No: ${analysis.caseNumber}`, margin, y);
  doc.text(`Tarih: ${new Date(analysis.createdAt).toLocaleDateString('tr-TR')}`, pageWidth - margin, y, { align: 'right' });
  y += 8;

  // Çizgi
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Kaza Bilgileri
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('1. KAZA BILGILERI', margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');

  const accidentData = [
    ['Kaza Tarihi', accidentInfo.date ? new Date(accidentInfo.date).toLocaleDateString('tr-TR') : '-'],
    ['Saat', accidentInfo.time || '-'],
    ['Il / Ilce', [accidentInfo.city, accidentInfo.district].filter(Boolean).join(' / ') || '-'],
    ['Mahalle', accidentInfo.neighborhood || '-'],
    ['Cadde / Sokak', accidentInfo.street || '-'],
  ];

  if (accidentInfo.description) {
    accidentData.push(['Kaza Yeri Tarifi', accidentInfo.description]);
  }

  doc.autoTable({
    startY: y,
    head: [],
    body: accidentData,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: pageWidth - margin * 2 - 40 },
    },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 8;

  // Görgü Tanığı
  if (witness && witness.name) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('2. GORGU TANIGI', margin, y);
    y += 6;

    doc.autoTable({
      startY: y,
      head: [],
      body: [
        ['Adi Soyadi', witness.name],
        ['Telefon', witness.phone || '-'],
        ['Adres', witness.address || '-'],
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
      margin: { left: margin, right: margin },
    });

    y = doc.lastAutoTable.finalY + 8;
  }

  // Araç Bilgileri yan yana
  const sectionNum = witness && witness.name ? 3 : 2;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`${sectionNum}. ARAC VE SURUCU BILGILERI`, margin, y);
  y += 6;

  const vehicleColWidth = (pageWidth - margin * 2 - 4) / 2;

  // Araç A tablosu
  const vehicleAData = buildVehicleData(vehicleA, 'A');
  doc.autoTable({
    startY: y,
    head: [['ARAC A', '']],
    body: vehicleAData,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 1.5 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 35 } },
    margin: { left: margin, right: pageWidth - margin - vehicleColWidth },
  });

  const yAfterA = doc.lastAutoTable.finalY;

  // Araç B tablosu
  doc.autoTable({
    startY: y,
    head: [['ARAC B', '']],
    body: buildVehicleData(vehicleB, 'B'),
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 1.5 },
    headStyles: { fillColor: [139, 92, 246], textColor: 255, fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 35 } },
    margin: { left: pageWidth / 2 + 2, right: margin },
  });

  y = Math.max(yAfterA, doc.lastAutoTable.finalY) + 8;

  // Sayfa kontrolü
  if (y > 250) {
    doc.addPage();
    y = 15;
  }

  // İhlaller
  const violSectionNum = sectionNum + 1;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`${violSectionNum}. TESPIT EDILEN IHLALLER`, margin, y);
  y += 6;

  const violationsAList = (vehicleA.violations || []).map(vid => VIOLATION_ITEMS.find(v => v.id === vid)).filter(Boolean);
  const violationsBList = (vehicleB.violations || []).map(vid => VIOLATION_ITEMS.find(v => v.id === vid)).filter(Boolean);

  const maxRows = Math.max(violationsAList.length, violationsBList.length, 1);
  const violBody = [];
  for (let i = 0; i < maxRows; i++) {
    violBody.push([
      violationsAList[i] ? `- ${violationsAList[i].text}` : '',
      violationsBList[i] ? `- ${violationsBList[i].text}` : '',
    ]);
  }

  if (violationsAList.length === 0 && violationsBList.length === 0) {
    violBody[0] = ['Ihlal tespit edilmemistir', 'Ihlal tespit edilmemistir'];
  }

  doc.autoTable({
    startY: y,
    head: [['Arac A Ihlalleri', 'Arac B Ihlalleri']],
    body: violBody,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [239, 68, 68], textColor: 255 },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 8;

  if (y > 250) {
    doc.addPage();
    y = 15;
  }

  // Beyanlar
  const stmtSectionNum = violSectionNum + 1;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`${stmtSectionNum}. SURUCU BEYANLARI`, margin, y);
  y += 6;

  doc.autoTable({
    startY: y,
    head: [['Arac A Surucusu Beyani', 'Arac B Surucusu Beyani']],
    body: [[
      vehicleA.statement || 'Beyan girilmemistir.',
      vehicleB.statement || 'Beyan girilmemistir.',
    ]],
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [107, 114, 128], textColor: 255 },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 8;

  // Darbe Noktası Analizi
  if (impactAnalysis && impactAnalysis.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 15;
    }
    const impSectionNum = stmtSectionNum + 1;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`${impSectionNum}. DARBE NOKTASI ANALIZI`, margin, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    impactAnalysis.forEach(line => {
      doc.text(line, margin, y);
      y += 5;
    });
    y += 4;
  }

  // Yeni sayfa - SONUÇ
  doc.addPage();
  y = 15;

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('KUSUR DEGERLENDIRMESI VE SONUC', pageWidth / 2, y, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  y += 10;

  // Kusur oranları büyük kutu
  const boxWidth = (pageWidth - margin * 2 - 20) / 2;

  // Araç A kutusu
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, boxWidth, 30, 3, 3, 'S');
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('ARAC A', margin + boxWidth / 2, y + 8, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(vehicleA.driverName || '-', margin + boxWidth / 2, y + 14, { align: 'center' });
  const faultAColor = result.finalFault.faultA >= 50 ? [220, 38, 38] : [16, 185, 129];
  doc.setTextColor(...faultAColor);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text(`%${result.finalFault.faultA}`, margin + boxWidth / 2, y + 25, { align: 'center' });

  // Araç B kutusu
  doc.setDrawColor(139, 92, 246);
  doc.roundedRect(pageWidth - margin - boxWidth, y, boxWidth, 30, 3, 3, 'S');
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(139, 92, 246);
  doc.text('ARAC B', pageWidth - margin - boxWidth / 2, y + 8, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(vehicleB.driverName || '-', pageWidth - margin - boxWidth / 2, y + 14, { align: 'center' });
  const faultBColor = result.finalFault.faultB >= 50 ? [220, 38, 38] : [16, 185, 129];
  doc.setTextColor(...faultBColor);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text(`%${result.finalFault.faultB}`, pageWidth - margin - boxWidth / 2, y + 25, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  y += 40;

  // Gerekçeli Değerlendirme
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('GEREKCELI DEGERLENDIRME', margin, y);
  y += 7;

  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');

  result.reasoning.forEach(line => {
    if (line === '') {
      y += 3;
      return;
    }

    if (y > 270) {
      doc.addPage();
      y = 15;
    }

    if (line.startsWith('Sonuc:') || line.startsWith('Ozel Durum')) {
      doc.setFont(undefined, 'bold');
    } else {
      doc.setFont(undefined, 'normal');
    }

    // Uzun satırları sar
    const lines = doc.splitTextToSize(line, pageWidth - margin * 2);
    lines.forEach(l => {
      doc.text(l, margin, y);
      y += 4.5;
    });
  });

  y += 5;

  // Özel Durumlar
  if (result.specialCases.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 15;
    }

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('OZEL DURUM TESPITLERI', margin, y);
    doc.setTextColor(0, 0, 0);
    y += 6;

    doc.setFontSize(9);
    result.specialCases.forEach(sc => {
      doc.setFont(undefined, 'bold');
      const typeLabel = sc.type === 'rear_end_collision' ? 'Arkadan Carpma' :
        sc.type === 'red_light' ? 'Kirmizi Isik Ihlali' :
        sc.type === 'parked_vehicle_hit' ? 'Park Halindeki Araca Carpma' :
        sc.type === 'wrong_way' ? 'Karsi Yonden Gelme' : sc.type;
      doc.text(`Arac ${sc.vehicle} - ${typeLabel}:`, margin, y);
      y += 5;
      doc.setFont(undefined, 'normal');
      const descLines = doc.splitTextToSize(sc.description, pageWidth - margin * 2);
      descLines.forEach(l => {
        doc.text(l, margin, y);
        y += 4.5;
      });
      y += 3;
    });
  }

  // Yasal Dayanak
  y += 5;
  if (y > 260) {
    doc.addPage();
    y = 15;
  }

  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('YASAL DAYANAK', margin, y);
  y += 6;
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  const legalText = [
    '- 2918 Sayili Karayollari Trafik Kanunu',
    '- Karayollari Trafik Yonetmeligi',
    '- Trafik Sigortlari Bilgi Merkezi (TRAMER) kusur oranlarina yonelik duzenlemeler',
    '- Yargitay Ictihat Kararlari',
  ];
  legalText.forEach(line => {
    doc.text(line, margin, y);
    y += 4.5;
  });

  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Bu rapor, kaza tespit tutanagindaki verilere dayanilarak olusturulmustur.', margin, y);
  y += 4;
  doc.text('Nihai kusur degerlendirmesi yetkili mahkeme veya sigorta tahkim komisyonu tarafindan yapilir.', margin, y);

  // Altbilgi her sayfada
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Sayfa ${i} / ${pageCount} | Dosya: ${analysis.caseNumber} | Olusturma: ${new Date(analysis.createdAt).toLocaleDateString('tr-TR')}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    );
  }

  doc.save(`Kaza_Analiz_Raporu_${analysis.caseNumber}.pdf`);
}

function buildVehicleData(vehicle, label) {
  return [
    ['Surucu', vehicle.driverName || '-'],
    ['T.C. Kimlik', vehicle.tcNo || '-'],
    ['Belge No', vehicle.licenseNo || '-'],
    ['Telefon', vehicle.phone || '-'],
    ['Marka/Model', vehicle.brand || '-'],
    ['Plaka', vehicle.plate || '-'],
    ['Sasi No', vehicle.chassisNo || '-'],
    ['Kullanim', vehicle.usage || '-'],
    ['Sigorta', vehicle.insuranceCompany || '-'],
    ['Sigortali', vehicle.insuranceHolder || '-'],
    ['Police No', vehicle.policyNo || '-'],
  ];
}

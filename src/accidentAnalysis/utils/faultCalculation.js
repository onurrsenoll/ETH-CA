// Türkiye Karayolları Trafik Yönetmeliği kapsamında kusur hesaplama motoru
// SBM Maddi Hasarlı Kaza Durum Senaryoları entegrasyonu

import { matchScenario, SBM_SCENARIOS } from './sbmScenarios';

// Kaza tespit tutanağındaki ihlal maddeleri ve kusur ağırlıkları
export const VIOLATION_ITEMS = [
  { id: 'v1', text: 'Kırmızı ışık ihlalinde bulunmak', weight: 100, article: 'KTK Md. 47' },
  { id: 'v2', text: 'Taşıt giremez işareti bulunan karayoluna girmek', weight: 90, article: 'KTK Md. 47' },
  { id: 'v3', text: 'Karşı yönden gelen trafiğin kullandığı yola girmek', weight: 95, article: 'KTK Md. 49' },
  { id: 'v4', text: 'Geçme yasağı (sollama yasağı) olan yerde geçiş yapmak', weight: 85, article: 'KTK Md. 56' },
  { id: 'v5', text: 'Kavşakta geçiş önceliğine uymamak', weight: 80, article: 'KTK Md. 57' },
  { id: 'v6', text: 'Yetkili memurun dur işaretinde geçmek', weight: 100, article: 'KTK Md. 47' },
  { id: 'v7', text: 'Aynı istikamette ve aynı şeritte giderken önündeki araca arkadan çarpmak', weight: 100, article: 'KTK Md. 52' },
  { id: 'v8', text: 'Sağa dönüş kurallarına uymamak', weight: 70, article: 'KTK Md. 53' },
  { id: 'v9', text: 'Sola dönüş kurallarına uymamak', weight: 75, article: 'KTK Md. 53' },
  { id: 'v10', text: 'Geri manevra kurallarına uymamak', weight: 80, article: 'KTK Md. 60' },
  { id: 'v11', text: 'Geçme (sollama) kurallarına uymamak', weight: 80, article: 'KTK Md. 56' },
  { id: 'v12', text: 'Geçiş önceliğine uymamak', weight: 75, article: 'KTK Md. 57' },
  { id: 'v13', text: 'Parketme kurallarına uymamak', weight: 50, article: 'KTK Md. 61' },
  { id: 'v14', text: 'Duraklama kurallarına uymamak', weight: 45, article: 'KTK Md. 60' },
  { id: 'v15', text: 'Kurallara uygun olarak park edilmiş araca çarpmak', weight: 100, article: 'KTK Md. 52' },
];

// Kusur oranı hesaplama
export function calculateFaultPercentages(vehicleAViolations, vehicleBViolations) {
  const scoreA = vehicleAViolations.reduce((sum, vid) => {
    const v = VIOLATION_ITEMS.find(item => item.id === vid);
    return sum + (v ? v.weight : 0);
  }, 0);

  const scoreB = vehicleBViolations.reduce((sum, vid) => {
    const v = VIOLATION_ITEMS.find(item => item.id === vid);
    return sum + (v ? v.weight : 0);
  }, 0);

  const total = scoreA + scoreB;

  if (total === 0) {
    return { faultA: 50, faultB: 50, basis: 'equal_default' };
  }

  const faultA = Math.round((scoreA / total) * 100);
  const faultB = 100 - faultA;

  return { faultA, faultB, basis: 'violation_weighted' };
}

// Özel durumlar analizi
export function analyzeSpecialCases(vehicleAViolations, vehicleBViolations) {
  const specialCases = [];

  // Arkadan çarpma - otomatik %100 kusur
  if (vehicleAViolations.includes('v7')) {
    specialCases.push({
      type: 'rear_end_collision',
      vehicle: 'A',
      description: 'Araç A arkadan çarpma gerçekleştirmiştir. KTK Md. 52 gereği takip mesafesini korumayan araç kusurludur.',
      suggestedFault: { faultA: 100, faultB: 0 }
    });
  }
  if (vehicleBViolations.includes('v7')) {
    specialCases.push({
      type: 'rear_end_collision',
      vehicle: 'B',
      description: 'Araç B arkadan çarpma gerçekleştirmiştir. KTK Md. 52 gereği takip mesafesini korumayan araç kusurludur.',
      suggestedFault: { faultA: 0, faultB: 100 }
    });
  }

  // Kırmızı ışık ihlali
  if (vehicleAViolations.includes('v1') && !vehicleBViolations.includes('v1')) {
    specialCases.push({
      type: 'red_light',
      vehicle: 'A',
      description: 'Araç A kırmızı ışık ihlalinde bulunmuştur. KTK Md. 47 gereği tam kusurlu kabul edilir.',
      suggestedFault: { faultA: 100, faultB: 0 }
    });
  }
  if (vehicleBViolations.includes('v1') && !vehicleAViolations.includes('v1')) {
    specialCases.push({
      type: 'red_light',
      vehicle: 'B',
      description: 'Araç B kırmızı ışık ihlalinde bulunmuştur. KTK Md. 47 gereği tam kusurlu kabul edilir.',
      suggestedFault: { faultA: 0, faultB: 100 }
    });
  }

  // Park halindeki araca çarpma
  if (vehicleAViolations.includes('v15')) {
    specialCases.push({
      type: 'parked_vehicle_hit',
      vehicle: 'A',
      description: 'Araç A, kurallara uygun park edilmiş araca çarpmıştır. Çarpan araç tam kusurludur.',
      suggestedFault: { faultA: 100, faultB: 0 }
    });
  }
  if (vehicleBViolations.includes('v15')) {
    specialCases.push({
      type: 'parked_vehicle_hit',
      vehicle: 'B',
      description: 'Araç B, kurallara uygun park edilmiş araca çarpmıştır. Çarpan araç tam kusurludur.',
      suggestedFault: { faultA: 0, faultB: 100 }
    });
  }

  // Karşı yönden gelme
  if (vehicleAViolations.includes('v3') && !vehicleBViolations.includes('v3')) {
    specialCases.push({
      type: 'wrong_way',
      vehicle: 'A',
      description: 'Araç A karşı yönden gelen trafiğin kullandığı yola girmiştir. KTK Md. 49 gereği ağır kusurlu kabul edilir.',
      suggestedFault: { faultA: 100, faultB: 0 }
    });
  }
  if (vehicleBViolations.includes('v3') && !vehicleAViolations.includes('v3')) {
    specialCases.push({
      type: 'wrong_way',
      vehicle: 'B',
      description: 'Araç B karşı yönden gelen trafiğin kullandığı yola girmiştir. KTK Md. 49 gereği ağır kusurlu kabul edilir.',
      suggestedFault: { faultA: 0, faultB: 100 }
    });
  }

  return specialCases;
}

// Kapsamlı analiz raporu oluşturma
export function generateAnalysis(data) {
  const { vehicleA, vehicleB, accidentInfo, selectedScenarioId } = data;

  const vehicleAViolations = vehicleA.violations || [];
  const vehicleBViolations = vehicleB.violations || [];

  // Temel kusur hesaplama
  const baseFault = calculateFaultPercentages(vehicleAViolations, vehicleBViolations);

  // Özel durumları analiz et
  const specialCases = analyzeSpecialCases(vehicleAViolations, vehicleBViolations);

  // SBM Senaryo eşleştirme
  const scenarioMatches = matchScenario(vehicleAViolations, vehicleBViolations, vehicleA.impactPoint, vehicleB.impactPoint);

  // Manuel senaryo seçimi varsa onu kullan
  let selectedScenario = null;
  if (selectedScenarioId) {
    selectedScenario = SBM_SCENARIOS.find(s => s.id === selectedScenarioId);
  }

  // Nihai kusur oranını belirle
  let finalFault = { ...baseFault };
  let faultBasis = 'violation_weighted';

  if (selectedScenario) {
    // Kullanıcı manuel senaryo seçmişse öncelik ver
    finalFault = {
      faultA: selectedScenario.faultA,
      faultB: selectedScenario.faultB,
      basis: 'sbm_manual'
    };
    faultBasis = 'sbm_manual';
  } else if (scenarioMatches.length > 0 && scenarioMatches[0].confidence >= 80) {
    // Yüksek güvenilirlikli SBM senaryosu eşleşmişse
    const bestMatch = scenarioMatches[0];
    selectedScenario = bestMatch.scenario;
    finalFault = {
      faultA: bestMatch.scenario.faultA,
      faultB: bestMatch.scenario.faultB,
      basis: 'sbm_auto'
    };
    faultBasis = 'sbm_auto';
  } else if (specialCases.length > 0) {
    // Özel durum varsa
    const mostSevere = specialCases[0];
    finalFault = {
      faultA: mostSevere.suggestedFault.faultA,
      faultB: mostSevere.suggestedFault.faultB,
      basis: 'special_case'
    };
    faultBasis = 'special_case';
  }

  // İhlal detayları
  const violationDetailsA = vehicleAViolations.map(vid => VIOLATION_ITEMS.find(v => v.id === vid)).filter(Boolean);
  const violationDetailsB = vehicleBViolations.map(vid => VIOLATION_ITEMS.find(v => v.id === vid)).filter(Boolean);

  // Gerekçe oluşturma
  const reasoning = generateReasoning(violationDetailsA, violationDetailsB, specialCases, finalFault, selectedScenario, scenarioMatches);

  // Beyan analizi
  const statementAnalysis = analyzeStatements(vehicleA.statement, vehicleB.statement);

  return {
    accidentInfo,
    vehicleA: {
      ...vehicleA,
      violationDetails: violationDetailsA,
      faultPercentage: finalFault.faultA,
    },
    vehicleB: {
      ...vehicleB,
      violationDetails: violationDetailsB,
      faultPercentage: finalFault.faultB,
    },
    baseFault,
    finalFault,
    faultBasis,
    specialCases,
    selectedScenario,
    scenarioMatches,
    reasoning,
    statementAnalysis,
    analysisDate: new Date().toISOString(),
  };
}

// Gerekçe metni oluştur
function generateReasoning(violationsA, violationsB, specialCases, finalFault, selectedScenario, scenarioMatches) {
  const reasons = [];

  // SBM Senaryo bilgisi
  if (selectedScenario) {
    reasons.push('SBM Kaza Durum Senaryosu Değerlendirmesi:');
    reasons.push(`  Uygulanan Senaryo: ${selectedScenario.title || selectedScenario.id}`);
    reasons.push(`  Açıklama: ${selectedScenario.description}`);
    reasons.push(`  Yasal Dayanak: ${selectedScenario.legalBasis}`);
    reasons.push('');
  }

  if (violationsA.length === 0 && violationsB.length === 0) {
    reasons.push('Her iki araç sürücüsü için tutanakta herhangi bir ihlal işaretlenmemiştir.');
    if (!selectedScenario) {
      reasons.push('Bu durumda kusur oranları eşit olarak değerlendirilmiştir.');
    }
  } else {
    if (violationsA.length > 0) {
      reasons.push(`Araç A sürücüsü için tutanakta ${violationsA.length} adet ihlal tespit edilmiştir:`);
      violationsA.forEach(v => {
        reasons.push(`  - ${v.text} (${v.article})`);
      });
    } else {
      reasons.push('Araç A sürücüsü için tutanakta herhangi bir ihlal tespit edilmemiştir.');
    }

    if (violationsB.length > 0) {
      reasons.push(`Araç B sürücüsü için tutanakta ${violationsB.length} adet ihlal tespit edilmiştir:`);
      violationsB.forEach(v => {
        reasons.push(`  - ${v.text} (${v.article})`);
      });
    } else {
      reasons.push('Araç B sürücüsü için tutanakta herhangi bir ihlal tespit edilmemiştir.');
    }
  }

  if (specialCases.length > 0) {
    reasons.push('');
    reasons.push('Özel Durum Değerlendirmesi:');
    specialCases.forEach(sc => {
      reasons.push(`  - ${sc.description}`);
    });
  }

  // Diğer eşleşen senaryolar
  if (scenarioMatches && scenarioMatches.length > 1) {
    reasons.push('');
    reasons.push('Diğer Olası SBM Senaryoları:');
    scenarioMatches.slice(1, 4).forEach(m => {
      reasons.push(`  - ${m.scenario.title || m.scenario.id} (Eşleşme: %${m.confidence}) - A:%${m.scenario.faultA} / B:%${m.scenario.faultB}`);
    });
  }

  reasons.push('');
  reasons.push(`Sonuç: Araç A kusur oranı %${finalFault.faultA}, Araç B kusur oranı %${finalFault.faultB} olarak tespit edilmiştir.`);

  if (selectedScenario) {
    reasons.push(`Değerlendirme Dayanağı: SBM ${selectedScenario.id} numaralı senaryo - ${selectedScenario.legalBasis}`);
  }

  return reasons;
}

// Beyan analizi
function analyzeStatements(statementA, statementB) {
  const analysis = [];

  if (!statementA && !statementB) {
    analysis.push('Her iki tarafın beyanları tutanağa kaydedilmemiştir.');
    return analysis;
  }

  if (statementA) {
    analysis.push(`Araç A Sürücüsü Beyanı: "${statementA}"`);
  }
  if (statementB) {
    analysis.push(`Araç B Sürücüsü Beyanı: "${statementB}"`);
  }

  // Çelişki kontrolü
  if (statementA && statementB) {
    analysis.push('');
    analysis.push('Not: Tarafların beyanları tutanaktaki ihlal işaretlemeleri ve kroki ile birlikte değerlendirilmiştir.');
  }

  return analysis;
}

// Darbe yeri analizi
export function analyzeImpactPoints(impactA, impactB) {
  const analysis = [];

  const impactDescriptions = {
    'front': 'ön',
    'front-left': 'sol ön',
    'front-right': 'sağ ön',
    'left': 'sol',
    'right': 'sağ',
    'rear': 'arka',
    'rear-left': 'sol arka',
    'rear-right': 'sağ arka',
  };

  if (impactA) {
    analysis.push(`Araç A darbe noktası: ${impactDescriptions[impactA] || impactA}`);
  }
  if (impactB) {
    analysis.push(`Araç B darbe noktası: ${impactDescriptions[impactB] || impactB}`);
  }

  // Darbe noktalarına göre çarpışma tipi analizi
  if (impactA === 'front' && impactB === 'rear') {
    analysis.push('Çarpışma Tipi: Arkadan çarpma - Araç A, Araç B\'ye arkadan çarpmıştır.');
  } else if (impactA === 'rear' && impactB === 'front') {
    analysis.push('Çarpışma Tipi: Arkadan çarpma - Araç B, Araç A\'ya arkadan çarpmıştır.');
  } else if (impactA === 'front' && impactB === 'front') {
    analysis.push('Çarpışma Tipi: Kafa kafaya çarpışma');
  } else if ((impactA === 'left' || impactA === 'front-left') && (impactB === 'right' || impactB === 'front-right')) {
    analysis.push('Çarpışma Tipi: Yan çarpışma (T-bone)');
  } else if ((impactA === 'right' || impactA === 'front-right') && (impactB === 'left' || impactB === 'front-left')) {
    analysis.push('Çarpışma Tipi: Yan çarpışma (T-bone)');
  } else if (impactA && impactB) {
    analysis.push('Çarpışma Tipi: Açılı çarpışma');
  }

  return analysis;
}

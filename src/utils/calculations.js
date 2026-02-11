import { INSURANCE_TYPES, STEPS } from './constants';

export function calculateBranchSummary(productions, branchId, targets, stepLevel = 1) {
  const step = STEPS.find(s => s.level === stepLevel) || STEPS[0];
  const branchProductions = branchId === 'all'
    ? productions
    : productions.filter(p => p.branchId === branchId);

  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 1;

  const currentYearProds = branchProductions.filter(p => new Date(p.date).getFullYear() === currentYear);
  const prevYearProds = branchProductions.filter(p => new Date(p.date).getFullYear() === prevYear);

  const summary = {};

  for (const type of INSURANCE_TYPES) {
    const currentProds = currentYearProds.filter(p => p.insuranceType === type.key);
    const prevProds = prevYearProds.filter(p => p.insuranceType === type.key);

    const currentPremium = currentProds.reduce((sum, p) => sum + (p.premium || 0), 0);
    const prevPremium = prevProds.reduce((sum, p) => sum + (p.premium || 0), 0);
    const currentPolicyCount = currentProds.reduce((sum, p) => sum + (p.policyCount || 0), 0);
    const prevPolicyCount = prevProds.reduce((sum, p) => sum + (p.policyCount || 0), 0);

    const targetPremium = targets?.[type.key]?.premium
      ? targets[type.key].premium * step.multiplier
      : 0;
    const targetPolicyCount = targets?.[type.key]?.policyCount
      ? targets[type.key].policyCount * step.multiplier
      : 0;

    const premiumChangeRate = prevPremium > 0
      ? ((currentPremium - prevPremium) / prevPremium) * 100
      : 0;
    const policyChangeRate = prevPolicyCount > 0
      ? ((currentPolicyCount - prevPolicyCount) / prevPolicyCount) * 100
      : 0;

    const premiumAchievementRate = targetPremium > 0
      ? (currentPremium / targetPremium) * 100
      : 0;
    const policyAchievementRate = targetPolicyCount > 0
      ? (currentPolicyCount / targetPolicyCount) * 100
      : 0;

    summary[type.key] = {
      key: type.key,
      label: type.label,
      color: type.color,
      currentPremium,
      prevPremium,
      premiumChangeRate,
      currentPolicyCount,
      prevPolicyCount,
      policyChangeRate,
      targetPremium,
      targetPolicyCount,
      premiumAchievementRate,
      policyAchievementRate,
    };
  }

  return summary;
}

export function calculateTotals(summary) {
  const values = Object.values(summary);
  const totalCurrentPremium = values.reduce((s, v) => s + v.currentPremium, 0);
  const totalPrevPremium = values.reduce((s, v) => s + v.prevPremium, 0);
  const totalTargetPremium = values.reduce((s, v) => s + v.targetPremium, 0);
  const totalCurrentPolicyCount = values.reduce((s, v) => s + v.currentPolicyCount, 0);
  const totalPrevPolicyCount = values.reduce((s, v) => s + v.prevPolicyCount, 0);
  const totalTargetPolicyCount = values.reduce((s, v) => s + v.targetPolicyCount, 0);

  const trafikPremium = summary.trafik?.currentPremium || 0;
  const kaskoPremium = summary.kasko?.currentPremium || 0;
  const trafikRate = totalCurrentPremium > 0 ? (trafikPremium / totalCurrentPremium) * 100 : 0;
  const trafikDisiOtoRate = totalCurrentPremium > 0 ? (kaskoPremium / totalCurrentPremium) * 100 : 0;
  const overallAchievementRate = totalTargetPremium > 0
    ? (totalCurrentPremium / totalTargetPremium) * 100
    : 0;
  const overallChangeRate = totalPrevPremium > 0
    ? ((totalCurrentPremium - totalPrevPremium) / totalPrevPremium) * 100
    : 0;

  return {
    totalCurrentPremium,
    totalPrevPremium,
    totalTargetPremium,
    totalCurrentPolicyCount,
    totalPrevPolicyCount,
    totalTargetPolicyCount,
    trafikRate,
    trafikDisiOtoRate,
    overallAchievementRate,
    overallChangeRate,
  };
}

export function filterProductionsByPeriod(productions, period) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case 'daily':
      return productions.filter(p => {
        const d = new Date(p.date);
        return d >= today;
      });
    case 'monthly':
      return productions.filter(p => {
        const d = new Date(p.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    case 'yearly':
    default:
      return productions.filter(p => {
        const d = new Date(p.date);
        return d.getFullYear() === now.getFullYear();
      });
  }
}

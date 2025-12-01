export const ATM_PSI = 14.6959;
export const KPA_PER_PSI = 6.89476;
export const IN3_PER_FT3 = 1728;
export const LITERS_PER_FT3 = 28.3168;
export const CO2_DENSITY_LB_PER_FT3 = 0.1144; // density of CO2 gas near 70°F at 1 atm

export function formatNumber(value, decimals = 2) {
  return Number.isFinite(value) ? Number(value).toFixed(decimals) : '—';
}

export function cylinderVolume(diameterIn, widthIn) {
  const radius = diameterIn / 2;
  return Math.PI * radius * radius * widthIn; // cubic inches
}

export function calculateVolumes({ outerDiameter, width, wheelDiameter }) {
  const outerVolumeIn3 = cylinderVolume(outerDiameter, width);
  const wheelVolumeIn3 = cylinderVolume(wheelDiameter, width);
  const airVolumeIn3 = Math.max(outerVolumeIn3 - wheelVolumeIn3, 0);
  const airVolumeFt3 = airVolumeIn3 / IN3_PER_FT3;

  return { airVolumeFt3 };
}

export function gasUsage(airVolumeFt3, startPsi, targetPsi) {
  const deltaPsi = Math.max(targetPsi - startPsi, 0);

  if (deltaPsi === 0 || airVolumeFt3 === 0) {
    return { gasLbs: 0 };
  }

  const startAbs = startPsi + ATM_PSI;
  const targetAbs = targetPsi + ATM_PSI;

  const gasPerFillLb = ((targetAbs - startAbs) / ATM_PSI) * airVolumeFt3 * CO2_DENSITY_LB_PER_FT3;

  return { gasLbs: gasPerFillLb };
}

export function calculateMetricDimensions(widthMm, aspectRatio, wheelDiameter) {
  const widthIn = widthMm / 25.4;
  const sidewallHeightIn = widthIn * (aspectRatio / 100);
  const outerDiameter = wheelDiameter + sidewallHeightIn * 2;

  return { widthIn, sidewallHeightIn, outerDiameter };
}

export function kpaToPsi(kpa) {
  return kpa / KPA_PER_PSI;
}

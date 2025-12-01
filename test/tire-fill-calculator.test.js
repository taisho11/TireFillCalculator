import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LITERS_PER_FT3,
  calculateMetricDimensions,
  calculateVolumes,
  cylinderVolume,
  formatNumber,
  gasUsage,
  kpaToPsi,
} from '../calculator-core.js';

test('cylinderVolume computes cubic inches for a cylinder', () => {
  const result = cylinderVolume(10, 5);
  assert.ok(Math.abs(result - 392.699) < 0.001);
});

test('calculateVolumes subtracts the wheel cavity', () => {
  const { airVolumeFt3 } = calculateVolumes({ outerDiameter: 10, width: 5, wheelDiameter: 4 });
  assert.ok(Math.abs(airVolumeFt3 - 0.1908) < 0.0005);
});

test('gasUsage returns zero when no pressure change is needed', () => {
  const { gasLbs } = gasUsage(1, 20, 20);
  assert.equal(gasLbs, 0);
});

test('gasUsage estimates CO2 consumption for a pressure increase', () => {
  const { gasLbs } = gasUsage(0.2, 10, 35);
  assert.ok(Math.abs(gasLbs - 0.038922) < 0.0005);
});

test('metric dimensions convert width and diameter correctly', () => {
  const { widthIn, outerDiameter } = calculateMetricDimensions(285, 70, 17);
  assert.ok(Math.abs(widthIn - 11.22047) < 0.0001);
  assert.ok(Math.abs(outerDiameter - 32.70866) < 0.0001);
});

test('kpaToPsi converts kPa to psi', () => {
  assert.ok(Math.abs(kpaToPsi(100) - 14.5038) < 0.0001);
});

test('formatNumber guards against invalid values', () => {
  assert.equal(formatNumber(NaN), '—');
  assert.equal(formatNumber(1.23456, 3), '1.235');
});

test('liters conversion constant matches expected value', () => {
  assert.ok(Math.abs(LITERS_PER_FT3 - 28.3168) < 0.0001);
});

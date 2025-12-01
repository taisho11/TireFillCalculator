import {
  LITERS_PER_FT3,
  calculateMetricDimensions,
  calculateVolumes,
  formatNumber,
  gasUsage,
  kpaToPsi,
} from './calculator-core.js';

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const imperialForm = document.getElementById('imperial-form');
const metricForm = document.getElementById('metric-form');
const imperialResults = document.getElementById('imperial-results');
const metricResults = document.getElementById('metric-results');

function setActiveTab(tabId) {
  tabs.forEach((tab) => {
    const isActive = tab.id === tabId;
    tab.classList.toggle('tab--active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  panels.forEach((panel) => {
    const matches = panel.getAttribute('aria-labelledby') === tabId;
    panel.classList.toggle('panel--active', matches);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveTab(tab.id));
});

function fillResults(container, { airVolumeFt3, gasLbsPerFill, fills }) {
  const liters = airVolumeFt3 * LITERS_PER_FT3;
  const displayFills = Number.isFinite(fills)
    ? `${fills.toFixed(2)}`
    : 'Unlimited (no pressure change)';

  container.innerHTML = `
    <div class="result-row">
      <span class="result-label">Air cavity volume</span>
      <span class="result-value">${formatNumber(airVolumeFt3, 3)} ft³ / ${formatNumber(liters, 1)} L</span>
    </div>
    <div class="result-row">
      <span class="result-label">CO2 needed per fill</span>
      <span class="result-value">${formatNumber(gasLbsPerFill, 3)} lbs</span>
    </div>
    <div class="result-row">
      <span class="result-label">Estimated number of fills</span>
      <span class="result-value">${displayFills}</span>
    </div>
  `;
}

function calculateImperial(event) {
  event.preventDefault();
  const data = new FormData(imperialForm);

  const outerDiameter = Number(data.get('tireDiameter'));
  const width = Number(data.get('tireWidth'));
  const wheelDiameter = Number(data.get('wheelDiameter'));
  const startPsi = Number(data.get('startPsi'));
  const targetPsi = Number(data.get('targetPsi'));
  const co2Lbs = Number(data.get('co2Lbs'));

  const { airVolumeFt3 } = calculateVolumes({ outerDiameter, width, wheelDiameter });
  const { gasLbs } = gasUsage(airVolumeFt3, startPsi, targetPsi);
  const estimatedFills = gasLbs > 0 ? co2Lbs / gasLbs : Infinity;

  fillResults(imperialResults, {
    airVolumeFt3,
    gasLbsPerFill: gasLbs,
    fills: estimatedFills,
  });
}

function calculateMetric(event) {
  event.preventDefault();
  const data = new FormData(metricForm);

  const widthMm = Number(data.get('tireWidthMm'));
  const aspectRatio = Number(data.get('aspectRatio'));
  const wheelDiameter = Number(data.get('wheelDiameter'));
  const startPsi = kpaToPsi(Number(data.get('startKpa')));
  const targetPsi = kpaToPsi(Number(data.get('targetKpa')));
  const co2Lbs = Number(data.get('co2Lbs'));

  const { widthIn, outerDiameter } = calculateMetricDimensions(widthMm, aspectRatio, wheelDiameter);
  const { airVolumeFt3 } = calculateVolumes({ outerDiameter, width: widthIn, wheelDiameter });
  const { gasLbs } = gasUsage(airVolumeFt3, startPsi, targetPsi);
  const estimatedFills = gasLbs > 0 ? co2Lbs / gasLbs : Infinity;

  fillResults(metricResults, {
    airVolumeFt3,
    gasLbsPerFill: gasLbs,
    fills: estimatedFills,
  });
}

imperialForm.addEventListener('submit', calculateImperial);
metricForm.addEventListener('submit', calculateMetric);

document.addEventListener('DOMContentLoaded', () => {
  calculateImperial(new Event('submit'));
  calculateMetric(new Event('submit'));
  setActiveTab('imperial-tab');
});

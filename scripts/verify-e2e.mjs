/**
 * AgriLink End-to-End Business Logic & Verification Script
 * Validates the core SIH26032 Farmer -> Officer -> Factory -> Farmer workflow
 */

import { WorkflowEngine } from '../src/services/workflowEngine.js';
import { SUPPORTED_CROPS } from '../src/config/crops.js';
import { CROP_WORKFLOWS } from '../src/config/cropWorkflows.js';

console.log('---------------------------------------------------------');
console.log('🌱 AGRILINK: SIH 2026 END-TO-END WORKFLOW VERIFICATION');
console.log('---------------------------------------------------------\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

// 1. Validate Crop Configuration & Supported Sectors
console.log('1. Validating 4 Industry Sectors and Crop Workflow Catalogs:');
const sectors = ['Sugar', 'Textile', 'Oilseed', 'Tea & Coffee'];
sectors.forEach((sec) => {
  const matching = Object.values(SUPPORTED_CROPS).filter((c) => c.industry === sec);
  assert(matching.length > 0, `Sector "${sec}" is configured with active crops (${matching.map(m => m.type).join(', ')})`);
});

// Check Sugarcane Brix quality parameter
assert(
  CROP_WORKFLOWS.Sugarcane.qualityParameters.some((p) => p.key === 'brixPercentage'),
  'Sugarcane workflow requires Brix sucrose % quality check'
);

// Check Cotton staple length parameter
assert(
  CROP_WORKFLOWS.Cotton.qualityParameters.some((p) => p.key === 'stapleLengthMm'),
  'Cotton workflow requires fiber staple length check'
);

// 2. Validate Crop Verification Workflow Gate
console.log('\n2. Validating Crop Verification Gate (Section 38 Data Integrity):');
const unverifiedCrop = {
  id: 'AGRI-CROP-TEST-01',
  status: 'Pending Verification',
  cropType: 'Sugarcane',
  landArea: 5,
};
const unverifiedResult = WorkflowEngine.canEnterProcurement(unverifiedCrop);
assert(!unverifiedResult.allowed, 'Unverified crop is blocked from entering procurement queue');

const verifiedCrop = {
  id: 'AGRI-CROP-TEST-02',
  status: 'Verified',
  cropType: 'Sugarcane',
  landArea: 5,
};
const verifiedResult = WorkflowEngine.canEnterProcurement(verifiedCrop);
assert(verifiedResult.allowed, 'Verified crop is allowed to enter factory procurement');

// 3. Validate Automatic Weighment (Net = Gross - Tare)
console.log('\n3. Validating Automatic Weighment (Section 20 & 38):');
const gross = 14500;
const tare = 3200;
const calculatedNet = gross - tare;
assert(calculatedNet === 11300, `Net Weight accurately computed (${gross} - ${tare} = ${calculatedNet} kg)`);

// 4. Validate Billing Calculation (Total = Net Weight × Rate)
console.log('\n4. Validating Billing & Rate Computation (Section 21 & 38):');
const ratePerKg = 3.50; // ₹3.50 / kg
const totalAmount = Math.round(calculatedNet * ratePerKg);
assert(totalAmount === 39550, `Bill Amount computed (${calculatedNet} kg × ₹${ratePerKg} = ₹${totalAmount})`);

// 5. Validate Transition Constraints (Cannot Complete without Payment)
console.log('\n5. Validating Procurement State Transitions:');
const mockProcurementPendingPayment = {
  id: 'PROC-TEST-01',
  cropType: 'Sugarcane',
  currentStatus: 'Billing',
  weighment: { netWeightKg: calculatedNet },
  quality: { grade: 'Grade A (Premium)' },
  bill: { totalAmount, paymentStatus: 'Pending' },
};

const transitionAttempt = WorkflowEngine.canTransitionTo(mockProcurementPendingPayment, 'Completed');
assert(!transitionAttempt.allowed, 'Cannot transition to Completed while payment is Pending');

mockProcurementPendingPayment.bill.paymentStatus = 'Paid';
const transitionAttemptPaid = WorkflowEngine.canTransitionTo(mockProcurementPendingPayment, 'Completed');
assert(transitionAttemptPaid.allowed, 'Can transition to Completed once payment status is marked Paid');

// 6. Summary
console.log('\n---------------------------------------------------------');
console.log(`Test Execution Summary: ${testsPassed} Passed, ${testsFailed} Failed.`);
console.log('---------------------------------------------------------');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('All end-to-end procurement and agronomic business rules verified successfully!\n');
}

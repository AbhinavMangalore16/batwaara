/**
 * Utility functions for generating direct UPI Intent links (upi://pay)
 * for instant 1-click settlements via Paytm, PhonePe, Google Pay, BHIM, etc.
 */

export interface UpiParams {
  /** Payee Virtual Payment Address / UPI ID (e.g. user@paytm, 9876543210@upi) */
  pa: string;
  /** Payee Name (e.g. Rahul Sharma) */
  pn: string;
  /** Exact amount to pay in INR (e.g. 250.00) */
  am: number | string;
  /** Currency code (defaults to INR) */
  cu?: string;
  /** Transaction Note / Memo (e.g. Batwaara: Goa Trip Settlement) */
  tn?: string;
}

/**
 * Standard Universal UPI Deep-Link Intent URI (opens OS payment chooser on mobile)
 * Spec: upi://pay?pa={VPA}&pn={NAME}&am={AMOUNT}&cu=INR&tn={NOTE}
 */
export function buildUpiUrl(params: UpiParams): string {
  const { pa, pn, am, cu = 'INR', tn = 'Batwaara Settlement' } = params;
  const formattedAmount = typeof am === 'number' ? am.toFixed(2) : String(am);

  const searchParams = new URLSearchParams({
    pa: pa.trim(),
    pn: pn.trim(),
    am: formattedAmount,
    cu: cu.toUpperCase(),
    tn: tn.trim(),
  });

  return `upi://pay?${searchParams.toString()}`;
}

/**
 * Paytm App Specific UPI Intent Deep-Link
 */
export function buildPaytmUpiUrl(params: UpiParams): string {
  const universalUrl = buildUpiUrl(params);
  return universalUrl.replace('upi://pay', 'paytmmp://pay');
}

/**
 * PhonePe App Specific UPI Intent Deep-Link
 */
export function buildPhonePeUpiUrl(params: UpiParams): string {
  const universalUrl = buildUpiUrl(params);
  return universalUrl.replace('upi://pay', 'phonepe://pay');
}

/**
 * Google Pay (Tez) Specific UPI Intent Deep-Link
 */
export function buildGPayUpiUrl(params: UpiParams): string {
  const universalUrl = buildUpiUrl(params);
  return universalUrl.replace('upi://pay', 'tez://upi/pay');
}

/**
 * BHIM UPI App Specific Deep-Link
 */
export function buildBhimUpiUrl(params: UpiParams): string {
  const universalUrl = buildUpiUrl(params);
  return universalUrl.replace('upi://pay', 'bhim://pay');
}

/**
 * Generates dynamic high-definition 2D QR Code image URL for desktop users
 * Users can scan the QR code with Paytm, PhonePe, or GPay camera on their phone!
 */
export function generateUpiQrCodeUrl(upiUrl: string, size: number = 300): string {
  const encodedUri = encodeURIComponent(upiUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUri}&color=090d16&bgcolor=ffffff`;
}

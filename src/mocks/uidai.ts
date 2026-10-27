import type { AadhaarOtpRequest, AadhaarOtpResponse } from '../generated/uidai/api';

export async function mockAadhaarOtp(req: AadhaarOtpRequest): Promise<AadhaarOtpResponse> {
  if (!/^\d{12}$/.test(req.uid)) {
    return { status: 'FAILED', errorCode: 'INVALID_UID', errorMessage: 'UID must be 12 digits' };
  }
  if (!/^\d{6}$/.test(req.otp)) {
    return { status: 'FAILED', errorCode: 'INVALID_OTP', errorMessage: 'OTP must be 6 digits' };
  }

  const lastDigit = Number(req.uid.slice(-1));
  if (lastDigit === 0) {
    return { status: 'FAILED', errorCode: 'AADHAAR_NOT_FOUND', errorMessage: 'No record' };
  }
  if (lastDigit === 1) {
    return { status: 'FAILED', errorCode: 'OTP_MISMATCH', errorMessage: 'OTP does not match' };
  }

  return {
    status: 'SUCCESS',
    data: {
      name: 'Demo Student',
      gender: 'F',
      dob: '2002-05-14',
      address: 'Tribal Village, District X, State Y',
      photo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+XfKcAAAAASUVORK5CYII=',
    },
  };
}
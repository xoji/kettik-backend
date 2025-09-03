import { RequestDevice } from "../types";
import { phoneNumber } from "./phoneNumber";
import jwt from "jsonwebtoken";

export function generateOTP(length = 5) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export async function generateOtpResObject(
  user: { id: bigint; phone_number: string },
  device: RequestDevice,
) {
  const pNumber = phoneNumber(user.phone_number)!;
  const expTime = new Date();
  expTime.setMinutes(expTime.getMinutes() + 2);
  const resendExp = new Date();
  resendExp.setDate(resendExp.getDate() + 1);
  const otpCode = generateOTP();
  const token = jwt.sign(
    {
      user_id: user.id,
      phone_number: pNumber.maskedPhoneNumber,
      expTime: expTime.getTime(),
    },
    process.env.AUTHORIZATION_OTP_SECRET_KEY!,
    { expiresIn: "2m" },
  );
  const resendToken = jwt.sign(
    {
      user_id: user.id,
      phone_number: pNumber.maskedPhoneNumber,
      sms_token: token,
      expTime: resendExp.getTime(),
      start_time: expTime.getTime(),
    },
    process.env.AUTHORIZATION_OTP_RESEND_SECRET_KEY!,
    {
      expiresIn: "1Day",
    },
  );
  await redis.set(
    `${pNumber.phoneNumber}:${device.id}`,
    JSON.stringify({
      code: otpCode,
      resend_time: expTime.getTime(),
      token,
    }),
    {
      expiration: {
        type: "EX",
        value: 120,
      },
    },
  );
  await redis.set(`${pNumber.phoneNumber}:${device.id}:resend`, resendToken, {
    expiration: {
      type: "EX",
      value: 24 * 60 * 60,
    },
  });
  return {
    sms_token: token,
    resend_token: resendToken,
    expires_in: Math.floor(expTime.getTime() / 1000),
    phone: pNumber.maskedPhoneNumber,
    code: otpCode,
  };
}

export async function deleteOtpRecords(phone: string, deviceId: string) {
  await redis.del(`${phone}:${deviceId}`);
  await redis.del(`${phone}:${deviceId}:resend`);
}

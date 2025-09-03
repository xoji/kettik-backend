import {
  PhoneNumberFormat,
  PhoneNumberUtil,
  RegionCode,
} from "google-libphonenumber";

interface ParsedPhoneNumber {
  phoneNumber: string;
  formattedPhoneNumber: string;
  maskedPhoneNumber: string;
  nationalPhoneNumber: string;
  country: RegionCode;
}

interface MaskOptions {
  preserveLastDigits?: number; // Сколько последних цифр оставлять видимыми
  maskChar?: string; // Символ для маскировки
}

const phoneUtil = PhoneNumberUtil.getInstance();

export function phoneNumber(phone: string): ParsedPhoneNumber | null {
  const parsed = phoneUtil.parseAndKeepRawInput(`+${phone.replace(/\D/g, "")}`);
  if (!phoneUtil.isValidNumber(parsed)) {
    return null;
  }
  const number = phoneUtil.format(parsed, PhoneNumberFormat.E164);
  return {
    formattedPhoneNumber: phoneUtil.format(
      parsed,
      PhoneNumberFormat.INTERNATIONAL,
    ),
    nationalPhoneNumber: phoneUtil.format(parsed, PhoneNumberFormat.NATIONAL),
    phoneNumber: number,
    maskedPhoneNumber: maskPhoneNumber(number, {
      preserveLastDigits: 3,
      maskChar: "*",
    }),
    country: phoneUtil.getRegionCodeForNumber(parsed)!,
  };
}

function maskPhoneNumber(
  phoneNumber: string,
  options: MaskOptions = { preserveLastDigits: 2, maskChar: "*" },
): string {
  try {
    // Парсим номер (автоматическое определение страны)
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber);

    if (!phoneUtil.isValidNumber(number)) {
      return phoneNumber;
    }

    // Получаем компоненты номера
    const countryCode = number.getCountryCode();
    const nationalNumber = phoneUtil.getNationalSignificantNumber(number);
    const regionCode = phoneUtil.getRegionCodeForNumber(number)!;

    // Получаем пример форматирования для страны
    const exampleNumber = phoneUtil.getExampleNumber(regionCode);
    const exampleFormat = exampleNumber
      ? phoneUtil.format(exampleNumber, PhoneNumberFormat.NATIONAL)
      : "";

    // Создаем маску на основе формата примера
    let maskedNumber = nationalNumber;
    let formattedResult = "";
    let digitIndex = 0;
    let lastDigitPosition = -1;

    // Определяем позиции последних видимых цифр
    const visibleDigits = options.preserveLastDigits || 2;
    const maskStart = Math.max(0, nationalNumber.length - visibleDigits);

    // Применяем форматирование из примера
    for (const char of exampleFormat) {
      if (/[\d*]/.test(char) && digitIndex < nationalNumber.length) {
        // Маскируем цифры до позиции maskStart
        const shouldMask = digitIndex < maskStart;
        formattedResult += shouldMask
          ? options.maskChar || "*"
          : nationalNumber[digitIndex];

        // Запоминаем последнюю позицию цифры
        lastDigitPosition = formattedResult.length - 1;
        digitIndex++;
      } else {
        // Копируем нецифровые символы
        formattedResult += char;
      }
    }

    // Добавляем оставшиеся цифры, если пример короче
    while (digitIndex < nationalNumber.length) {
      const shouldMask = digitIndex < maskStart;
      formattedResult += shouldMask
        ? options.maskChar || "*"
        : nationalNumber[digitIndex];
      digitIndex++;
    }

    // Убираем нецифровые символы после последней цифры
    if (lastDigitPosition > -1) {
      formattedResult = formattedResult.substring(0, lastDigitPosition + 1);
    }

    return `+${countryCode} ${formattedResult}`;
  } catch (error) {
    console.error("Phone number masking error:", error);
    return phoneNumber;
  }
}

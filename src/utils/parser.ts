function parseValue(value: string): any {
  // Проверка на число
  if (!isNaN(Number(value)) && value.trim() !== "") {
    return Number(value);
  }
  // Проверка на boolean
  if (value.toLowerCase() === "true") {
    return true;
  }
  if (value.toLowerCase() === "false") {
    return false;
  }
  // Проверка на дату
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date;
  }
  // Иначе оставить как есть
  return value;
}

export function parseObject(obj: { [key: string]: string }): {
  [key: string]: any;
} {
  const result: { [key: string]: any } = {};
  for (const key in obj) {
    result[key] = parseValue(obj[key]);
  }
  return result;
}

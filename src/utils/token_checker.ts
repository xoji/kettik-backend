import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export function tokenChecker<payload = any>(
  token: string,
  secret_key: string,
): payload | null {
  try {
    const payload = jwt.verify(token, secret_key);
    return payload as any;
  } catch (e) {
    if (
      !(e instanceof JsonWebTokenError) &&
      !(e instanceof TokenExpiredError)
    ) {
      console.error(e);
    }
    return null;
  }
}

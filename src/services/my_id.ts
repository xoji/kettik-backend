import axios from "axios";

export async function getMyIdToken(): Promise<string | null> {
  try {
    let token = await redis.get("myIdToken");
    if (!token) {
      console.log({
        client_id: process.env.MY_ID_CLIENT_ID,
        client_secret: process.env.MY_ID_CLIENT_SECRET,
      });
      const idRes = await axios.post<{
        access_token: string;
        expires_in: number;
        token_type: string;
      }>(
        `${process.env.MY_ID_ENDPOINT}/api/v1/auth/clients/access-token`,
        {
          client_id: process.env.MY_ID_CLIENT_ID,
          client_secret: process.env.MY_ID_CLIENT_SECRET,
        },
        {
          validateStatus: (_) => {
            return true;
          },
        },
      );
      console.log(
        `${process.env.MY_ID_ENDPOINT}/api/v1/auth/clients/access-token`,
        idRes.status,
        idRes.data,
      );
      if (
        idRes.status !== 200 ||
        !idRes.data.access_token ||
        !idRes.data.expires_in
      ) {
        return null;
      }
      await redis.set("myIdToken", idRes.data.access_token, {
        expiration: {
          type: "EX",
          value: idRes.data.expires_in,
        },
      });
      token = idRes.data.access_token;
    }
    return token;
  } catch (e) {
    console.error(e);
    return null;
  }
}

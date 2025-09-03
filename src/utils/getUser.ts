import { UserDatabaseModel } from "../types";

export async function getUser(userID: number) {
  let user: UserDatabaseModel | null = null;
  try {
    user = JSON.parse(await redis.get(`user:${userID}`));
  } catch (e) {
    console.error(e);
  }
  if (!user) {
    user = await database.users.findFirst({
      where: { id: userID },
    });
    if (!user) {
      return null;
    }
    await redis.set(`user:${userID}`, JSON.stringify(user), {
      expiration: {
        type: "EX",
        value: 24 * 60 * 60 * 7,
      },
    });
  }
  return user;
}

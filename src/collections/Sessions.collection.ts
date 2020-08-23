import {
  IUserPersistance,
  IFieldMap,
  IUser,
  ISession,
  FindAuthenticationStrategyResponse,
  ISessionPersistance,
} from "@kaviar/security-bundle";
import { Collection, ObjectID, Behaviors } from "@kaviar/mongo-bundle";

export class SessionsCollection extends Collection<ISession>
  implements ISessionPersistance {
  static collectionName = "sessions";

  async newSession(userId: any, expiresAt: Date, data?: any): Promise<string> {
    const session = {
      _id: generateToken(32),
      userId,
      expiresAt,
    };

    if (data) {
      Object.assign(session, data);
    }

    const sessionInsertion = await this.insertOne(session);

    return sessionInsertion.insertedId;
  }

  async getSession(token: string): Promise<ISession> {
    return this.findOne({
      _id: token,
    });
  }

  async deleteSession(token: string): Promise<void> {
    await this.deleteOne({
      _id: token,
    });
  }

  async deleteAllSessionsForUser(userId: any): Promise<void> {
    await this.deleteMany({
      userId,
    });
  }

  async cleanExpiredTokens(): Promise<void> {
    await this.deleteMany({
      expiresAt: {
        $lt: new Date(),
      },
    });
  }
}

const ALLOWED_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
  ""
);
function generateToken(length) {
  var b = [];
  for (var i = 0; i < length; i++) {
    var j = (Math.random() * (ALLOWED_CHARS.length - 1)).toFixed(0);
    b[i] = ALLOWED_CHARS[j];
  }
  return b.join("");
}

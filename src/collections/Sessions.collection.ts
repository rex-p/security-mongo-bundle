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
      userId,
      expiresAt,
    };

    if (data) {
      Object.assign(session, data);
    }

    const sessionInsertion = await this.insertOne(session);

    return sessionInsertion.insertedId.toString();
  }

  async getSession(token: string): Promise<ISession> {
    return this.findOne({
      _id: new ObjectID(token),
    });
  }

  async deleteSession(token: string): Promise<void> {
    await this.deleteOne({
      _id: new ObjectID(token),
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

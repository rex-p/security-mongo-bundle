import {
  IUserPersistance,
  IFieldMap,
  IUser,
  FindAuthenticationStrategyResponse,
} from "@kaviar/security-bundle";
import { Collection, ObjectID, Behaviors } from "@kaviar/mongo-bundle";

export class UsersCollection extends Collection<IUser>
  implements IUserPersistance {
  static collectionName = "users";

  static behaviors = [Behaviors.Timestampable()];

  async insertUser(data: any): Promise<any> {
    const result = await this.insertOne(data);

    return result.insertedId;
  }

  async updateUser(userId: any, data: any): Promise<void> {
    await this.updateOne(
      {
        _id: userId,
      },
      {
        $set: data,
      }
    );
  }

  async deleteUser(userId: any): Promise<void> {
    await this.deleteOne({ _id: userId });
  }

  async findUser(filters: any, projection?: IFieldMap): Promise<IUser> {
    const options: any = {};
    if (projection) {
      options.projection = projection;
    }

    return this.findOne(filters, options);
  }

  async findUserById(userId: any, projection?: IFieldMap): Promise<IUser> {
    const options: any = {};
    if (projection) {
      options.projection = projection;
    }

    return this.findOne({ _id: userId }, options);
  }

  async updateAuthenticationStrategyData<T = any>(
    userId: any,
    methodName: string,
    data: null | Partial<T>
  ): Promise<void> {
    // TODO: more efficiently via $set directly
    const authMethod = await this.getAuthenticationStrategyData(
      userId,
      methodName
    );

    let current = authMethod ? authMethod : {};

    Object.assign(current, data);

    await this.updateOne(
      { _id: userId },
      {
        $set: {
          [methodName]: current,
        },
      }
    );
  }

  async findThroughAuthenticationStrategy<T = any>(
    methodName: string,
    filters: any,
    fields?: IFieldMap
  ): Promise<FindAuthenticationStrategyResponse<T>> {
    const methodFilters = {};
    for (const key of filters) {
      methodFilters[`${methodName}.${key}`] = filters[key];
    }

    // TODO: projection
    const result = await this.findOne(methodFilters);

    return {
      userId: result._id,
      method: result[methodName],
    };
  }

  async getAuthenticationStrategyData<T = any>(
    userId: any,
    methodName: string,
    projection?: IFieldMap
  ): Promise<T> {
    // TODO: implement projection
    const user = await this.findOne(
      { _id: userId },
      {
        projection: {
          [methodName]: 1,
        },
      }
    );

    return user ? user[methodName] : null;
  }

  async removeAuthenticationStrategyData(
    userId: any,
    methodName: string
  ): Promise<void> {
    await this.updateOne(
      { _id: userId },
      {
        $unset: {
          [methodName]: 1,
        },
      }
    );
  }
}

import {
  Bundle,
  EventManager,
  BundleBeforePrepareEvent,
  Constructor,
} from "@kaviar/core";
import { SecurityBundle } from "@kaviar/security-bundle";
import { UsersCollection } from "./collections/Users.collection";
import { PermissionsCollection } from "./collections/Permissions.collection";
import { SessionsCollection } from "./collections/Sessions.collection";
import { USERS_COLLECTION } from "./constants";

interface ISecurityMongoBundleConfig {
  usersCollection?: typeof UsersCollection;
  permissionsCollection?: typeof PermissionsCollection;
  sessionsCollection?: typeof SessionsCollection;
}

export class SecurityMongoBundle extends Bundle<ISecurityMongoBundleConfig> {
  readonly dependencies = [SecurityBundle];

  protected defaultConfig = {
    usersCollection: UsersCollection,
    permissionsCollection: PermissionsCollection,
    sessionsCollection: SessionsCollection,
  };

  async hook() {
    const manager = this.get<EventManager>(EventManager);

    manager.addListener(
      BundleBeforePrepareEvent,
      (e: BundleBeforePrepareEvent) => {
        const { bundle } = e.data;
        if (bundle instanceof SecurityBundle) {
          const {
            permissionsCollection,
            usersCollection,
            sessionsCollection,
          } = this.config;

          // There is the possibility that they have been nullified
          // For example, the developer may want to replace a certain interface with something else
          permissionsCollection &&
            bundle.setPermissionPersistance(permissionsCollection);
          usersCollection && bundle.setUserPersistence(usersCollection);
          sessionsCollection &&
            bundle.setSessionPersistance(sessionsCollection);
        }
      }
    );
  }

  async prepare() {
    this.container.set({
      id: USERS_COLLECTION,
      type: this.config.usersCollection,
    });
  }
}

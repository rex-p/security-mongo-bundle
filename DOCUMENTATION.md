<h1 align="center">KAVIAR SECURITY-MONGO-BUNDLE</h1>

<p align="center">
  <a href="https://travis-ci.org/kaviarjs/security-mongo-bundle">
    <img src="https://api.travis-ci.org/kaviarjs/security-mongo-bundle.svg?branch=master" />
  </a>
  <a href="https://coveralls.io/github/kaviarjs/security-mongo-bundle?branch=master">
    <img src="https://coveralls.io/repos/github/kaviarjs/security-mongo-bundle/badge.svg?branch=master" />
  </a>
</p>

In this bundle we're overriding the persistence layers from SecurityBundle to make them work with MongoBundle.

## Installation

```bash
npm i -S @kaviar/security-bundle @kaviar-security-mongo-bundle
```

```js
import { SecurityBundle } from "@kaviar/security-bundle";
import { SecurityMongoBundle } from "@kaviar/security-mongo-bundle";

kernel.addBundle(
  new SecurityBundle({
    // options
  }),
  // Order doesn't really matter.
  new SecurityMongoBundle()
);
```

## Overriding

You have the option to make changes to your collection, for example if you user is linked to other collections or you simply want a different collectio name:

```typescript
import {
  UsersCollection,
  PermissionsCollection,
} from "@kaviar/security-mongo-bundle";
import { IUser } from "@kaviar/security-bundle";

// We make the type behave with all of our needs
interface IAppUser extends IUser {
  profileId: ObjectID;
}

class AppUsersCollection extends UsersCollection<IAppUser> {
  static collectionName = "User"; // override it, by default it's users

  static links = {
    profile: {
      collection: () => ProfilesCollection,
      field: "profileId",
    },
  };

  static indexes = [
    {
      key: {
        profileId: 1,
      },
    },
  ];
}
```

```typescript
new SecurityMongoBundle({
  usersCollection: AppUsersCollection,
});
```

# Nest Mongoose

A simple helper library to inject [mongoose](http://mongoosejs.com/) models
into components created with [nest](https://github.com/nestjs/nest).

Written in Typescript.

## Goals of this project

The primary goal is to inject mongoose models into components. In order to keep
the code clean and simple this library offers wrapper classes around the mongoose model which
can be configured on module level and be injected.

## Relevant URLs

- [mongoose](http://mongoosejs.com/)
- [nest](https://github.com/nestjs/nest)

## Requirments

- Node `>= 8.0.0`
- Typescript `>= 2.4.0`
- Nest `>= 4.0.0`
- mongoose `>= 4.11.0`

## Setup

Just install the package via npm/yarn.

`npm install --save nest-mongoose`

## Usage

In order to use a mongoose model we define some interfaces first.
The first interfaces defines the used document structure of the mongodb (Figure **1.0**).

```typescript
import {Document} from 'mongoose';

export interface UserDocument extends Document {
  readonly name: string;
  readonly age: number;
}
```
**Figure 1.0: Document interface (user-document.ts)**

The next step is to define our schema and name our mongoose model by calling the super constructor.

**nest-mongoose** offers an abstract class which minifies the effort to create your model(Figure **1.1**).

We override the `defineSchema` method which must return our mongodb schema.

```typescript
import {Component} from '@nestjs/common';
import {Schema, Types} from 'mongoose';
import {NestMongooseModel} from 'nest-mongoose';

import {UserDocument} from './user-document';

@Component()
export class UserModel extends NestMongooseModel<UserDocument> {

  constructor() {
    super('user');
  }

  protected defineSchema(): Schema {
    const schema: Schema = new Schema({
      name: {
        type: String,
      },
      age: {
        type: Number,
      },
    });

    return schema;
  }

}
```
**Figure 1.1: Model class (user-model.ts)**

Afterwards we configure our model in the module file (Figure **1.2**).

```typescript
import {Module} from '@nestjs/common';

import {UserModel} from './user-model';

@Module({
  components: [
    {provide: 'UserModel', useClass: UserModel},
  ],
})
export class ExampleModule {}
```
**Figure 1.2: Module configuration**

Now we can inject the model into components and use the inner mongoose model to query and write data via mongoose (Figure **1.3**).

```typescript
import {Component, Inject} from '@nestjs/common';
import {Model} from 'mongoose';

import {User, UserRepository} from './interfaces';

import {UserDocument} from './example-document';
import {UserModel} from './example-model';

@Component()
export class UserMongoRepository implements UserRepository {

  private readonly user: Model<UserDocument>;

  constructor(
    @Inject('UserModel') nestUserModel: UserModel,
  ) {
    this.user = nestUserModel.mongooseModel;
  }

  public findAllUsers(): Promise<Array<User>> {
    const users: Array<User> = <Array<User>> this.user.find()
      .lean()
      .exec();
    
    return users;
  }
}
```
**Figure 1.3: Repository component**

At last we need to assign a mongoose connection to our model. This happens by assigning it to the
static property `connection`. This step should be done when the mongoose connection has been established.

```typescript
mongoose.connection.once('open', async() => {
  NestMongooseModel.connection = mongoose.connection;

  const listenPort: number = 4000;

  const app: INestApplication = await NestFactory.create(ApplicationModule);

  await app.listen(listenPort);
});
```

## Related projects

- [mongoose](http://mongoosejs.com/)
- [nest](https://github.com/nestjs/nest)

## License

MIT

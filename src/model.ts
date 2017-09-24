import * as mongoose from 'mongoose';

import {Document, Model, Schema} from 'mongoose';

/**
 * Wrapper around a T typed mongoose model.
 * Can be injected by the nest IoC container.
 *
 * @author Julian Biermann <julian.bier89@gmail.com>
 * @export
 * @abstract
 * @class NestMongooseModel
 * @template T Specific type which must be a mongoose Document type.
 */
export abstract class NestMongooseModel<T extends Document> {

  public readonly mongooseModel: Model<T>;

  /**
   * Creates an instance of NestMongooseModel.
   * @constructor
   * @param {string} modelName - Name of the mongoose model used in the model(modelName, schema) function.
   * @memberof NestMongooseModel
   */
  constructor(modelName: string) {
    this.mongooseModel = this.createModel(modelName);
  }

  private createModel(modelName: string): Model<T> {
    const schema: Schema = this.defineSchema();
    const model: Model<T> = mongoose.connection.model(modelName, schema);

    return model;
  }

  /**
   * Returns a mongodb schema which is used by the model creation of mongoose.
   *
   * @protected
   * @abstract
   * @returns {Schema} The user defined mongodb schema.
   * @memberof NestMongooseModel
   */
  protected abstract defineSchema(): Schema;

}

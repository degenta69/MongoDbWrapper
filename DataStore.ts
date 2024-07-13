import { MongoClient, Db, Collection, Document, Filter, UpdateFilter, Sort, ClientSession, FindOptions, WithId, OptionalUnlessRequiredId } from 'mongodb';

// Types
type DataStoreConfig = {
  url: string;
  dbName: string;
};

type QueryOptions<T extends Document> = {
  filter?: Filter<T>;
  skip?: number;
  limit?: number;
  sort?: Sort;
  projection?: Document;
};

class MongoDBWrapper {
  private client: MongoClient;
  private db: Db;

  constructor(private config: DataStoreConfig) {
    this.client = new MongoClient(config.url);
    this.db = this.client.db(config.dbName);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.close();
    } catch (error) {
      console.error("Failed to disconnect from MongoDB", error);
      throw error;
    }
  }

  async executeInTransaction<T>(func: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = this.client.startSession();
    try {
      session.startTransaction();
      const result = await func(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async insertOne<T extends Document>(collectionName: string, doc: OptionalUnlessRequiredId<T>): Promise<WithId<T>> {
    const collection = this.getCollection<T>(collectionName);
    const result = await collection.insertOne(doc);
    return { ...doc, _id: result.insertedId } as WithId<T>;
  }

  async insertMany<T extends Document>(collectionName: string, docs: OptionalUnlessRequiredId<T>[]): Promise<WithId<T>[]> {
    const collection = this.getCollection<T>(collectionName);
    const result = await collection.insertMany(docs);
    return docs.map((doc, index) => ({ ...doc, _id: result.insertedIds[index] })) as WithId<T>[];
  }

  async updateOne<T extends Document>(collectionName: string, query: QueryOptions<T>, update: UpdateFilter<T>): Promise<void> {
    const collection = this.getCollection<T>(collectionName);
    await collection.updateOne(query.filter || {}, update);
  }

  async updateMany<T extends Document>(collectionName: string, query: QueryOptions<T>, update: UpdateFilter<T>): Promise<void> {
    const collection = this.getCollection<T>(collectionName);
    await collection.updateMany(query.filter || {}, update);
  }

  async findOne<T extends Document>(collectionName: string, query: QueryOptions<T>): Promise<T | null> {
    const collection = this.getCollection<T>(collectionName);
    const options: FindOptions = {
      skip: query.skip,
      sort: query.sort,
      projection: query.projection,
    };
    return await collection.findOne(query.filter || {}, options) as T | null;
  }

  async find<T extends Document>(collectionName: string, query: QueryOptions<T>): Promise<T[]> {
    const collection = this.getCollection<T>(collectionName);
    const options: FindOptions = {
      skip: query.skip,
      limit: query.limit,
      sort: query.sort,
      projection: query.projection,
    };
    return await collection.find(query.filter || {}, options).toArray() as T[];
  }

  async deleteOne<T extends Document>(collectionName: string, query: QueryOptions<T>): Promise<void> {
    const collection = this.getCollection<T>(collectionName);
    await collection.deleteOne(query.filter || {});
  }

  async deleteMany<T extends Document>(collectionName: string, query: QueryOptions<T>): Promise<void> {
    const collection = this.getCollection<T>(collectionName);
    await collection.deleteMany(query.filter || {});
  }

  async count<T extends Document>(collectionName: string, query: QueryOptions<T>): Promise<number> {
    const collection = this.getCollection<T>(collectionName);
    return await collection.countDocuments(query.filter || {});
  }

  // Query builder functions
  static createQuery<T extends Document>(options: QueryOptions<T> = {}): QueryOptions<T> {
    return options;
  }

  static withFilter<T extends Document>(query: QueryOptions<T>, filter: Filter<T>): QueryOptions<T> {
    return { ...query, filter };
  }

  static withSkip<T extends Document>(query: QueryOptions<T>, skip: number): QueryOptions<T> {
    return { ...query, skip };
  }

  static withLimit<T extends Document>(query: QueryOptions<T>, limit: number): QueryOptions<T> {
    return { ...query, limit };
  }

  static withSort<T extends Document>(query: QueryOptions<T>, sort: Sort): QueryOptions<T> {
    return { ...query, sort };
  }

  static withProjection<T extends Document>(query: QueryOptions<T>, projection: Document): QueryOptions<T> {
    return { ...query, projection };
  }

  private getCollection<T extends Document>(name: string): Collection<T> {
    return this.db.collection<T>(name);
  }
}

export {
  DataStoreConfig,
  QueryOptions,
  MongoDBWrapper,
};

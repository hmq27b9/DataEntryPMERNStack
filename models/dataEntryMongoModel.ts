//models/dataEntryMongoModel.ts
import { ObjectId, Document } from "mongodb";
import { getMongoDb } from "../config/mongo";

export interface DataEntryMongo extends Document {
  _id: ObjectId;
  field_a: string;
  field_b: string;
  field_c: string | null;
  created_at: Date;
  updated_at: Date;
}

interface DataEntryMongoInput {
  field_a: string;
  field_b: string;
  field_c?: string | null;
}

const COLLECTION = "data_entry_mongo";

const DataEntryMongoModel = {
  async findAll(): Promise<DataEntryMongo[]> {
    const db = await getMongoDb();
    return db
      .collection<DataEntryMongo>(COLLECTION)
      .find({})
      .sort({ created_at: 1 })
      .toArray();
  },

  async findById(id: string): Promise<DataEntryMongo | null> {
    const db = await getMongoDb();
    return db
      .collection<DataEntryMongo>(COLLECTION)
      .findOne({ _id: new ObjectId(id) });
  },

  async create(input: DataEntryMongoInput): Promise<DataEntryMongo> {
    const db = await getMongoDb();
    const now = new Date();
    const doc = {
      field_a: input.field_a,
      field_b: input.field_b,
      field_c: input.field_c ?? null,
      created_at: now,
      updated_at: now,
    };
    const result = await db.collection(COLLECTION).insertOne(doc);
    return { ...doc, _id: result.insertedId } as DataEntryMongo;
  },

  async update(
    id: string,
    input: DataEntryMongoInput,
  ): Promise<DataEntryMongo | null> {
    const db = await getMongoDb();
    const result = await db
      .collection<DataEntryMongo>(COLLECTION)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            field_a: input.field_a,
            field_b: input.field_b,
            field_c: input.field_c ?? null,
            updated_at: new Date(),
          },
        },
        { returnDocument: "after" },
      );
    return result;
  },

  async remove(id: string): Promise<void> {
    const db = await getMongoDb();
    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  },
};

export default DataEntryMongoModel;

//controllers/dataEntryMongoController.ts
import { Request, Response } from "express";
import DataEntryMongoModel from "../models/dataEntryMongoModel";
import { ObjectId } from "mongodb";

export const list = async (_req: Request, res: Response): Promise<void> => {
  try {
    const entries = await DataEntryMongoModel.findAll();
    // Map _id to a string id for the frontend
    const mapped = entries.map((e) => ({
      id: e._id.toString(),
      field_a: e.field_a,
      field_b: e.field_b,
      field_c: e.field_c,
      created_at: e.created_at,
      updated_at: e.updated_at,
    }));
    res.json({ entries: mapped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const { field_a, field_b, field_c } = req.body as {
    field_a?: string;
    field_b?: string;
    field_c?: string;
  };

  if (!field_a || !field_b) {
    res.status(400).json({ error: "field_a and field_b are required" });
    return;
  }

  try {
    const entry = await DataEntryMongoModel.create({
      field_a,
      field_b,
      field_c,
    });
    res.status(201).json({
      entry: {
        id: entry._id.toString(),
        field_a: entry.field_a,
        field_b: entry.field_b,
        field_c: entry.field_c,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const raw = req.params.id;
  const id = Array.isArray(raw) ? raw[0] : raw;

  if (!id || !ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const { field_a, field_b, field_c } = req.body as {
    field_a?: string;
    field_b?: string;
    field_c?: string;
  };

  if (!field_a || !field_b) {
    res.status(400).json({ error: "field_a and field_b are required" });
    return;
  }

  try {
    const entry = await DataEntryMongoModel.update(id, {
      field_a,
      field_b,
      field_c,
    });
    if (!entry) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }
    res.json({
      entry: {
        id: entry._id.toString(),
        field_a: entry.field_a,
        field_b: entry.field_b,
        field_c: entry.field_c,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const raw = req.params.id;
  const id = Array.isArray(raw) ? raw[0] : raw;

  if (!id || !ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    await DataEntryMongoModel.remove(id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

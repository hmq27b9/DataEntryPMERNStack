//controllers/dataEntryPostgresController.ts
import { Request, Response } from "express";
import DataEntryPostgresModel from "../models/dataEntryPostgresModel";

export const list = async (_req: Request, res: Response): Promise<void> => {
  try {
    const entries = await DataEntryPostgresModel.findAll();
    res.json({ entries });
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
    const entry = await DataEntryPostgresModel.create({
      field_a,
      field_b,
      field_c,
    });
    res.status(201).json({ entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const raw = req.params.id;
  const id = Array.isArray(raw) ? raw[0] : raw;

  if (!id) {
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
    const entry = await DataEntryPostgresModel.update(id, {
      field_a,
      field_b,
      field_c,
    });
    if (!entry) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }
    res.json({ entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const raw = req.params.id;
  const id = Array.isArray(raw) ? raw[0] : raw;

  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    await DataEntryPostgresModel.remove(id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

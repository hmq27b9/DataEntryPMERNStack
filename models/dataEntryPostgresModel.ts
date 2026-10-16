//models/dataEntryPostgresModel.ts
import pool from "../config/db";

export interface DataEntryPostgres {
  id: string;
  field_a: string;
  field_b: string;
  field_c: string | null;
  created_at: Date;
  updated_at: Date;
}

interface DataEntryPostgresInput {
  field_a: string;
  field_b: string;
  field_c?: string | null;
}

const DataEntryPostgresModel = {
  async findAll(): Promise<DataEntryPostgres[]> {
    const result = await pool.query<DataEntryPostgres>(
      "SELECT * FROM data_entry_postgres ORDER BY created_at ASC, id ASC",
    );
    return result.rows;
  },

  async findById(id: string): Promise<DataEntryPostgres | undefined> {
    const result = await pool.query<DataEntryPostgres>(
      "SELECT * FROM data_entry_postgres WHERE id = $1",
      [id],
    );
    return result.rows[0];
  },

  async create({
    field_a,
    field_b,
    field_c,
  }: DataEntryPostgresInput): Promise<DataEntryPostgres> {
    const result = await pool.query<DataEntryPostgres>(
      `INSERT INTO data_entry_postgres (field_a, field_b, field_c)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [field_a, field_b, field_c ?? null],
    );
    return result.rows[0];
  },

  async update(
    id: string,
    input: DataEntryPostgresInput,
  ): Promise<DataEntryPostgres | undefined> {
    const result = await pool.query<DataEntryPostgres>(
      `UPDATE data_entry_postgres
       SET field_a = $1, field_b = $2, field_c = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [input.field_a, input.field_b, input.field_c ?? null, id],
    );
    return result.rows[0];
  },

  async remove(id: string): Promise<void> {
    await pool.query("DELETE FROM data_entry_postgres WHERE id = $1", [id]);
  },
};

export default DataEntryPostgresModel;

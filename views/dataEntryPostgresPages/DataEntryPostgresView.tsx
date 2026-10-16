//views/dataEntryPostgresPages/DataEntryPostgresView.tsx
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

interface DataEntryPostgres {
  id: string;
  field_a: string;
  field_b: string;
  field_c: string | null;
  created_at: string;
  updated_at: string;
}

type FieldKey = "field_a" | "field_b" | "field_c";

interface DraftRow {
  id: string | null;
  field_a: string;
  field_b: string;
  field_c: string;
  dirty: boolean;
}

const EMPTY_ROW: DraftRow = {
  id: null,
  field_a: "",
  field_b: "",
  field_c: "",
  dirty: false,
};

const COLUMNS: { key: FieldKey; label: string; required: boolean }[] = [
  { key: "field_a", label: "field_a", required: true },
  { key: "field_b", label: "field_b", required: true },
  { key: "field_c", label: "field_c", required: false },
];

const shortId = (id: string) => id.slice(0, 8);

export default function DataEntryPostgresView() {
  const { token } = useAuth();
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  useEffect(() => {
    fetch("/api/data-entry-postgres", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load");
        const data = (await res.json()) as { entries: DataEntryPostgres[] };
        setRows(
          data.entries.map((r) => ({
            id: r.id,
            field_a: r.field_a,
            field_b: r.field_b,
            field_c: r.field_c ?? "",
            dirty: false,
          })),
        );
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, [token]);

  const setRef =
    (rowKey: string, field: FieldKey) => (el: HTMLInputElement | null) => {
      if (el) inputRefs.current.set(`${rowKey}:${field}`, el);
    };

  const updateCell = (rowIndex: number, field: FieldKey, value: string) => {
    setRows((prev) => {
      const next = [...prev];
      next[rowIndex] = { ...next[rowIndex], [field]: value, dirty: true };
      return next;
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    field: FieldKey,
  ) => {
    const fieldIdx = COLUMNS.findIndex((c) => c.key === field);

    if (e.key === "Enter") {
      e.preventDefault();
      if (fieldIdx < COLUMNS.length - 1) {
        focusCell(rowIndex, COLUMNS[fieldIdx + 1].key);
      } else if (rowIndex < rows.length - 1) {
        focusCell(rowIndex + 1, COLUMNS[0].key);
      } else {
        addRow();
      }
    } else if (
      e.key === "Tab" &&
      e.shiftKey &&
      fieldIdx === 0 &&
      rowIndex > 0
    ) {
      e.preventDefault();
      focusCell(rowIndex - 1, COLUMNS[COLUMNS.length - 1].key);
    } else if (
      e.key === "Tab" &&
      !e.shiftKey &&
      fieldIdx === COLUMNS.length - 1 &&
      rowIndex < rows.length - 1
    ) {
      e.preventDefault();
      focusCell(rowIndex + 1, COLUMNS[0].key);
    } else if (e.key === "Escape") {
      (e.target as HTMLInputElement).blur();
    }
  };

  const focusCell = (rowIndex: number, field: FieldKey) => {
    const row = rows[rowIndex];
    if (!row) return;
    const key = row.id ?? `new-${rowIndex}`;
    inputRefs.current.get(`${key}:${field}`)?.focus();
  };

  const addRow = () => {
    setRows((prev) => [...prev, { ...EMPTY_ROW }]);
    requestAnimationFrame(() => {
      const idx = rows.length;
      inputRefs.current.get(`new-${idx}:field_a`)?.focus();
    });
  };

  const removeRow = async (rowIndex: number) => {
    const row = rows[rowIndex];
    if (row.id !== null) {
      const res = await fetch(`/api/data-entry-postgres/${row.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError("Delete failed");
        return;
      }
    }
    setRows((prev) => prev.filter((_, i) => i !== rowIndex));
  };

  const saveRow = async (rowIndex: number) => {
    const row = rows[rowIndex];
    if (!row.dirty) return;

    if (!row.field_a || !row.field_b) {
      setError("field_a and field_b are required to save");
      return;
    }

    setSavingId(row.id);
    setError("");

    const body = JSON.stringify({
      field_a: row.field_a,
      field_b: row.field_b,
      field_c: row.field_c || null,
    });

    try {
      const res = await fetch(
        row.id === null
          ? "/api/data-entry-postgres"
          : `/api/data-entry-postgres/${row.id}`,
        {
          method: row.id === null ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body,
        },
      );

      if (!res.ok) throw new Error("Save failed");

      const data = (await res.json()) as { entry: DataEntryPostgres };
      setRows((prev) => {
        const next = [...prev];
        next[rowIndex] = {
          id: data.entry.id,
          field_a: data.entry.field_a,
          field_b: data.entry.field_b,
          field_c: data.entry.field_c ?? "",
          dirty: false,
        };
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  };

  const saveAll = async () => {
    const dirtyIndices = rows
      .map((r, i) => (r.dirty ? i : -1))
      .filter((i) => i >= 0);
    for (const i of dirtyIndices) {
      await saveRow(i);
    }
  };

  const hasDirty = rows.some((r) => r.dirty);

  return (
    <>
      <Header showLogout />
      <main style={styles.main}>
        <div style={styles.toolbar}>
          <div>
            <p style={styles.kicker}>data entry</p>
            <h1 style={styles.title}>Postgres</h1>
          </div>
          <div style={styles.actions}>
            <button style={styles.button} onClick={addRow}>
              + row
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonPrimary }}
              onClick={saveAll}
              disabled={!hasDirty}
            >
              save
            </button>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.sheetWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, ...styles.thRowNum }}>#</th>
                <th style={{ ...styles.th, ...styles.thId }}>id</th>
                {COLUMNS.map((c) => (
                  <th key={c.key} style={styles.th}>
                    {c.label}
                    {c.required && <span style={styles.req}> *</span>}
                  </th>
                ))}
                <th style={{ ...styles.th, ...styles.thAction }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={COLUMNS.length + 3} style={styles.emptyCell}>
                    loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length + 3} style={styles.emptyCell}>
                    no entries — click "+ row" to add one
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => {
                  const rowKey = row.id ?? `new-${rowIndex}`;
                  const isSaving = row.id !== null && savingId === row.id;
                  return (
                    <tr
                      key={rowKey}
                      style={row.dirty ? styles.dirtyRow : undefined}
                    >
                      <td style={{ ...styles.td, ...styles.tdRowNum }}>
                        {rowIndex + 1}
                      </td>
                      <td
                        style={{ ...styles.td, ...styles.tdId }}
                        title={row.id ?? "unsaved"}
                      >
                        {row.id ? shortId(row.id) : "—"}
                      </td>
                      {COLUMNS.map((c) => (
                        <td key={c.key} style={styles.td}>
                          <input
                            ref={setRef(rowKey, c.key)}
                            style={styles.cell}
                            value={row[c.key]}
                            onChange={(e) =>
                              updateCell(rowIndex, c.key, e.target.value)
                            }
                            onBlur={() => saveRow(rowIndex)}
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, c.key)}
                            disabled={isSaving}
                          />
                        </td>
                      ))}
                      <td style={{ ...styles.td, ...styles.tdAction }}>
                        <button
                          style={styles.iconButton}
                          onClick={() => removeRow(rowIndex)}
                          title="delete row"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p style={styles.hint}>
          enter to move right · tab / shift+tab to navigate · esc to blur · blur
          saves
        </p>
      </main>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    padding: "2.5rem 1.5rem 4rem",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "1.5rem",
    gap: "1rem",
    flexWrap: "wrap",
  },
  kicker: {
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    marginBottom: "0.35rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 400,
    letterSpacing: "-0.01em",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  button: {
    padding: "0.5rem 0.9rem",
    background: "transparent",
    color: "#000",
    border: "1px solid #000",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  buttonPrimary: {
    background: "#000",
    color: "#fff",
  },
  error: {
    fontSize: "0.8rem",
    borderLeft: "2px solid #000",
    paddingLeft: "0.75rem",
    marginBottom: "1rem",
  },
  sheetWrap: {
    border: "1px solid #000",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
    tableLayout: "fixed",
  },
  th: {
    textAlign: "left",
    padding: "0.6rem 0.75rem",
    borderBottom: "1px solid #000",
    borderRight: "1px solid #000",
    fontWeight: 400,
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    background: "#fff",
    whiteSpace: "nowrap",
  },
  thRowNum: {
    width: "48px",
    textAlign: "right",
  },
  thId: {
    width: "100px",
    fontVariantNumeric: "tabular-nums",
  },
  thAction: {
    width: "40px",
    borderRight: "none",
  },
  td: {
    padding: 0,
    borderBottom: "1px solid #000",
    borderRight: "1px solid #000",
    verticalAlign: "middle",
  },
  tdRowNum: {
    padding: "0.5rem 0.75rem",
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
  tdId: {
    padding: "0.5rem 0.75rem",
    fontVariantNumeric: "tabular-nums",
    fontSize: "0.75rem",
    opacity: 0.6,
  },
  tdAction: {
    borderRight: "none",
    textAlign: "center",
    width: "40px",
  },
  cell: {
    width: "100%",
    padding: "0.5rem 0.75rem",
    border: "none",
    background: "transparent",
    fontSize: "0.85rem",
    fontFamily: "inherit",
    outline: "none",
  },
  iconButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    padding: "0.25rem 0.5rem",
    lineHeight: 1,
  },
  dirtyRow: {
    background: "#f5f5f5",
  },
  emptyCell: {
    padding: "2rem",
    textAlign: "center",
    fontSize: "0.8rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  hint: {
    marginTop: "0.75rem",
    fontSize: "0.7rem",
    letterSpacing: "0.05em",
    opacity: 0.6,
  },
  req: {
    opacity: 0.6,
  },
};

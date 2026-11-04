import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

interface DataEntryMongo {
  id: string;
  field_a: string;
  field_b: string;
  field_c: string | null;
}

interface DraftRow {
  id: string | null;
  field_a: string;
  field_b: string;
  field_c: string;
  dirty: boolean;
}

const EMPTY_ROW: DraftRow = {
  id: null,
  field_a: '',
  field_b: '',
  field_c: '',
  dirty: false,
};

const COLUMNS = [
  { key: 'field_a', label: 'field_a', required: true },
  { key: 'field_b', label: 'field_b', required: true },
  { key: 'field_c', label: 'field_c', required: false },
];

export default function DataEntryMongoScreen() {
  const { token } = useAuth();
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/data-entry-mongo`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setRows(
          data.entries.map((r: DataEntryMongo) => ({
            id: r.id,
            field_a: r.field_a,
            field_b: r.field_b,
            field_c: r.field_c ?? '',
            dirty: false,
          })),
        );
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const updateCell = (index: number, field: string, value: string) => {
    setRows(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value, dirty: true };
      return next;
    });
  };

  const addRow = () => {
    setRows([...rows, { ...EMPTY_ROW }]);
  };

  const saveRow = async (index: number) => {
    const row = rows[index];
    if (!row.dirty) return;
    if (!row.field_a || !row.field_b) {
      setError('field_a and field_b are required');
      return;
    }

    const body = JSON.stringify({
      field_a: row.field_a,
      field_b: row.field_b,
      field_c: row.field_c || null,
    });

    try {
      const res = await fetch(
        row.id === null
          ? `${API_URL}/api/data-entry-mongo`
          : `${API_URL}/api/data-entry-mongo/${row.id}`,
        {
          method: row.id === null ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body,
        },
      );

      if (!res.ok) throw new Error('Save failed');

      const data = await res.json();
      setRows(prev => {
        const next = [...prev];
        next[index] = {
          id: data.entry.id,
          field_a: data.entry.field_a,
          field_b: data.entry.field_b,
          field_c: data.entry.field_c ?? '',
          dirty: false,
        };
        return next;
      });
    } catch (e: any) {
      setError(e.message);
    }
  };

  const deleteRow = async (index: number) => {
    const row = rows[index];
    if (row.id !== null) {
      await fetch(`${API_URL}/api/data-entry-mongo/${row.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setRows(rows.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ScrollView horizontal>
        <View>
          <View style={styles.row}>
            <View style={[styles.cell, styles.cellIndex]}>
              <Text style={styles.headerText}>#</Text>
            </View>
            {COLUMNS.map(c => (
              <View key={c.key} style={styles.cell}>
                <Text style={styles.headerText}>
                  {c.label}
                  {c.required && <Text style={styles.req}> *</Text>}
                </Text>
              </View>
            ))}
            <View style={[styles.cell, styles.cellAction]} />
          </View>

          <ScrollView>
            {loading ? (
              <Text style={{ padding: 16 }}>loading...</Text>
            ) : (
              rows.map((row, rowIndex) => (
                <View key={row.id ?? `new-${rowIndex}`} style={styles.row}>
                  <View style={[styles.cell, styles.cellIndex]}>
                    <Text style={styles.indexText}>{rowIndex + 1}</Text>
                  </View>
                  {COLUMNS.map(c => (
                    <View key={c.key} style={styles.cell}>
                      <TextInput
                        style={styles.input}
                        value={(row as any)[c.key]}
                        onChangeText={val => updateCell(rowIndex, c.key, val)}
                        onBlur={() => saveRow(rowIndex)}
                      />
                    </View>
                  ))}
                  <View style={[styles.cell, styles.cellAction]}>
                    <TouchableOpacity onPress={() => deleteRow(rowIndex)}>
                      <Text style={styles.deleteText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={addRow}>
          <Text style={styles.buttonText}>+ row</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={() => {
            rows.forEach((_, i) => saveRow(i));
          }}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>save all</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  error: {
    color: '#000',
    borderLeftWidth: 2,
    borderLeftColor: '#000',
    paddingLeft: 8,
    margin: 16,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  cell: {
    width: 140,
    borderRightWidth: 1,
    borderRightColor: '#000',
    justifyContent: 'center',
  },
  cellIndex: {
    width: 40,
    alignItems: 'center',
  },
  cellAction: {
    width: 40,
    borderRightWidth: 0,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    padding: 8,
    fontWeight: '600',
  },
  req: {
    opacity: 0.5,
  },
  indexText: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  input: {
    padding: 8,
    fontSize: 14,
    height: 40,
  },
  deleteText: {
    fontSize: 20,
    fontWeight: '300',
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#000',
    backgroundColor: '#fff',
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#000',
  },
  buttonText: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});

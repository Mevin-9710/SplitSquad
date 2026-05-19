import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection.js';
import logger from '../utils/logger.js';

const DEFAULT_CATEGORIES = ['friends', 'family', 'co-workers'];

export function getCategories() {
  return [...DEFAULT_CATEGORIES];
}

export function addContact(name, phone, category, createdBy) {
  const db = getDatabase();
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  try {
    db.run(
      `INSERT INTO contacts (id, name, phone, category, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, phone, category, createdBy, createdAt]
    );
    logger.debug('Added contact', { id, name, category, createdBy });
    return id;
  } catch (error) {
    logger.error('Failed to add contact', { error: error.message });
    throw error;
  }
}

export function getContactsByCategory(category, createdBy) {
  const db = getDatabase();

  try {
    const result = db.exec(
      `SELECT id, name, phone, category, created_by, created_at
       FROM contacts
       WHERE category = ? AND created_by = ?
       ORDER BY name ASC`,
      [category, createdBy]
    );

    if (result.length === 0) return [];
    return result[0].values.map((row) => objectFromRow(result[0].columns, row));
  } catch (error) {
    logger.error('Failed to get contacts by category', { category, error: error.message });
    throw error;
  }
}

export function getAllContacts(createdBy) {
  const db = getDatabase();

  try {
    const result = db.exec(
      `SELECT id, name, phone, category, created_by, created_at
       FROM contacts
       WHERE created_by = ?
       ORDER BY category, name ASC`,
      [createdBy]
    );

    if (result.length === 0) return [];
    return result[0].values.map((row) => objectFromRow(result[0].columns, row));
  } catch (error) {
    logger.error('Failed to get all contacts', { error: error.message });
    throw error;
  }
}

export function getContactById(id, createdBy) {
  const db = getDatabase();

  try {
    const result = db.exec(
      `SELECT id, name, phone, category, created_by, created_at
       FROM contacts
       WHERE id = ? AND created_by = ?`,
      [id, createdBy]
    );

    if (result.length === 0 || result[0].values.length === 0) return null;
    return objectFromRow(result[0].columns, result[0].values[0]);
  } catch (error) {
    logger.error('Failed to get contact by ID', { id, error: error.message });
    throw error;
  }
}

export function deleteContact(id, createdBy) {
  const db = getDatabase();

  try {
    db.run(`DELETE FROM contacts WHERE id = ? AND created_by = ?`, [id, createdBy]);
    logger.debug('Deleted contact', { id, createdBy });
    return true;
  } catch (error) {
    logger.error('Failed to delete contact', { error: error.message });
    throw error;
  }
}

export function getContactsByIds(ids, createdBy) {
  const db = getDatabase();

  if (!ids || ids.length === 0) return [];

  try {
    const placeholders = ids.map(() => '?').join(',');
    const result = db.exec(
      `SELECT id, name, phone, category, created_by, created_at
       FROM contacts
       WHERE id IN (${placeholders}) AND created_by = ?`,
      [...ids, createdBy]
    );

    if (result.length === 0) return [];
    return result[0].values.map((row) => objectFromRow(result[0].columns, row));
  } catch (error) {
    logger.error('Failed to get contacts by IDs', { error: error.message });
    throw error;
  }
}

function objectFromRow(columns, values) {
  const obj = {};
  columns.forEach((col, i) => {
    obj[col] = values[i];
  });
  return obj;
}

export default {
  getCategories,
  addContact,
  getContactsByCategory,
  getAllContacts,
  getContactById,
  deleteContact,
  getContactsByIds,
};

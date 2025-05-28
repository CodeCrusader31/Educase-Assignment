// controllers/schoolController.js
import db from '../config/db.js';
import getDistance from '../utils/distance.js';

export const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: "School added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM schools');

    const sorted = rows
      .map(school => ({
        ...school,
        distance: getDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          parseFloat(school.latitude),
          parseFloat(school.longitude)
        )
      }))
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(sorted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSchool = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM schools WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "School not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSchool = async (req, res) => {
  const { id } = req.params;
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.execute(
      'UPDATE schools SET name = ?, address = ?, latitude = ?, longitude = ? WHERE id = ?',
      [name, address, latitude, longitude, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "School not found" });
    }

    res.status(200).json({ message: "School updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSchool = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM schools WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "School not found" });
    }

    res.status(200).json({ message: "School deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const searchSchools = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM schools WHERE name LIKE ? OR address LIKE ?',
      [`%${query}%`, `%${query}%`]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No schools found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
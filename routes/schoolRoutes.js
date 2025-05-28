import express from 'express';
import {
  addSchool,
  listSchools,
  getSchool,
  updateSchool,
  deleteSchool,
  searchSchools
} from '../controllers/schoolController.js';

const router = express.Router();

// Add a new school
router.post('/addSchool', addSchool);

// Get all schools sorted by distance
router.get('/listSchools', listSchools);

// Search schools by name or address
router.get('/searchschools', searchSchools);

// Get a single school by ID
router.get('/school/:id', getSchool);

// Update a school by ID
router.put('/school/:id', updateSchool);

// Delete a school by ID
router.delete('/school/:id', deleteSchool);

export default router;

import mongoose from 'mongoose';
import Task from '../models/Task.js';

const validStatuses = ['todo', 'in_progress', 'done'];
const validPriorities = ['low', 'medium', 'high'];
const isValidId = (id) => mongoose.isValidObjectId(id);

export async function createTask(req, res, next) {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    if (typeof title !== 'string' || !title.trim()) return res.status(400).json({ message: 'Title is required and cannot be empty.' });
    if (priority !== undefined && !validPriorities.includes(priority)) return res.status(400).json({ message: 'Priority must be low, medium, or high.' });
    if (status !== undefined && !validStatuses.includes(status)) return res.status(400).json({ message: 'Status must be todo, in_progress, or done.' });
    if (dueDate !== undefined && dueDate !== null && (Number.isNaN(Date.parse(dueDate)))) return res.status(400).json({ message: 'Due date must be a valid date.' });
    const task = await Task.create({ title: title.trim(), description, priority, status, dueDate: dueDate || null });
    res.status(201).json(task);
  } catch (error) { next(error); }
}

export async function getTasks(req, res, next) {
  try {
    const { status, sortBy = 'createdAt', order = 'asc' } = req.query;
    const allowedSorts = ['dueDate', 'priority', 'createdAt'];
    if (status && !validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status filter.' });
    if (!allowedSorts.includes(sortBy)) return res.status(400).json({ message: 'sortBy must be dueDate, priority, or createdAt.' });
    if (!['asc', 'desc'].includes(order)) return res.status(400).json({ message: 'order must be asc or desc.' });
    let tasks;
    if (sortBy === 'priority') {
      const direction = order === 'asc' ? 1 : -1;
      tasks = await Task.aggregate([
        { $match: status ? { status } : {} },
        { $addFields: { priorityRank: { $switch: { branches: [
          { case: { $eq: ['$priority', 'low'] }, then: 1 },
          { case: { $eq: ['$priority', 'medium'] }, then: 2 },
          { case: { $eq: ['$priority', 'high'] }, then: 3 }
        ], default: 2 } } } },
        { $sort: { priorityRank: direction, createdAt: -1 } },
        { $project: { priorityRank: 0 } }
      ]);
    } else {
      tasks = await Task.find(status ? { status } : {}).sort({ [sortBy]: order === 'asc' ? 1 : -1 });
    }
    res.json(tasks);
  } catch (error) { next(error); }
}

export async function getTask(req, res, next) {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (error) { next(error); }
}

export async function updateTask(req, res, next) {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });
    const allowed = ['title', 'description', 'priority', 'status', 'dueDate'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (Object.keys(updates).length === 0) return res.status(400).json({ message: 'Provide at least one valid field to update.' });
    if ('title' in updates && (typeof updates.title !== 'string' || !updates.title.trim())) return res.status(400).json({ message: 'Title cannot be empty.' });
    if ('title' in updates) updates.title = updates.title.trim();
    if ('priority' in updates && !validPriorities.includes(updates.priority)) return res.status(400).json({ message: 'Priority must be low, medium, or high.' });
    if ('status' in updates && !validStatuses.includes(updates.status)) return res.status(400).json({ message: 'Status must be todo, in_progress, or done.' });
    if ('dueDate' in updates && updates.dueDate !== null && Number.isNaN(Date.parse(updates.dueDate))) return res.status(400).json({ message: 'Due date must be a valid date.' });
    if ('dueDate' in updates && !updates.dueDate) updates.dueDate = null;
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (error) { next(error); }
}

export async function deleteTask(req, res, next) {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) { next(error); }
}

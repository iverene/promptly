import { categoryService } from '../services/category.service.js';

export const categoryController = {
  async list(req, res) { res.json(await categoryService.list(req.query.folderId)); },
  async get(req, res) { res.json(await categoryService.get(req.params.id)); },
  async create(req, res) { res.status(201).json(await categoryService.create(req.body)); },
  async update(req, res) { res.json(await categoryService.update(req.params.id, req.body)); },
  async remove(req, res) { await categoryService.remove(req.params.id); res.status(204).end(); },
};


import { folderService } from '../services/folder.service.js';
import { parseArchived } from '../lib/http.js';

export const folderController = {
  async list(req, res) { res.json(await folderService.list({ search: req.query.search, archived: parseArchived(req.query.archived) })); },
  async get(req, res) { res.json(await folderService.get(req.params.id)); },
  async create(req, res) { res.status(201).json(await folderService.create(req.body)); },
  async update(req, res) { res.json(await folderService.update(req.params.id, req.body)); },
  async remove(req, res) { await folderService.remove(req.params.id); res.status(204).end(); },
};


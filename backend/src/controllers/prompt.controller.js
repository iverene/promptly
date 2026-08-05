import { promptService } from '../services/prompt.service.js';
import { parseArchived } from '../lib/http.js';

export const promptController = {
  async list(req, res) {
    res.json(await promptService.list({
      folderId: req.query.folderId, categoryId: req.query.categoryId, search: req.query.search,
      archived: parseArchived(req.query.archived),
      favorite: req.query.favorite === undefined ? undefined : req.query.favorite === 'true',
      recent: req.query.recent === 'true', limit: Math.min(Number(req.query.limit) || 50, 100),
    }));
  },
  async get(req, res) { res.json(await promptService.get(req.params.id)); },
  async create(req, res) { res.status(201).json(await promptService.create(req.body)); },
  async update(req, res) { res.json(await promptService.update(req.params.id, req.body)); },
  async remove(req, res) { await promptService.remove(req.params.id); res.status(204).end(); },
};

import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}
interface LocalApiError {
  code: string;
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();

  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    const isLocalApiError = (err: any): err is LocalApiError => {
      return typeof err.code === 'string';
    };
    try {
      const data = await fs.readFile(fullPath, 'utf-8');
      const cells: Cell[] = JSON.parse(data);
      res.send({ cells });
    } catch (error) {
      if (isLocalApiError(error)) {
        if (error.code === 'ENOENT') {
          await fs.writeFile(fullPath, '[]', 'utf-8');
          res.send({ cells: [] });
        }
      } else {
        throw error;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    const { cells }: { cells: Cell[] } = req.body;

    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
};

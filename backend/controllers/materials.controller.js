import { listMaterialsRepository } from "../repositories/materials.repository.js";

export const listMaterials = async (_req, res, next) => {
  try {
    const materials = await listMaterialsRepository();
    res.json(materials);
  } catch (err) {
    next(err);
  }
};

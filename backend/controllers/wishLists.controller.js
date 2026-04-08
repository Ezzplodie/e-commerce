import {
  createWishListRepository,
  deleteWishListItemRepository,
  getWishListByUserIdRepository,
} from "../repositories/wishLists.repository.js";

export const createWishList = async (req, res, next) => {
  try {
    const userId = req.userId;
    const variantId = Number.parseInt(req.body.variant_id, 10);

    if (Number.isNaN(variantId) || variantId <= 0) {
      return res.status(400).json({ error: "Invalid variant_id" });
    }

    const wishListItem = await createWishListRepository(userId, variantId);
    return res.status(201).json(wishListItem);
  } catch (err) {
    return next(err);
  }
};

export const getWishListByUserId = async (req, res, next) => {
  try {
    const userId = req.userId;
    const wishListItems = await getWishListByUserIdRepository(userId);

    return res.json(wishListItems);
  } catch (err) {
    return next(err);
  }
};

export const deleteWishList = async (req, res, next) => {
  try {
    const userId = req.userId;
    const variantId = Number.parseInt(req.params.variantId, 10);

    if (Number.isNaN(variantId) || variantId <= 0) {
      return res.status(400).json({ error: "Invalid variantId" });
    }

    await deleteWishListItemRepository(userId, variantId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

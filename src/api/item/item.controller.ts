import { Request, Response } from "express";
import { loggerService } from "../../services/logger.service.js";
import { itemService } from "./item.service.js";
import { ItemFilterModal } from "../../modal/item.modal.js";

export async function getItems(req: Request, res: Response) {
  try {
    const filterSortBy: ItemFilterModal = {};
    loggerService.debug("Getting items", filterSortBy);
    const items = await itemService.query(filterSortBy);
    res.json(items);
  } catch (err) {
    loggerService.error("Failed to get items", err);
    res.status(500).send({ err: "Failed to get items" });
  }
}

export async function getItemById(req: Request, res: Response): Promise<void> {
  try {
    const { itemId } = req.params;
    const item = await itemService.getById(itemId);
    res.json(item);
  } catch (err) {
    loggerService.error("Failed to get item", err);
    res.status(500).send({ err: "Failed to get item" });
  }
}

export async function addItem(req: Request, res: Response): Promise<void> {
  try {
    const itemToSave = {
      name: req.body.name || "",
    };

    const addedItem = await itemService.add(itemToSave);
    res.json(addedItem);
  } catch (err) {
    loggerService.error("Failed to add item", err);
    res.status(500).send({ err: "Failed to add item" });
  }
}

export async function updateItem(req: Request, res: Response): Promise<void> {
  try {
    const itemToSave = {
      name: req.body.name || "",
      _id: req.body._id,
    };

    const updatedItem = await itemService.update(itemToSave);
    res.json(updatedItem);
  } catch (err) {
    loggerService.error("Failed to update item", err);
    res.status(500).send({ err: "Failed to update item" });
  }
}

export async function removeItem(req: Request, res: Response): Promise<void> {
  try {
    const { itemId } = req.params;

    await itemService.remove(itemId);
    res.send();
  } catch (err) {
    loggerService.error("Failed to remove item", err);
    res.status(500).send({ err: "Failed to remove item" });
  }
}

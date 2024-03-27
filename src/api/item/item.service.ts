import { ObjectId } from "mongodb";
import { ItemFilterModal, ItemModal } from "../../modal/item.modal";
import { dbService } from "../../services/db.service";
import { loggerService } from "../../services/logger.service";

export const itemService = {
  query,
  getById,
  remove,
  add,
  update,
};

async function query(filterSortBy: ItemFilterModal = {}): Promise<ItemModal[]> {
  try {
    const criteria = _buildCriteria(filterSortBy);
    const collection = await dbService.getCollection("item");
    const items = (await collection.find(criteria).toArray()) as ItemModal[];

    return items;
  } catch (err) {
    loggerService.error("cannot find item", err);
    throw err;
  }
}

async function getById(itemId: string): Promise<ItemModal> {
  try {
    const collection = await dbService.getCollection("item");
    const item = (await collection.findOne({
      _id: new ObjectId(itemId),
    })) as ItemModal;
    return item;
  } catch (err) {
    loggerService.error(`while finding item ${itemId}`, err);
    throw err;
  }
}

async function remove(itemId: string): Promise<void> {
  try {
    const collection = await dbService.getCollection("item");
    await collection.deleteOne({ _id: new ObjectId(itemId) });
  } catch (err) {
    loggerService.error(`cannot remove item ${itemId}`, err);
    throw err;
  }
}

async function add(item: Partial<ItemModal>): Promise<ItemModal> {
  try {
    const collection = await dbService.getCollection("item");
    await collection.insertOne(item);

    return item as ItemModal;
  } catch (err) {
    loggerService.error("cannot add item", err);
    throw err;
  }
}

async function update(item: ItemModal): Promise<ItemModal> {
  try {
    const collection = await dbService.getCollection("item");

    await collection.updateOne({ _id: new ObjectId(item._id) }, { $set: item });

    return item;
  } catch (err) {
    loggerService.error(`cannot update item ${item._id}`, err);
    throw err;
  }
}

function _buildCriteria(filterSortBy: ItemFilterModal) {
  const criteria = {};
  return criteria;
}

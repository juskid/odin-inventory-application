const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validStringErr = 
    "can only contain letters, numbers, spaces, and special characters";
const lengthErr = "must be between 1 and 60 characters";
const numberErr = "must only contain numbers";
const quantityErr = "must be between 0 and 999";
const decimalErr = "Price must be a number with up to two decimal places";
const priceErr = "must be between 0 and 9999.99"

const validateItem = [
    body("name")
    .trim()
    .matches(/^[a-zA-Z0-9 '&-]+$/)
    .withMessage(`Candy name ${validStringErr}`)
    .isLength({ min: 1, max: 60 })
    .withMessage(`Candy name ${lengthErr}`),
  body("company")
    .trim()
    .matches(/^[a-zA-Z0-9 '&-]+$/)
    .withMessage(`Company ${validStringErr}`)
    .isLength({ min: 1, max: 60 })
    .withMessage(`Company ${lengthErr}`),
  body("quantity")
    .trim()
    .isNumeric()
    .withMessage(`Quantity ${numberErr}`)
    .isInt({ min: 0, max: 999 })
    .withMessage(`Quantity ${quantityErr}`),
  body("price")
    .trim()
    .matches(/^\d+(\.\d{1,2})?$/)
    .withMessage(decimalErr)
    .isFloat({ min: 0, max: 10000 })
    .withMessage(`Price ${priceErr}`),
];

async function itemsGet(req, res) {
    console.log('items test');
    const items = await db.getItems();
    const types = await db.getTypes();
    const relations = await db.getRelations();
    console.log(items);
    console.log(types);
    console.log(relations);

    res.render("items/items", { items });
}

async function createItemGet(req, res) {
    const types = await db.getTypes();
    res.render("items/createItem", { types });
}

const createItemPost = [
    validateItem,
    async (req, res) => {
        console.log('params' + req.params);
        const errors = validationResult(req);
        const types = await db.getTypes();
        if (!errors.isEmpty()) {
            return res.status(400).render("items/createItems", {
                errors: errors.array(),
                types,
            });
        }
        const { name, company, quantity, price, image_url } = req.body;
        const itemTypes = req.body.types;
        const itemId = await db.createItem(
            name,
            company,
            quantity,
            price,
            image_url
        );
        const typeIds = extractTypeIds(types, itemTypes);

        linkItemToType(itemId, typeIds);

        res.redirect("/items");
    },
];

async function itemDetailsGet(req, res) {
    const itemDetails = await db.getItemDetails(req.params.id);
    res.render("items/itemDetails", { itemDetails: itemDetails[0]})
}

async function updateItemGet(req, res) {
    const itemDetails = await db.getItemDetails(req.params.id);
    const types = await db.getTypes();
    res.render("items/updateItem", { item: itemDetails[0], types: types});
}

const updateItemPost = [
    validateItem,
    async (req, res) => {
        console.log(req.params);
        const errors = validationResult(req);
        const itemDetails = await db.getItemDetails(req.params.id);
        const types = await db.getTypes();
        if (!errors.isEmpty()) {
            return res.status(400).render("items/updateItem", {
              errors: errors.array(),
              item: itemDetails[0],
              types,
            });
          }
        const id = req.params.id;
        const { name, company, quantity, price, image_url } = req.body;
        console.log(name);
        const itemTypes = req.body.types;
        await db.updateItem(id, name, company, quantity, price, image_url);
        const typeIds = extractTypeIds(types, itemTypes);

        updateItemTypeLink(id, typeIds);

        res.redirect("/items");
    },
];

async function deleteItem(req, res) {
    console.log('deleteid' + req.params.id);
    const itemId = req.params.id;
    await db.deleteItem(itemId);
    res.redirect("/items");
}

const extractTypeIds = (types, itemTypes) => {
    const typeIds = [];
    if (!Array.isArray(itemTypes)) {
        itemTypes = itemTypes.split();
    }
    for (const itemType of itemTypes) {
        for (const type of types) {
            if (itemType === type.type) {
                typeIds.push(type.id);
            }
        }
    }
    return typeIds;
};

async function linkItemToType(itemId, typeIds) {
    for (const id of typeIds) {
        console.log(id);
        await db.linkItemToType(itemId, id);
    }
}

async function updateItemTypeLink(itemId, typeIds) {
    await db.deleteItemTypes(itemId);
    for (const id of typeIds) {
        console.log(id);
        await db.linkItemToType(itemId, id);
    }
}

module.exports = {
    itemsGet,
    createItemGet,
    createItemPost,
    itemDetailsGet,
    updateItemGet,
    updateItemPost,
    deleteItem,
};
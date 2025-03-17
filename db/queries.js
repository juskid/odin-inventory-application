const pool = require("./pool");

async function getItems() {
    console.log('queries.getItems()');
    const { rows } = await pool.query(
        `SELECT items.id AS id,
            items.name AS name,
            items.company,
            items.quantity,
            items.price,
            items.image_url,
            COALESCE(array_agg(types.type), '{}') AS types
        FROM items
        LEFT JOIN item_types ON items.id = item_types.item_id 
        LEFT JOIN types ON item_types.type_id = types.id 
        GROUP BY items.id, items.name, items.company, items.quantity, items.price;`
    );
    return rows;
}

async function getRelations() {
    const { rows } = await pool.query(`
        SELECT * FROM item_types;`
    );
    return rows; 
}

async function getTypes() {
    const { rows } = await pool.query("SELECT * FROM types;");
    return rows;
}

async function getTypeByName(type) {
    const { rows } = await pool.query("SELECT * FROM types WHERE type = $1;", [
        type,
    ]);
    return rows[0];
}

async function createItem(name, company, quantity, price, image_url) {
    const item = await pool.query(
        "INSERT INTO items ( name, company, quantity, price, image_url ) VALUES ($1, $2, $3, $4, $5) RETURNING id;",
        [name, company, quantity, price, image_url]
    );
    return item.rows[0].id;
}

async function createType(type) {
    await pool.query("INSERT INTO types (type) VALUES ($1)", [type]);
}

async function linkItemToType(itemId, typeId) {
    console.log(itemId);
    console.log(typeId);
    await pool.query(
        "INSERT INTO item_types (item_id, type_id) VALUES ($1, $2);",
        [itemId, typeId]
    );
}

async function getItemDetails(id) {
    const { rows } = await pool.query(
        `SELECT items.id AS id,
                items.name AS name,
                items.company,
                items.quantity,
                items.price,
                items.image_url,
                COALESCE(array_agg(types.type), '{}') AS types
        FROM items
        LEFT JOIN item_types ON items.id = item_types.item_id
        LEFT JOIN types ON item_types.type_id = types.id
        WHERE items.id = $1
        GROUP BY items.id, items.name, items.company, items.quantity, items.price, items.image_url;`,
        [id]
    );
    return rows;
}

async function getItemsByType(type) {
    const { rows } = await pool.query(
        `SELECT items.id AS id,
                items.name AS name,
                items.company,
                items.quantity,
                items.price,
                items.image_url,
                COALESCE(array_agg(types.type), '{}') AS types
        FROM items
        JOIN item_types ON items.id = item_types.item_id
        JOIN types ON item_types.type_id = types.id
        WHERE types.type = $1
        GROUP BY items.id, items.name, items.company, items.quantity, items.price, items.image_url;
        `,
        [type]
    );
    return rows;
}

async function updateItem(id, name, company, quantity, price, image_url) {
    console.log('update' + name);
    console.log('update' + company);
    console.log('update' + quantity);
    console.log('update' + price);
    await pool.query(
        `UPDATE items
        SET name = $2, company = $3, quantity = $4, price = $5, image_url = $6
        WHERE id = $1;
        `,
        [id, name, company, quantity, price, image_url]
    );
}

async function deleteItem(itemId) {
    console.log('delete Item');
    await pool.query("DELETE FROM items WHERE id = $1;", [itemId]);
    await deleteItemTypes(itemId);
}

async function deleteItemTypes(itemId) {
    await pool.query("DELETE FROM item_types WHERE item_id = $1", [itemId]);
}

async function getItemCount() {
    const { rows } = await pool.query("SELECT COUNT(*) FROM items;");
    return rows;
}

async function deleteType(typeId) {
    await pool.query("DELETE FROM types WHERE id = $1;", [typeId]);
    await deleteTypeTypes(typeId);
}

async function deleteTypeTypes(typeId) {
    await pool.query("DELETE FROM item_types WHERE type_id = $1", [typeId]);
}


module.exports = {
    getItems,
    getRelations,
    getTypes,
    getTypeByName,
    createItem,
    createType,
    linkItemToType,
    getItemDetails,
    getItemsByType,
    updateItem,
    deleteItem,
    deleteItemTypes,
    getItemCount,
    deleteType,
};
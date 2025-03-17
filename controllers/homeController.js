const db = require("../db/queries");

async function getHomeDetails(req, res) {
    const itemCount = await db.getItemCount(); //arrays are rows
    res.render("index", { itemCount: itemCount[0] });
}

module.exports = {
    getHomeDetails,
};
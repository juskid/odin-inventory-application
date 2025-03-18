const { Client } = require("pg");
require("dotenv").config();
const { argv } = require("node:process");


const SQL = `

DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS types;
DROP TABLE IF EXISTS item_types;


CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (60),
    company VARCHAR (25),
    quantity INTEGER,
    price DECIMAL,
    image_url VARCHAR (255)
);

INSERT INTO items (name, company, quantity, price, image_url)
VALUES
    ('Gymax 3-in-1 6FT Rectangle Kids Trampoline', 'Gymax', 30, 209.99, 'https://i5.walmartimages.com/seo/Gymax-3-in-1-6FT-Rectangle-Kids-Trampoline-w-Swing-Horizontal-Bar-Safety-Net-Outdoor-Orange_e968bbef-7ca4-4c4a-979f-4859e8adfa9f.b403f54a7437d9e1192e2efd7cf34c4f.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF'),
    ('Carters Child of Mine Baby Boy Sleep N Play', 'Carter', 7, 7.00, 'https://i5.walmartimages.com/seo/Carter-s-Child-of-Mine-Baby-Boy-Sleep-N-Play-One-Piece-Sizes-Preemie-6-9-Months_343c140e-31c7-461c-91b3-a75b02f90229.0dfc1748069918cc0c0a69cb0534d6bb.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF'),
    ('Big Mens Core Active Short Sleeve T-Shirt', 'Athletic Works', 99, 6.98, 'https://i5.walmartimages.com/seo/Athletic-Works-Men-s-Core-Active-Short-Sleeve-T-Shirt_1bcffde9-dab8-4a4d-a117-beb104295781.2f14087e2aa83f00650cfcffe2a90238.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF'),
    ('Vivitar Popnap Digital Camera', 'Vivitar', 9, 29.83, 'https://i5.walmartimages.com/seo/POPSNAP-CAMERA-GREEN_327eb88b-4983-456d-91d3-84df8fd053ae.bc5b4cfcf4a49136acd6871163042eee.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF'),
    ('Standard Kit: High-Speed, Low-Latency Internet', 'STARLINK', 200, 299.99, 'https://i5.walmartimages.com/seo/Standard-Kit-High-Speed-Low-Latency-Internet-Latest-Model_f4c92c35-066f-492d-b71c-09b87e2b6d7c.f814eb21ad201fdd09d04bd2a1fb50ec.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF'),
    ('SAMSUNG 75 Class LS03B The Frame QLED 4K', 'Samsung', 53, 1795.00, 'https://i5.walmartimages.com/seo/SAMSUNG-75-Class-LS03B-The-Frame-QLED-4K-Smart-TV-QN75LS03BAFXZA_5c22a09e-876f-45ff-a302-be8f61c9ef62.68a062ea73337eb31566a85cdc9404f4.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF');

CREATE TABLE IF NOT EXISTS types (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type VARCHAR (20) NOT NULL
);

INSERT INTO types (type)
VALUES
    ('Babys & Todlers'),
    ('Fashion'),
    ('Tech'),
    ('Appliances');

CREATE TABLE IF NOT EXISTS item_types (
    item_id INTEGER,
    type_id INTEGER
);

INSERT INTO item_types (item_id, type_id)
VALUES
    (1, 1),
    (2, 1),
    (2, 2),
    (3, 2),
    (4, 3),
    (5, 3),
    (5, 4),
    (6, 3),
    (6, 4);
    `;
//Baby & Toddlers, Fashion, Tech
async function main() {
    try {
        console.log(process.env.PUBLIC_DATABASE_URL+"seeding...");

        const client = new Client({
            connectionString: process.env.PUBLIC_DATABASE_URL,
        });

        try {
            await client.connect();
            console.log("Connected to the database.");
        } catch (err) {
            console.error("Failed to connect:", err);
            return;
        }

        try {
            await client.query(SQL);
            console.log("Database seeded successfully.");
        } catch (err) {
            console.error("Failed to execute query:", err);
        } finally {
            await client.end();
            console.log("Connection closed.");
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

main();
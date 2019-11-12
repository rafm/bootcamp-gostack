require('dotenv/config');

module.exports = {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    define: {
        timestamps: true, // create and populate the createdAt and updatedAt columns
        underscored: true, // table names with the underscore name pattern
        underscoredAll: true, // columns and constraints with the undescore name pattern
    },
};

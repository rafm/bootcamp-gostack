module.exports = {
    dialect: 'postgres',
    host: 'postgresdb',
    username: 'postgres',
    password: 'docker',
    database: 'gobarber',
    define: {
        timestamps: true, // create and populate the createdAt and updatedAt columns
        underscored: true, // table names with the underscore name pattern
        underscoredAll: true, // columns and constraints with the undescore name pattern
    },
};

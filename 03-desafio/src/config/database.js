module.exports = {
    dialect: 'postgres',
    host: 'postgresdb',
    username: 'postgres',
    password: 'docker',
    database: 'gympoint',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};

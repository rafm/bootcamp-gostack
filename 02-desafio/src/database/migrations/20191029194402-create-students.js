module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('students', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            nome: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            idade: {
                type: Sequelize.INTEGER,
            },
            peso: {
                type: Sequelize.INTEGER,
            },
            altura: {
                type: Sequelize.DECIMAL(3, 2),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: queryInterface => {
        return queryInterface.dropTable('students');
    },
};

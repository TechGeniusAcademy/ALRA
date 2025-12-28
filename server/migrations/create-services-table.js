'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Создаем таблицу services если она не существует
    try {
      await queryInterface.createTable('services', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });
      console.log('Таблица services успешно создана');
    } catch (error) {
      if (error.original && error.original.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('Таблица services уже существует, пропускаем...');
      } else {
        throw error;
      }
    }

    // Создаем таблицу booking_services если она не существует
    try {
      await queryInterface.createTable('booking_services', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        booking_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'bookings',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        service_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'services',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });
      console.log('Таблица booking_services успешно создана');
    } catch (error) {
      if (error.original && error.original.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('Таблица booking_services уже существует, пропускаем...');
      } else {
        throw error;
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('booking_services');
    await queryInterface.dropTable('services');
  }
}; 
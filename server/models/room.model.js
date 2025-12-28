module.exports = (sequelize, Sequelize) => {
  const Room = sequelize.define('room', {
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
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    capacity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    amenities: {
      type: Sequelize.JSON,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('available', 'maintenance', 'occupied'),
      defaultValue: 'available'
    },
    roomType: {
      type: Sequelize.ENUM('standard', 'lux', 'family'),
      allowNull: false,
      defaultValue: 'standard'
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at'
    }
  }, {
    tableName: 'rooms',
    timestamps: true
  });

  return Room;
}; 
module.exports = (sequelize, Sequelize) => {
  const BookingService = sequelize.define('bookingService', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    bookingId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id'
      },
      field: 'booking_id'
    },
    serviceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      },
      field: 'service_id'
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
    tableName: 'booking_services',
    timestamps: true
  });

  return BookingService;
}; 
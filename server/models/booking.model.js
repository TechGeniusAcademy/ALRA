module.exports = (sequelize, Sequelize) => {
  const Booking = sequelize.define('booking', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    clientName: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'client_name'
    },
    clientEmail: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'client_email',
      validate: {
        isEmail: true
      }
    },
    clientPhone: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'client_phone'
    },
    roomId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'id'
      },
      field: 'room_id'
    },
    checkIn: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      field: 'check_in'
    },
    checkOut: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      field: 'check_out'
    },
    guests: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    totalPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_price'
    },
    status: {
      type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending'
    },
    paymentStatus: {
      type: Sequelize.ENUM('unpaid', 'paid', 'refunded'),
      defaultValue: 'unpaid',
      field: 'payment_status'
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true
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
    tableName: 'bookings',
    timestamps: true
  });

  return Booking;
}; 
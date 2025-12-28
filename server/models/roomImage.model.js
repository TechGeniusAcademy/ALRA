module.exports = (sequelize, Sequelize) => {
  const RoomImage = sequelize.define('roomImage', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    roomId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'id'
      },
      field: 'room_id',
      onDelete: 'CASCADE'
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'image_url'
    },
    isMain: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      field: 'is_main'
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    }
  }, {
    tableName: 'room_images',
    timestamps: false
  });

  return RoomImage;
}; 
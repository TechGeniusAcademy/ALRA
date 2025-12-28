module.exports = (sequelize, Sequelize) => {
  const Content = sequelize.define('content', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    page: {
      type: Sequelize.STRING,
      allowNull: false
    },
    section: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.JSON,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      field: 'updated_at'
    }
  }, {
    tableName: 'content',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['page', 'section']
      }
    ]
  });

  return Content;
}; 
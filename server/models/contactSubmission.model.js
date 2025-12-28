module.exports = (sequelize, Sequelize) => {
  const ContactSubmission = sequelize.define('contactSubmission', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    subject: {
      type: Sequelize.STRING,
      allowNull: false
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('new', 'read', 'responded'),
      defaultValue: 'new'
    },
    adminNotes: {
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'admin_notes'
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
    tableName: 'contact_submissions',
    timestamps: true
  });

  return ContactSubmission;
}; 
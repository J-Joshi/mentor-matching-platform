export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Keep only this unique constraint
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("mentor", "mentee"),
      allowNull: false,
    },
    skills: {
      type: DataTypes.JSON, // Store skills as JSON array
      allowNull: true,
    },
    interests: {
      type: DataTypes.JSON, // Store skills as JSON array
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.MentorshipRequest, {
      foreignKey: "senderId",
      as: "sentRequests",
    });
    User.hasMany(models.MentorshipRequest, {
      foreignKey: "receiverId",
      as: "receivedRequests",
    });
    User.hasMany(models.Notification, {
      foreignKey: "userId",
      as: "notifications",
    });
  };

  return User;
};

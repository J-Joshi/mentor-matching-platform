export default (sequelize, DataTypes) => {
  const MentorshipRequest = sequelize.define(
    "MentorshipRequest",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending",
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["senderId", "receiverId"], // Prevent duplicate requests
        },
      ],
    }
  );

  MentorshipRequest.associate = (models) => {
    MentorshipRequest.belongsTo(models.User, {
      foreignKey: "senderId",
      as: "sender",
    });
    MentorshipRequest.belongsTo(models.User, {
      foreignKey: "receiverId",
      as: "receiver",
    });
  };

  return MentorshipRequest;
};

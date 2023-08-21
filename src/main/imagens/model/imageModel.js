import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.js";

export const Imagen = sequelize.define(
  "image",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_album: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_recicled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    is_favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:1
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    }
  },
  {
    tableName:"image",
    timestamps:false
  }
);


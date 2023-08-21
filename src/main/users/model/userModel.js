import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.js";

export const User = sequelize.define(
  "users",
  {
    id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      autoIncrement:true,
      primaryKey: true
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    created_at:{
      type:DataTypes.DATE,
      defaultValue : sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull:false
    },
    status:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:1
    }
  },
  {
    timestamps: false,
    tableName: "users",
  }
);

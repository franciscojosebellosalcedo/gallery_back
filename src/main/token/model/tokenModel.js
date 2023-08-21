import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.js";

export const Token = sequelize.define(
  "token",
  {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    refress_token:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    id_auth:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    created_at:{
        type:DataTypes.DATE,
        defaultValue:sequelize.literal("CURRENT_TIMESTAMP"),
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
    tableName: "token",
  }
);

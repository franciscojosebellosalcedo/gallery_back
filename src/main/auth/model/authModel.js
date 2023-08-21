import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.js";

export const Auth = sequelize.define(
  "auth",
  {
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true,
      allowNull:false
    },
    id_user:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    isConfirmed:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },
    token_confirmed:{
      type:DataTypes.TEXT,
      allowNull:true
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    password:{
      type:DataTypes.STRING,
      allowNull:true
    },
    last_password:{
      type:DataTypes.STRING,
      allowNull:true
    },
    created_at:{
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue:sequelize.literal("CURRENT_TIMESTAMP")
    },
    status:{
      type:DataTypes.INTEGER,
      defaultValue:1,
      allowNull:false
    }
  },
  {
    timestamps: false,
    tableName: "auth",
  }
);

import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.js";

export const PartImage=sequelize.define("part_image",{
    id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      autoIncrement:true,
      primaryKey:true
    },
    id_image:{
      allowNull:false,
      type:DataTypes.INTEGER
    },
    part:{
      type:DataTypes.TEXT("long"),
      allowNull:false
    },
    status:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:1
    },
    created_at:{
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue:sequelize.literal("CURRENT_TIMESTAMP")
    }
  },{
    timestamps:false,
    tableName:"part_image"
  });
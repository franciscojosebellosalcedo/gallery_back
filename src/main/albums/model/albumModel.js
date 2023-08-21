import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.js";

export const Album = sequelize.define("album", {
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
    allowNull:false
  },
  id_user:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  name:{
    type:DataTypes.STRING,
    allowNull: false
  },
  description:{
    type:DataTypes.STRING,
    allowNull: false
  },
  created_at:{
    type : DataTypes.DATE,
    defaultValue:sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull:false
  },
  status:{
    type:DataTypes.INTEGER,
    defaultValue:1,
    allowNull:false
  }

},{
  tableName:"album",
  timestamps:false
});

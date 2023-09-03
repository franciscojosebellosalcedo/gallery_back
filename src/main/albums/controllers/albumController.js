import { sequelize } from "../../../config/db.js";
import { Album } from "../model/albumModel.js";


export async function getAllAlbumByIdUser(req, res) {
  try {
    const { id_user } = req.params;
    if (!id_user) {
      return res.status(404).json({
        response: false,
        message: "Error",
      });
    }
    const responseFindAlbumByIdUser=await sequelize.query("select * from album where name != 'perfil' and id_user="+id_user);
    if (responseFindAlbumByIdUser.length === 0) {
      return res.status(404).json({
        response: false,
        message: "No tienes álbum creado",
      });
    }
    return res.status(200).json({
      response: true,
      message: "Lista de álbum",
      data: responseFindAlbumByIdUser[0],
    });

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      response: false,
      message: "Se produjo un error en el servidors",
    });
  }
}

export async function getAlbumbyId(idUser) {
  try {
    const responseFindAlbumByIdUser = await Album.findOne({
      where: {
        id_user: idUser,
      },
    });
    if (!responseFindAlbumByIdUser) {
      return null;
    }
    return responseFindAlbumByIdUser;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function albumIsRepet(nameAlbum) {
  try {
    const allAlbums=await sequelize.query("select * from album where name != 'perfil'");
    console.log(allAlbums[0]);
  } catch (error) {
    console.log(error);
  }
}

export async function createAlbum(req, res) {
  try {
    albumIsRepet(req.body.name);
    const responseInsertAlbum = await saveAlbum(req.body);
    if (!responseInsertAlbum) {
      return res.status(400).json({
        code: 400,
        message: "No se pudo crear el album.",
        response: false,
      });
    } else {
      return res.status(201).json({
        code: 201,
        message: "Album creado correctamente.",
        response: true,
        data:responseInsertAlbum.dataValues
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: "Se produjo un error en el servidor.",
      response: false,
    });
  }
}

export async function saveAlbum(body) {
  try {
    if (!body) {
      return null;
    }
    const responseCreatedAlbum = await Album.create({
      id_user: body.id_user,
      name: body.name,
      description: body.description,
    });
    if (!responseCreatedAlbum) {
      return null;
    }
    const responseFindAlbumCreated=await Album.findOne({
      where:{id:responseCreatedAlbum.id}
    })
    return responseFindAlbumCreated;
  } catch (error) {
    console.log(error);
    return null;
  }
}

import { Album } from "../model/albumModel.js";

export async function getAlbumbyId(idUser) {
  try {
    const responseFindAlbumByIdUser=await Album.findOne({
      where:{
        id_user:idUser
      }
    });
    if(!responseFindAlbumByIdUser){
      return null;
    }
    return responseFindAlbumByIdUser;
  } catch (error) {
    console.log(error)
    return null;
  }
}

export async function createAlbum(req, res) {
  try {
    console.log(req.body);
    const responseInsertAlbum = await saveAlbum(req.body);
    if (!responseInsertAlbum) {
      return res.status(400).json({
        code: 400,
        message: "No se pudo crear el album.",
        response: false,
      });
    }
    if (responseInsertAlbum.affectedRows === 0) {
      return res.status(400).json({
        code: 400,
        message: "No se pudo crear el album.",
        response: false,
      });
    }else{
      return res.status(201).json({
        code: 201,
        message: "Album creado correctamente.",
        response: true,
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
    const responseCreatedAlbum=await Album.create({
      id_user:body.id_user,
      name:body.name,
      description:body.description
    });
    if(!responseCreatedAlbum){
      return null;
    }
    return responseCreatedAlbum;
  } catch (error) {
    console.log(error);
    return null;
  }
}

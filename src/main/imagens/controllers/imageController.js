import { Imagen } from "../model/imageModel.js";
import { PartImage } from "../model/partImageModel.js";

export async function getOneImageByIdAlbum(idAlbum) {
  try {
    const responseFindImageByIdAlbum=await Imagen.findOne({
      where:{id_album:idAlbum}
    });
    if(!responseFindImageByIdAlbum){
      return null;
    }
    const responseGetPartsImage = await getPartsImageByIdImage(
      parseInt(responseFindImageByIdAlbum.id)
    );
    const image =
      responseGetPartsImage[0].part +
      responseGetPartsImage[1].part +
      responseGetPartsImage[2].part;
    return image;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getPartsImageByIdImage(idImage) {
  try {
    const responseFindPartsImage=await PartImage.findAll({
      where:{id_image:idImage}
    });
    if(!responseFindPartsImage){
      return null;
    }
    return responseFindPartsImage;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function uploadImage(req, res) {
  try {
    const responseInsert = await saveImage(req.body);
    if (responseInsert === true) {
      return res.status(201).json({
        code: 201,
        message: "Imagen agregada exitosamente.",
        response: true,
      });
    } else {
      return res.status(400).json({
        code: 400,
        message: "No se pudo agregar la imagen.",
        response: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: "Se produjo un error en el sevidor.",
      response: false,
    });
  }
}

export async function saveImage(dataImage) {
  try {
    if (!dataImage) {
      return false;
    }
    const responseCreatedImage = await Imagen.create({
      id_album: dataImage.id_album,
      title: dataImage.title,
      type: dataImage.type,
    });
    if (!responseCreatedImage) {
      return false;
    } else {
      const responseInsertPartsImage = await savePartImage(
        responseCreatedImage.id,
        dataImage.string_base
      );
      if (responseInsertPartsImage === true) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

function divideBase64IntoThreeParts(stringBase64) {
  const length = stringBase64.length;
  const partLength = Math.ceil(length / 3);

  const part1 = stringBase64.substring(0, partLength);
  const part2 = stringBase64.substring(partLength, 2 * partLength);
  const part3 = stringBase64.substring(2 * partLength);

  return [part1, part2, part3];
}

async function savePartImage(idImage, stringBase64) {
  try {
    const listPartsStringBase64 = divideBase64IntoThreeParts(stringBase64);
    let aux = 0;
    for (let i = 0; i < listPartsStringBase64.length; i++) {
      const part = listPartsStringBase64[i];
      const responseCreatedPartImage = await PartImage.create({
        id_image: idImage,
        part,
      });
      if (responseCreatedPartImage) {
        aux++;
      }
    }
    if (aux > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

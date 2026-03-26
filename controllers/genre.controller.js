import { genreDB } from "../database/db.provider.js";


const createGenre = async (req, res) => {
    try{
        const {genre_name} = req.body
        const response = await genreDB.createGenre(genre_name)
        if(response.error){return res.status(500).json({message: response.error})}
        return res.status(201).json({message:"La catégorie a été ajoutée avec succès", id_genre:response.result.insertId})
    } 
    catch(error){console.error("Controller error",error)
        return res.status(500).json({message: error.message})
    }
}


const readGenre = async (req, res) => {
  try {
    const genreResponse = await genreDB.readGenre();
    if (genreResponse.error) {
      return res.status(500).json({ message: genreResponse.error });
    }
    const genre = genreResponse.result;
    return res.status(200).json({ message: "OK", genre });
  } catch (error) {
    console.error("Error fetching genre:", error);
    return res.status(500).json({ message: error.message });
  }
}; 



const updateGenre = async (req, res) => {
    try{
        const {genre_name} = req.body
        const id_genre=req.params.id_genre
        const response = await genreDB.updateGenre(genre_name, id_genre)
        if(response.error){return res.status(500).json({message: response.error})}
        return res.status(201).json({message: `La catégorie ${genre_name} a été modifiée avec succès`})
    } 
    catch(error){console.error("Controller error",error)
        return res.status(500).json({message: error.message})
    }
}

const deleteGenre = async (req, res) => {
  try {
    const id_genre = req.params.id_genre;
    const response = await genreDB.deleteGenre(id_genre);
    if (response.error) {
      return res.status(500).json({ message: response.error });
    }
    if (!response.result || response.result.affectedRows === 0) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    return res
      .status(200)
      .json({
        message: "Catégorie supprimée avec succès",
        id_genre: Number(id_genre),
      });
  } catch (error) {
    console.error("Error deleting genre:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const GenreController = {
    readGenre,
    createGenre,
    updateGenre,
    deleteGenre
}
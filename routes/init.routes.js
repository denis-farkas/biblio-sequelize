import initBookRoutes from "./book.routes.js";
import initGenreRoutes from "./genre.routes.js";
import initUserRoutes from "./user.routes.js";
//import initCommentRoutes from "./comment.routes.js"

const initRoutes = (app) => {
    initBookRoutes(app)
    initGenreRoutes(app)
    initUserRoutes(app)
    //initCommentRoutes(app)
    };

export default initRoutes;

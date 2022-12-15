const articleRepository = require("../repositories/articleRepository");
const commentsRepository = require("../repositories/commentsRepository");

module.exports = {
	canDeleteUserComment: async (req, res, next) => {
		let ISADMIN = req.user.ISADMIN[0];
		let id = req.user.ID;
		let c_id = req.params.c_id;
		let comment = await commentsRepository.getCommentById(c_id);
		let u_id = comment?.UID;
		let isOwner = (id == u_id);
		if (isOwner || ISADMIN) {
			next();
		} else {
			return res
				.status(401)
				.send({ message: "Unauthorized. Must be admin or comment owner" });
		}
	},
	canDeleteArticleComments: async (req, res, next) => {
		let ISADMIN = req.user.ISADMIN[0];
		let id = req.user.ID;
		let a_id = req.params.a_id;
		let article = await articleRepository.getArticleById(a_id);
		let u_id = article.INSTRUCTORID;
		let isOwner = (id == u_id);
		if (isOwner || ISADMIN) {
			next();
		} else {
			return res
				.status(401)
				.send({ message: "Unauthorized. Must be admin or author of article" });
		}
	},
}
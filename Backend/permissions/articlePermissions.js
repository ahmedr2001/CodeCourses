const { isInstructor } = require('../helpers/instructorHelper');
const instructorRepo = require('../repositories/instructorRepo');
const articleRepo = require('../repositories/articleRepository');

module.exports = {
	canCreateArticle: async (req, res, next) => {
		let id = req.user.ID;
		if (isInstructor(id)) {
			next();
		} else {
			return res
				.status(401)
				.send({ message: "Unauthorized. Must be instructor" });
		}
	},
	canEditArticle: async (req, res, next) => {
		let id = req.user.ID;
		let a_id = req.params.a_id;
		if (isInstructor(id)) {
			let article = null;
			try {
				article = await articleRepo.getArticleById(a_id);
			} catch (err) {
				return res
					.status(500)
					.send({ message: "Internal server error getting article by id " + err });
			}
			if (article.INSTRUCTORID === id) {
				next();
			} else {
				return res
					.status(401)
					.send({ message: "Unauthorized. Must be the author of the article" });
			}
		} else {
			return res
				.status(401)
				.send({ message: "Unauthorized. Must be instructor" })
		}
	},
}
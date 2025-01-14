const commentsRepo = require("../repositories/commentsRepository");
const Joi = require("joi");

function validateComment(comment) {
  const schema = Joi.object({
    comment: Joi.string().min(6).max(255).required(),
    r_id: Joi.number().allow(null)
  });
  return schema.validate(comment);
}
module.exports = {
  getRepliesToComment: async (req, res) => {
    try {
      let id = parseInt(req.params.c_id);
      let replies = await commentsRepo.getRepliesToComment(id);
      if (!replies.length) {
        return res.status(404).send({ message: "Comment has no replies" });
      }
      return res.status(200).send({ replies: replies });
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Internal server error getting replies " + err });
    }
  },
  getCommentsOfArticle: async (req, res) => {
    try {
      let id = parseInt(req.params.a_id);
      let comments = await commentsRepo.getCommentsOfArticle(id);
      if (!comments.length) {
        return res.status(404).send({ message: "no comments on article" });
      }
      return res.status(200).send({ comments: comments });
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Internal server error getting comments " + err });
    }
  },
  getCommentByID: async (req, res) => {
    try {
      let id = parseInt(req.params.c_id);
      let comment = await commentsRepo.getCommentByID(id);
      return res
        .status(200)
        .send({ message: "Comment returned", comment: comment });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Internal Server error getting comment" + error });
    }
  },
  addCommentToArticle: async (req, res) => {
    try {
      const { error } = validateComment(req.body);
      if (error)
        return res
          .status(403)
          .send({ message: "Validation error" + error.details[0].message });

      let a_id = parseInt(req.params.a_id); //article id
      let u_id = parseInt(req.user.ID);   //user id
      let comment_body = req.body.comment;  //comment body
      let r_id = req.body.r_id;             //commment that reply on
      let createComment = await commentsRepo.addComment(
        (a_id = a_id),
        (u_id = u_id),
        r_id,
        (comment = comment_body)
      );
      const new_comment = await commentsRepo.getCommentByID(createComment.insertId)
      return res.status(201).send({ message: "Comment created", comment: new_comment[0] });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Internal Server error getting comment" + error });
    }
  },
  editComment: async (req, res) => {
    try {
      let c_id = req.params.c_id;
      let comment_body = req.body.new_comment;
      let editCommentGo = await commentsRepo.editComment(
        (id = c_id),
        (body = comment_body)
      );
      return res.status(200).send({ message: "Comment Edited" });
    } catch (error) {
      return res.status(500).send({
        message: "Internal server error deleting all comments " + error,
      });
    }
  },
  deleteAllComments: async (req, res) => {
    try {
      let response = await commentsRepo.deleteAllComments();
      if (!response.affectedRows) {
        return res
          .status(404)
          .send({ message: "Looks like there are no comments" });
      }
      return res.status(200).send({ message: "Comments deleted successfully" });
    } catch (err) {
      return res.status(500).send({
        message: "Internal server error deleting all comments " + err,
      });
    }
  },
  deleteCommentById: async (req, res) => {
    try {
      let id = parseInt(req.params.c_id);
      let response = await commentsRepo.deleteCommentById(id);
      if (!response.affectedRows) {
        return res.status(404).send({ message: "Comment not found " });
      }
      return res.status(200).send({ message: "Comment deleted successfully" });
    } catch (err) {
      return res.status(500).send({
        message: "Internal server error deleting comment by id " + err,
      });
    }
  },
  deleteCommentsByUser: async (req, res) => {
    try {
      let id = parseInt(req.params.u_id);
      let response = await commentsRepo.deleteCommentsByUser(id);
      if (!response.affectedRows) {
        return res.status(404).send({ message: "User has no comments" });
      }
      return res
        .status(200)
        .send({ message: "User comments deleted successfully" });
    } catch (err) {
      return res.status(500).send({
        message: "Internal server error deleting user comments " + err,
      });
    }
  },
  deleteCommentsByArticle: async (req, res) => {
    try {
      let id = parseInt(req.params.a_id);
      let response = await commentsRepo.deleteCommentsByArticle(id);
      if (!response.affectedRows) {
        return res
          .status(404)
          .send({ message: "No comments found for article" });
      }
      return res
        .status(200)
        .send({ message: "Article comments deleted successfully" });
    } catch (err) {
      return res.status(500).send({
        message: "Internal server error deleting comments from article " + err,
      });
    }
  },
  likeComment: async (req, res) => {
    try {
      let c_id = parseInt(req.params.c_id);
      let u_id = req.user.ID;
      let row = await commentsRepo.getLikeOnComment(c_id, u_id);
      if (row) {
        await commentsRepo.dislikeComment(c_id, u_id);
        let likeCount = await commentsRepo.likeCountComment(c_id);
        return res
          .status(200)
          .send({
            message: "Student disliked comment",
            likeCount: likeCount,
          });
      }
      let response = await commentsRepo.likeComment(c_id, u_id);
      let likeCount = await commentsRepo.likeCountComment(c_id);
      return res
        .status(200)
        .send({
          message: "Student liked comment",
          likeCount: likeCount,
        });
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Internal server error liking comment " + err });
    }
  },
};

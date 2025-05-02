import express               from 'express';
import authenticateJWT       from '../middleware/auth.jwt.js';
import { listComments, addComment, editComment, deleteComment }     from '../controllers/comment.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/',   listComments);
router.post('/',  authenticateJWT, addComment);
router.put('/:commentId', authenticateJWT, editComment);
router.delete('/:commentId', authenticateJWT, deleteComment);

export default router;

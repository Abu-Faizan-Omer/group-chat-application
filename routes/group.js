const express = require('express');
const groupController = require('../controllers/group');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create', auth.authenticate, groupController.createGroup);
router.post('/add-member', auth.authenticate, groupController.addMember);
router.post('/send-message', auth.authenticate, groupController.sendMessage);
router.get('/messages/:groupId', auth.authenticate, groupController.getLastMessages);
 router.get('/user-groups', auth.authenticate, groupController.getUserGroups); 



//router.get('/:groupId/members', groupController.getMembers);

module.exports = router;
const router = require('express').Router()
const auth = require('../middleware/auth')
const notifyControl = require('../controllers/notifyControl')

router.post('/notify', auth, notifyControl.createNotify)

router.delete('/notify/:id', auth, notifyControl.removeNotify)

router.get('/notifies', auth, notifyControl.getNotifies)

router.patch('/isReadNotify/:id', auth, notifyControl.isReadNotify)

router.delete('/deleteAllNotify', auth, notifyControl.deleteAllNotifies)
  


module.exports = router
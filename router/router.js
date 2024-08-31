var express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

router.post('/', controller.createAsta)
router.post('/member/auctions', controller.findMemberAuctions)
router.get('/auction/:auctionId', controller.findAuction)
router.put('/auction/:auctionId/player/:playerId', controller.updateAuctionPlayer)
router.get('/auction/:auctionId/winner/:winner', controller.findWonPlayers)
router.put('/auction/:auctionId/auctionOptions/ordineChiamata', controller.updateAuctionOptionsOrdineChiamata)
router.put('/auction/:auctionId/auctionOptions/countdown', controller.updateAuctionOptionsCountdown)

module.exports = router;
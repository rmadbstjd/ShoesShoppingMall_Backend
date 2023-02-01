const express = require("express");
const router = express.Router();
const Address = require("../schemas/address");
const sessionUserId = require("../app");
router.get("/address", async (req, res) => {
  const userId = sessionUserId.sessionUserId;
  const address = await Address.find({ userId });
  if (address.length !== 0) {
    res.json(address);
  } else {
    res.json();
  }
});
router.post("/address", async (req, res) => {
  const userId = sessionUserId.sessionUserId;
  const {
    place,
    receiver,
    postCode,
    address,
    addressDetail,
    phoneNumber1,
    phoneNumber2,
    phoneNumber3,
  } = req.body;
  const exsistsAddress = await Address.find({ userId });
  if (exsistsAddress.length !== 0) {
    await Address.deleteOne({ userId });
  }
  await Address.create({
    userId,
    place,
    receiver,
    postCode,
    address,
    addressDetail,
    phoneNumber1,
    phoneNumber2,
    phoneNumber3,
  });
  res.json({ place, receiver, postCode, address, addressDetail, phoneNumber1 });
});
module.exports = router;

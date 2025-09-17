
//user module
const express = require('express');

const storeRouter=express.Router();
//local module
const storeController=require("../controllers/storeController");

storeRouter.get("/",storeController.getIndex);
storeRouter.get("/booking",storeController.getBooking);
storeRouter.get("/homes",storeController.getHomes);
storeRouter.get("/favourite-list",storeController.getFavouriteList);
storeRouter.get("/homes/:homeId",storeController.getHomeDetails);
storeRouter.post("/favourite-list",storeController.postAddToFavourite);
storeRouter.post("/favourite-list/delete/:homeId",storeController.postRemoveFormFavourite);

module.exports=storeRouter;  
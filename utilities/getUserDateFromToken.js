const decodejwt = require("./decodeJWT.js");
const User = require("../model/user.js");
let getUserDateFromToken = async (req) => {
  let token = await req.cookies.jwt;
  let tokenData = await decodejwt(token);
  console.log(tokenData);
  let userDate = await User.findOne({ _id: tokenData.userID }).select([
    "_id",
    "userName",
    "role",
  ]);
  return userDate;
};
module.exports = getUserDateFromToken;

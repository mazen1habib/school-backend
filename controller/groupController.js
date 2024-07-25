const Group = require("../model/group.js");
const { validationResult } = require("express-validator");
const responceMsg = require("../utilities/responceMsg.js");
const decodejwt = require("../utilities/decodeJWT.js");
const User = require("../model/user.js");
const getUserDateFromToken = require("../utilities/getUserDateFromToken.js");
let addGroup = async (req, res) => {
  try {
    let val = await validationResult(req).errors;
    if (val?.length != 0) {
      throw val;
    } else {
      let data = await req.body;
      let userDate = await getUserDateFromToken(req);
      let add = await new Group({
        groupDiploma: data.groupDiploma,
        groupName: data.groupName,
        groupStart: data.groupStart,
        groupCreatedAt: Date.now(),
        groupCreatedBy: {
          _id: userDate._id,
          name: userDate.userName,
        },
        groupStudents: data.groupStudents,
        groupSessions: data.groupSessions,
      });
      let done = await add.save();
      if (done.groupName != data.groupName) {
        throw "Something Went Wrong, Please Try Again";
      } else {
        res.status(200).json({
          status: responceMsg.SUCCESS,
          data: add,
        });
      }
    }
  } catch (er) {
    let errors = [];
    if (er?.message) {
      errors = er.message;
    } else if (er[0]?.location) {
      errors = er.map((e) => e.msg);
    } else {
      errors = er;
    }
    res.status(400).json({
      status: responceMsg.FAIL,
      message: errors,
    });
  }
  res.end();
};
let getAllGroup = async (req, res) => {
  try {
    let allgroup = await Group.find({});
    res.status(200).json({
      status: responceMsg.SUCCESS,
      data: allgroup,
    });
  } catch (er) {
    res.status(400).json({
      status: responceMsg.FAIL,
      error: er,
    });
  }
  res.end();
};
let getSingleGroup = async (req, res) => {
  try {
    let pid = await req.params.id;
    let singlegroup = await Group.findOne({ _id: pid });
    if (singlegroup.length == 0) {
      throw "Group is Not Found";
    } else {
      res.status(200).json({
        status: responceMsg.SUCCESS,
        data: singlegroup,
      });
    }
  } catch (er) {
    res.status(400).json({
      status: responceMsg.FAIL,
      error: er.message || er,
    });
  }
  res.end();
};
let updateGroup = async (req, res) => {
  try {
    let pid = await req.params.id;
    let newStartDate = await req.body.startDate;
    if (!newStartDate) {
      throw "Please Enter The Start Date";
    } else {
      let userDate = await getUserDateFromToken(req);
      let up = await Group.updateOne(
        { _id: pid },
        {
          groupStart: newStartDate,
          updatedAt: Date.now(),
          updatedBy: {
            _id: userDate._id,
            name: userDate.userName,
          },
        }
      );
      if (up.matchedCount == 0) {
        throw "Group Not Found";
      } else {
        if (up.modifiedCount == 0) {
          throw "Nothing Updated";
        } else {
          res.status(200).json({
            status: responceMsg.SUCCESS,
            data: "Updated Successfully",
          });
        }
      }
    }
  } catch (er) {
    let errors = [];
    if (er[0]?.location) {
      errors = er.map((e) => e.msg);
    } else if (er?.message) {
      errors = er.message;
    } else {
      errors = er;
    }
    res.status(400).json({
      status: responceMsg.FAIL,
      data: errors,
    });
  }
  res.end();
};
let deleteGroup = async (req, res) => {
  try {
    let pid = await req.params.id;
    let del = await Group.deleteOne({ _id: pid });
    if (del.deletedCount == 0) {
      throw "Nothing Deleted";
    } else {
      res.status(200).json({
        status: responceMsg.SUCCESS,
        message: "delete Successfully",
      });
    }
  } catch (er) {
    if (er?.message) {
      res.status(400).json({
        status: responceMsg.FAIL,
        error: er.message,
      });
    } else {
      res.status(400).json({
        status: responceMsg.FAIL,
        error: er,
      });
    }
  }
  res.end();
};
let diplomaGroup = async (req, res) => {
  try {
    let dipomaName = await req.params.dname;
    let check = await Group.find({ groupDiploma: dipomaName });
    console.log(check);
    res.status(200).json({
      status: responceMsg.SUCCESS,
      data: check,
    });
  } catch (er) {
    res.status(400).json({
      status: responceMsg.FAIL,
      data: er || er?.message,
    });
  }
};
module.exports = {
  addGroup,
  getAllGroup,
  getSingleGroup,
  updateGroup,
  deleteGroup,
  diplomaGroup,
};

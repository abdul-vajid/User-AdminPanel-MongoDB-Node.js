var db = require("../config/mongo-connection");
var collection = require("../config/collections");
var objectId=require('mongodb').ObjectId
const bcrypt = require("bcrypt");
const { response } = require("express");


module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.pword1 = await bcrypt.hash(userData.pword1, 10);
      // userData.pword2=await bcrypt.hash(userData.pword2,10)
      const { pword2, ...rest } = userData;
      db.get()
        .collection(collection.USER_COLLECTION)
        .insertOne(rest)
        .then((res) => {
          resolve(res);
        });
    });
  },

  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ usname: userData.uname });
      if (user) {
        bcrypt.compare(userData.password, user.pword1).then((status) => {
          if (status) {
            console.log("Login Sucess");
            response.user=user;
            response.status=true;
            resolve(response)
          } else {
            console.log("Login failed");
            resolve({status:false})
          }
        });
      } else {
        console.log("User not exist");
        resolve({status:false})
      }
    });
  },
  deleteUser:(userId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userId)}).then((response)=>{
        resolve(response)
      })
    })
  },

  getUsers:()=>{
    return new Promise (async(resolve,reject)=>{
      let allUsers=await db.get().collection(collection.USER_COLLECTION).find().toArray()
      resolve(allUsers)
    })
  },

  getUser:(userId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)}).then((user)=>{
        resolve(user)
      })
    })
  },

  editUser:(userId, userDetails)=>{
    return new Promise ((resolve,reject)=>{
      db.get().collection(collection.USER_COLLECTION)
      .updateOne({_id:objectId(userId)},{
        $set:{
          name:userDetails.name,
          place:userDetails.place,
          age:userDetails.age,
          email:userDetails.email,
          usname:userDetails.usname,
          }
      }).then((response)=>{
        resolve()
      })
      
    })
  },

  addUser:(userData)=>{
    return new Promise(async (resolve, reject) => {
      userData.pword1 = await bcrypt.hash(userData.pword1, 10);
      db.get()
        .collection(collection.USER_COLLECTION)
        .insertOne(userData)
        .then((res) => {
          resolve(res);
        });
    });
  },

  doSearch:({usname})=>{
    return new Promise(async (resolve, reject)=>{
      try{
        let user= await db.get().collection(collection.USER_COLLECTION).find({usname: new RegExp(usname)}).toArray()
        if(user){
          resolve(user);
        } else{
          reject()
        }
      } catch{
        reject(err)
      }
    })
  }
};
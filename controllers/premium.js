const AWS = require("aws-sdk");
const { Op } = require("sequelize");
const Expense = require("../model/expense");
const FileLink = require("../model/file-link");

const uploadToS3 = (fileData, fileName) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  const params = {
    Bucket: "expensetrackerbucket", // bucket name
    Key: fileName, // file name
    Body: fileData, //file content
    ACL: "public-read", //who can access
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (S3Err, S3Result) => {
      if (S3Err) {
        reject(S3Err);
      }
      // console.log(`File uploaded successfully at ${S3Result.Location}`);
      resolve(S3Result.Location);
    });
  });
};
exports.getIsPremium = async (req, res) => {
  try {
    const response = req.user.isPremium;
    // console.log(response);
    res.status(200).send({ isPremium: response });
  } catch (error) {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.getAllExpenses = async (req, res) => {
  const userId = req.user.id;
  // console.log("userId>>>>>", userId);
  try {
    const response = await Expense.findAll({
      attributes: ["amount", "description", "category"],
      where: { userId: { [Op.ne]: userId } },
    });
    // console.log("Response>>>>>>>", response);
    res.status(200).send({ expenses: response, msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "internal server error" });
  }
};

exports.getGenerateReport = async (req, res) => {
  if (!req.user.isPremium) {
    return res.status(400).send({ msg: "Only for Premiumm users" });
  }
  try {
    const expenses = await req.user.getExpenses();
    // console.log(expenses);
    const fileData = JSON.stringify(expenses); //always stringify the data to add to file
    const fileName = `expense${req.user.id}/${new Date()}.txt`;
    const S3Result = await uploadToS3(fileData, fileName);
    // console.log(S3Result);//gives the file url
    await req.user.createFileLink({ fileURL: S3Result });
    res
      .status(200)
      .send({ reportLink: S3Result, msg: "file upload successfull" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

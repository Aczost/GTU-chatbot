const { MessageMedia, Client, LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");
const finalName = require("./new");
const mongoose = require("mongoose");
const studModel = require("./studData");
const courseModel = require("./courseDetails");
// const students = require("./user");
// const studentDetails = require("./user");
// require("./script");
mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://amit1108:amit%401108@cluster0.yjt4ycq.mongodb.net/studentsDB",
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected");
    }
  }
);

// mongoose.createConnection("mongodb+srv://amit1108:amit%401108@cluster0.yjt4ycq.mongodb.net/studentsDB");

let flag = false;
let ca1 = (ca2 = ca4 = false);
function cases(c1, c2, c3) {
  c1 = true;
  c2 = false;
  c3 = false;
  arr = [c1, c2, c3];
  return arr;
}

//<----------------------------FOR DATABASE-------------------->
let fee = false;
async function insertStud(id, enroll) {
  let u1 = new students({ enrollment: enroll, contact: id, feeStatus: fee });
  await u1.save();
  fee = !fee;
  console.log(u1);
}

async function findStud(id) {
  console.log(id);
  let stud = await students.find({ contact: id });
  if (stud.length > 0) {
    return true;
  } else {
    return false;
  }
}
//<----------------------------FOR DATABASE-------------------->

//<===========================FOR FEE ALERT=========================>
async function feeAlert(numFees) {
  if (!numFees[1]) {
    await client.sendMessage(numFees[0], "Please pay the fees!!");
  } else {
    await client.sendMessage(numFees[0], "Please do not pay the fees!!");
  }
}

//trigger on fees alert
async function feeBroadcast() {
  console.log("inside fees");
  let query = await students.find({});
  let numFees = {};
  // console.log(query);
  for (let i = 0; i < query.length; i++) {
    numFees[query[i].contact] = query[i].feeStatus;
  }

  //Converts object to array[[key:value],[key:value]]
  let arr = Object.entries(numFees);
  arr.forEach(feeAlert);
}

// fees.addEventListener('click',feeBroadcast);
//<========================================FOR IMP. UPDATES==============================================>

async function sendAlert(num) {
  await client.sendMessage(num, "Alert!!!!!!");
}

//important update trigger

async function sendUpdate(date) {
  console.log("Inside final");
  let query = await students.find({});
  let nums = [];
  for (let index = 0; index < query.length; index++) {
    nums.push(query[index].contact);
  }
  setTimeout(() => nums.forEach(sendAlert), date - Date.now());
}

//SET THE DATE HERE, FORMAT--->Year,Month,Date,Hour,Minute
// let date = new Date(exampleInputYear, exampleInputMonth, exampleInputDate, exampleInputHour, exampleInputMinute);

//Converts the date to milliseconds.
// let datemili = date.getTime();

// submit.addEventListener('click', sendUpdate(datemili));

//<===========================FOR DATE ENDS=========================>

// READING STUDENTS JSON FILE

async function fetchStudentDetails(enr) {
  const studDetails = await studModel.find({ enr });
  return studDetails;
}

async function fetchCourseDetails(branch,paper=false) {
  const courseDetails = await courseModel.find({ branch:branch.toUpperCase()});
  console.log(courseDetails);
  const { desc, companies, colleges, papers } = courseDetails[0];
  let str = "";
  if (paper) {
    papers.forEach((el) => (str += "\n" + el.year + "\n" + el.link+"\n"));
    str+= "\n\nPress # to go back!👈"
    return str;
  } else {
    str += desc;
    companies.forEach(
      (el) => (str += "\n" + el.name + "\n" + el.size + "\n" + el.link + "\n")
    );
    colleges.forEach(
      (el) =>
        (str +=
          "\n" +
          el.name +
          "\n" +
          el.ownership +
          "\n" +
          el.established +
          "\n" +
          el.link +
          "\n" +
          el.fees+"\n")
    ); 
    str+= "\n\nPress # to go back!👈"
    return str;
  }
}
// READING COURSE-BRANCH JSON FILE
// let courseData = {};
// const jsonStringCourse = fs.readFileSync(
//   "./course_branch.json",
//   "utf-8",
//   (err) => {
//     if (err) {
//       console.log("File read failed:", err);
//       return;
//     }
//   }
// );
// courseData = JSON.parse(jsonStringCourse);

const client = new Client({
  authStrategy: new LocalAuth(),
  // puppeteer: { headless: false }
});

client.initialize();

client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});
//
client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log("QR RECEIVED", qr);
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
  //   console.log(finalName);
});

client.on("auth_failure", (message) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", message);
});
// const replyData = studentsData[user_inp];
client.on("ready", async () => {
  console.log("READY and WORKING!");
  // const contacts = await client.getContacts();
  // console.dir(contacts)
  // client.sendMessage("919687205427@c.us", "Please pay fees deadline is close");
});

const initial_message = finalName.initial_msg;

client.on("message", async (message) => {
  // console.log('MESSAGE RECEIVED', message);
  //   const fs = require("fs");

  // console.log(typeof(message.body)){
  let case1 = false;
  let case2 = false;
  let case4 = false;
  let u = /^\d{12}$/;

  var user_inp = message.body.toUpperCase();

  //<---------------------------------DATABASE ACCESS---------------------------------->

  // let stud = await findStud(message.from);
  // let enroll;
  // if (!stud) {

  //   //This will sort from newest to oldest and return last inserted document.
  //   let checkEnroll = await students.find({}).sort({ _id: -1 }).limit(1);

  //   if (checkEnroll.length > 0) {
  //     enroll = checkEnroll[0].enrollment;
  //     enroll = enroll + 5;
  //   }
  //   else {
  //     enroll = 190320107135;
  //   }
  //   insertStud(message.from, enroll);
  // }

  //<---------------------------------DATABASE ENDS-------------------------------------->

  if (user_inp.match(u)) {
    // console.log("inside pattern test");
    // flag = true;
    const replyData = await fetchStudentDetails(user_inp);

    if (replyData.length === 0) {
      message.reply(
        "Enrollment Number not found.\n\nPlease enter a valid enrollment number."
      );
    } else {
      message
        .reply(
          `Your current semester is ${replyData[0].sem}  
              \nHere is a link to your result... ${replyData[0].result} 
              \nYour branch is ${replyData[0].branch}`
        )
        .toString();

      if (replyData[0].exmfee) {
        message.reply(
          "Fee Status : You have paid the fees." + "\n\nPress # to go back!👈"
        );
      } else {
        message.reply("Fee Status : You have not paid the fees.") +
          "\n\nPress # to go back!👈";
      }
    }
    return;
  } else {
    var user_inp = message.body.toUpperCase();
  }

  if (user_inp.startsWith("HI") || user_inp.startsWith("HE")) {
    const initial_media = MessageMedia.fromFilePath("gtu.jpg");

    await client.sendMessage(message.from, initial_media, {
      caption: initial_message,
    });

    flag = true;
  } else if (flag) {
    const media = MessageMedia.fromFilePath("./circular.pdf");
    const bonafide = MessageMedia.fromFilePath("./bonafide.pdf");

    //IN THIS WE NEED TO MENTION ALL THE COMMANDS : ( ALL MUST BE UNIQUE )
    // I PREFER WRITING TEXT INSTEAD OF WRITING NUMBERS

    switch (user_inp) {
      case "1":
        message.reply(finalName.course_details).toString();
        message.reply(
          "Please reply with 2 character course code\nFor ex: *CE*" +
            "\nPress # to go back!👈"
        );
        [ca1, ca2, ca4] = cases(case1, case2, case4);
        break;
      case "2":
        message.reply("Enter your Enrollment number");
        [ca2, ca1, ca4] = cases(case2, case1, case4);
        break;
      case "3":
        await message.reply(media);
        message.reply("Press # to return to the main menu.");
        break;

      case "4":
        message.reply(
          "Select your branch\n" +
            finalName.paper_details +
            "\nPress # to go back!👈"
        );
        [ca4, ca1, ca2] = cases(case4, case2, case1);
        break;
      case "5":
        message.reply(bonafide);
        message.reply(finalName.bonafidemsg + "\nPress # to go back!👈");
        break;

      case "6":
        message.reply(
          "Click on below link and fill the details\n\n" +
            "https://yourownresume.netlify.app/" +
            "\nPress # to go back!👈"
        );
        break;

      case "7":
        message.reply(
          "For comprehensive understanding https://www.de.gtu.ac.in/StudyMaterial_Presentation\n\n" +
            finalName.egd_material +
            "\nPress # to go back!👈"
        );
        break;

      case "8":
        message.reply(finalName.query + "\nPress # to go back!👈");
        break;

      case "9":
        message.reply(finalName.quit);
        flag = false;
        break;

      case "CE":
        let ceDetails = await fetchCourseDetails("CE",);
        message.reply(ceDetails)
        break;

      case "IT":
        let itDetails = await fetchCourseDetails("IT",);
        message.reply(itDetails)
        break;

      case "ICT":
        let ictDetails = await fetchCourseDetails("ICT",);
        message.reply(ictDetails)
        break;

      case "ME":
        let meDetails = await fetchCourseDetails("ME",);
        message.reply(meDetails);
        break;

      case "CL":
        let clDetails = await fetchCourseDetails("CL",);
        message.reply(clDetails);
        break;

      case "#":
        message.reply(finalName.informative_section);
        ca1 = ca2 = ca4 = false;
        break;

      case "hi" || "HI" || "HII" || "hii" || "Hello":
        break;

      case "CE-P":
        let cePapers = await fetchCourseDetails("CE",true);
        message.reply("Please wait while we are fetching the information...");
        setTimeout(() => {
          message.reply(cePapers);
        }, 3000);
        break;

      case "ME-P":
        let mePapers = await fetchCourseDetails("ME",true);
        message.reply("Please wait while we are fetching the information...");
        setTimeout(() => {
          message.reply(mePapers);
        }, 3000);
        break;

      case "CL-P":
        let clPapers = await fetchCourseDetails("CL",true);
        message.reply("Please wait while we are fetching the information...");
        setTimeout(() => {
          message.reply(clPapers);
        }, 3000);
        break;

      // case "CEM-P":
      //   message.reply("Please wait while we are fetching the information...");
      //   setTimeout(() => {
      //     message.reply(finalName.ce_papers + "\nPress # to go back!👈");
      //   }, 3000);
      //   break;

      case "IT-P":
        let itPapers = await fetchCourseDetails("IT",true);
        message.reply("Please wait while we are fetching the information...");
        setTimeout(() => {
          message.reply(itPapers);
        }, 3000);
        break;

      case "ICT-P":
        let ictPapers = await fetchCourseDetails("ICT",true);
        message.reply("Please wait while we are fetching the information...");
        setTimeout(() => {
          message.reply(ictPapers);
        }, 3000);
        break;

      default:
        // console.log(ca1, ca2, ca4);
        if (ca1) {
          message.reply(
            "*Invalid input*" +
              "\n\nPlease reply with 2 character course code\nFor ex: *CE* " +
              "\n\nPress # to go back!👈"
          );
        } else if (ca2) {
          message.reply(
            "*Invalid input!!*\n\nPlease enter your enrollment number again." +
              "\n\nPress # to go back!👈"
          );
        } else if (ca4) {
          message.reply(
            "*Invalid input!!* " +
              "\n\nSelect your branch\n\n" +
              finalName.paper_details +
              "\nPress # to go back!👈"
          );
        } else {
          message.reply(`*Uh oh! Invalid input*\n\n` + finalName.initial_msg);
        }
    }
  } else {
    message.reply(`Uh oh! Invalid input\n\nPlease enter Hi/Hello to begin!`);
  }
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

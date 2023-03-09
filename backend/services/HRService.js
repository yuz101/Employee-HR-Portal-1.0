const Employee = require("../models/Employee");
const House = require("../models/House");
const RegistrationEmail = require("../models/RegistrationEmail");
const nodemailer = require("nodemailer");
const EmployeeWorkAuthorizationStatus = require("../models/EmployeeWorkAuthorizationStatus");

class HRService {
  static async sendRegistrationEmail({ firstName, middleName, lastName, email} , token) {
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'teamnull2023@gmail.com',
                pass: 'walmiaczzpxlcdvn',
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'Beaconfire Solution <teamnull2023@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "[Important] Registration Link for Beaconfire", // Subject line
            text: "Welcome to Beaconfire Solution", // plain text body
            html: `<p>Greetings ${firstName} ${lastName}, </p> 
            <p>Please click the button below to register your account.</p> 
            <a style="padding: 10px 20px;" href="http://localhost:4200/auth/signup?email=${email}&token=${token}">Registration</a>`, // html body
        });
        const date = new Date()
        const expiration = date.setHours(date.getHours() + 3);
        const registration = await RegistrationEmail.create({ firstName, middleName, lastName, email, token, expiration: expiration, status: "sent"})

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        return registration
    } catch (err) {
      console.error(err);
      throw error;
    }
  }

  static async resendRegistrationEmail(registrationEmailId) {

    try {
        console.log(registrationEmailId)
        let registrationEmail = await RegistrationEmail.findById(registrationEmailId)
        console.log(registrationEmail)
        const { firstName, middleName, lastName, preferredName, email, token } = registrationEmail
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'teamnull2023@gmail.com',
                pass: 'walmiaczzpxlcdvn',
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'Beaconfire Solution <teamnull2023@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "[Important] Registration Link for Beaconfire", // Subject line
            text: "Welcome to Beaconfire Solution", // plain text body
            html: `<p>Greetings ${firstName}(${preferredName}) ${lastName}, </p> 
            <p>Please click the button below to register your account.</p> 
            <a style="padding: 10px 20px;" href="http://localhost:4200/auth/signup?email=${email}&token=${token}">Registration</a>`, // html body
        });

        const date = new Date()
        const expiration = date.setHours(date.getHours() + 3);
        const updatedRegistrationEmail = await RegistrationEmail.findByIdAndUpdate(
          registrationEmailId,
          { 
            $set: { expiration: expiration, status: "sent" }
          },
          { new: true }
        )

        console.log("From HR Service: ", updatedRegistrationEmail)

         console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        return updatedRegistrationEmail
      } catch (err) {
        console.error(err);
        throw error;
      }

  }

  static async getRegistrationEmails() {
    try{
        const registrationEmails = await RegistrationEmail.find()
        return registrationEmails
    } catch (err) {
        console.error(err);
        throw error;
    }
  }

   static async findRegistrationEmail(emailToken) {
        try {
            const registrationEmail = await RegistrationEmail.findOne({emailToken})
            return registrationEmail
        } catch (err) {
            console.error(err)
            throw err
        }
    }

  static async updateRegistrationEmail(registrationId, registration) {
    try {
      const updateRegistrationEmail = await RegistrationEmail.findByIdAndUpdate(
          registrationId,
          {
              $set: registration,
          },
          { new: true }
      )
      return updateRegistrationEmail
    } catch (err) {
        console.error(err);
        throw error;
    }
  }

  static async getProfiles(searchInput) {
    try {
        let employees = []
        if(searchInput) {
          employees = await Employee.aggregate([
            {
              $match: {
                $or: [
                  { firstName: { $regex: `.*${searchInput}.*`, $options: 'i'} },
                  { lastName: { $regex: `.*${searchInput}.*` , $options: 'i'} },
                  { preferredName: { $regex: `.*${searchInput}.*`, $options: 'i'} },
                ],
              },
            },
          ])
        } else {
            employees = await Employee.find()
        }
        return employees
    } catch (err) {
      console.error(err);
      throw error;
    }
  }

  static async add_house(houseData) {
    console.log("service: adding house");
    try {
      const { address, landlord, facility, residents, roommates, reports } =
        houseData;

    //   // Retrieve the data of existing employees
    //   const existingEmployees = await Employee.find({
    //     _id: { $in: roommates },
    //   });

    //   // Extract the ObjectIDs of existing employees from their data
    //   const existingEmployeeIds = existingEmployees.map(
    //     (employee) => employee._id
    //   );

    // Retrieve the IDs of all employees in the database
    const employeeIds = await Employee.find().distinct("_id");
    // Shuffle the array of employee IDs randomly using the Fisher-Yates algorithm
    for (let i = employeeIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [employeeIds[i], employeeIds[j]] = [employeeIds[j], employeeIds[i]];
    }
    
      // Assign the first n employees from the shuffled array to the new house,
      // where n is the number of roommates needed for the house
      const numRoommatesNeeded = roommates.length;
      // const numRoommatesNeeded = 0;
      const assignedEmployees = employeeIds.slice(0, numRoommatesNeeded);

      // Create a new House object with the assigned roommates' IDs
      const newHouse = new House({
        address,
        landlord,
        facility,
        residents,
        roommates: assignedEmployees,
        reports,
      });

      // Check if house with same address already exists
      const existingHouse = await House.findOne({
        "address.city": houseData.address.city,
        "address.state": houseData.address.state,
        "address.zip": houseData.address.zip,
      });
      if (existingHouse) {
        console.log(`A house with address '${address}' already exists.`);
        return null;
      }

      // Save the new house to the database
      await newHouse.save();

      // Populate the `roommates` field with the full data of the assigned employees
      //   await newHouse.populate("roommates").exec();

      // Extract the IDs of the assigned employees from the populated data
      const assignedEmployeeIds = newHouse.roommates.map(
        (roommate) => roommate._id
      );

      // Update the `roommates` field of the new house with the correct employee IDs
      newHouse.roommates = assignedEmployeeIds;

      // Save the updated house to the database
      await newHouse.save();

      return newHouse;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }


  static async view_house() {
    console.log("service: view houses");
    try {
      const houses = await House.find().select("address landlord residents");
      if (!houses) {
        const error = new Error("House not found");
        error.status = 404;
        throw error;
      }

      return houses;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async view_house_details(houseId) {
    try {
      const house = await House.findById(houseId).populate("roommates");
      if (!house || house.roommates.length === 0) {
        console.log("No roommates found for house with ID:", houseId);
      } else {
        console.log("Roommates:", house.roommates);
      }
      // const house = await House.findById(houseId);
      if (!house) {
        throw new Error("House not found");
      }

      return house;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async delete_house(houseId) {
    try {
      const house = await House.findByIdAndDelete(houseId);

      if (!house) {
        throw new Error("House not found");
      }

      return house;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async workAuthorizationStatus() {
    try {
      const employeesStatus = await EmployeeWorkAuthorizationStatus.find();
      if (!employeesStatus) {
        throw new Error("Employee Work Authorization Status not found");
      }

      return employeesStatus;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async workAuthorizationStep() {
    try {
      // filter employees with upflow status "Not Uploaded"
      const employeesStep = await EmployeeWorkAuthorizationStatus.aggregate([
        {
          $match: { "uploadFlow.status": "Not Uploaded" }
        },
        {
          $project: {
            employeeId: 1,
            workAuthorizationType: 1,
            started: 1,
            completed: 1,
            uploadFlow: {
              $filter: {
                input: "$uploadFlow",
                as: "flow",
                cond: { $eq: [ "$$flow.status", "Not Uploaded" ] }
              }
            }
          }
        },
        {
          $addFields: {
            uploadFlow: { $slice: ["$uploadFlow", 1] }
          }
        }
      ]);

      if (!employeesStep) {
        throw new Error("Employee Work Authorization Step not found");
      }

      return employeesStep;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

module.exports = HRService;

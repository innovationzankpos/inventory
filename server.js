require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const sql = require("mssql/msnodesqlv8");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Database connection config
const config = {
  server: "localhost\\sqlexpress2014",
  database: "POWERPOS",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

// const config2 = {
//   server: "192.168.3.102\\sqlexpress2014",
//   user: "sa",
//   password: "password@2014",
//   database: "powerpos",
//   driver: "msnodesqlv8",
//   options: {
//     trustedConnection: false,
//   },
// };

// let user = "";

// Log In Page
app.get("/", checkAuthentication, (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/index.html"));
});

// Dashboard Page
app.get("/dashboard", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/dashboard.html"));
});

// Branch Inventory Page
app.get("/branchinv", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/branch_inventory.html"));
});

// Inventory Page
app.get("/summaryinv", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/summary_inventory.html"));
});

// Retrieve users
app.get("/getUsers", async (req, res) => {
  let pool;
  try {
    pool = await sql.connect(config);

    const result = await sql.query(
      "SELECT user_id, user_password FROM [POWERPOS].[dbo].[user_access]"
    );

    const obj1 = result.recordset;

    const responseObj = { user: obj1 };

    const combinedArray = [];

    const object1Rows = responseObj.user;

    const maxLength = Math.max(object1Rows.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < object1Rows.length) {
        combinedArray.push(object1Rows[i]);
      }
    }

    // console.log(combinedArray);

    res.json(combinedArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching data from the database.");
  } finally {
    // Close the connection
    if (pool) {
      await pool.close();
      console.log("Connection to the database closed!");
    }
  }
});

app.get("/getBranch", async (req, res) => {
  let pool;
  try {
    pool = await sql.connect(config);

    const result = await sql.query(
      "SELECT machine_id from machine_setup WHERE machine_id != 'SERVER' ORDER BY machine_id"
    );

    const obj1 = result.recordset;

    const responseObj = { user: obj1 };

    const combinedArray = [];

    const object1Rows = responseObj.user;

    const maxLength = Math.max(object1Rows.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < object1Rows.length) {
        combinedArray.push(object1Rows[i]);
      }
    }

    // console.log(combinedArray);

    res.json(combinedArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching data from the database.");
  } finally {
    // Close the connection
    if (pool) {
      await pool.close();
      console.log("Connection to the database closed!");
    }
  }
});

// Retrieve logged in user
app.get("/user", async (req, res) => {
  let pool;
  try {
    pool = await sql.connect(config);

    const user = req.cookies.user;
    // console.log("USER LOGGED IN: " + user);

    const result = await sql.query(
      `SELECT user_id FROM [POWERPOS].[dbo].[user_access] WHERE user_id = '${user}'`
    );

    const obj1 = result.recordset;

    const responseObj = { user: obj1 };

    const combinedArray = [];

    const object1Rows = responseObj.user;

    const maxLength = Math.max(object1Rows.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < object1Rows.length) {
        combinedArray.push(object1Rows[i]);
      }
    }

    // console.log(combinedArray);

    res.json(combinedArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching data from the database.");
  } finally {
    // Close the connection
    if (pool) {
      await pool.close();
      console.log("Connection to the POWERPOS database closed!");
    }
  }
});

// Retrieve summary inventory
app.get("/suminv", async (req, res) => {
  let pool;
  try {
    pool = await sql.connect(config);

    const result = await sql.query(
      "SELECT * FROM [POWERPOS].[dbo].[summary_inventory]"
    );

    // const result = await sql.query(
    //   "SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS id, itemcode, itemname, [001], [002], S001, S002 FROM [powerpos].[dbo].[summary_inventory]"
    // );

    // const result = await sql.query(
    //   "SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS id, itemcode, qty FROM [POWERPOS].[dbo].[summary_inventory]"
    // );

    const obj1 = result.recordset;

    const responseObj = { user: obj1 };

    const combinedArray = [];

    const object1Rows = responseObj.user;

    const maxLength = Math.max(object1Rows.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < object1Rows.length) {
        combinedArray.push(object1Rows[i]);
      }
    }

    // console.log(combinedArray);

    res.json(combinedArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching data from the database.");
  } finally {
    // Close the connection
    if (pool) {
      await pool.close();
      console.log("Connection to the powerpos database closed!");
    }
  }
});

// app.get("/suminvcolumn", async (req, res) => {
//   let pool;
//   try {
//     pool = await sql.connect(config2);

//     const result = await sql.query(
//       "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'summary_inventory'"
//     );

//     const obj1 = result.recordset;

//     const responseObj = { user: obj1 };

//     const combinedArray = [];

//     const object1Rows = responseObj.user;

//     const maxLength = Math.max(object1Rows.length);

//     for (let i = 0; i < maxLength; i++) {
//       if (i < object1Rows.length) {
//         combinedArray.push(object1Rows[i]);
//       }
//     }

//     console.log(combinedArray);

//     res.json(combinedArray);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .send("An error occurred while fetching data from the database.");
//   } finally {
//     // Close the connection
//     if (pool) {
//       await pool.close();
//       console.log("Connection to the powerpos database closed!");
//     }
//   }
// });

// Validates Log in
app.post("/login", async (req, res) => {
  let pool;
  try {
    pool = await sql.connect(config);

    const { username, password } = req.body;

    var x = 0;
    var letter = "";

    if (password.length != 0) {
      while (x < password.length) {
        var n = password.charCodeAt(x) + (x + 1);
        letter = letter + String.fromCharCode(n);
        x++;
      }
    }

    const check_credentials = await sql.query(
      `SELECT * from [POWERPOS].[dbo].[user_access] where user_id = '${username}' AND user_password = '${letter}'`
    );

    console.log("Letter: " + letter);

    if (check_credentials.recordset.length === 0) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { name: username },
      process.env.ACCESS_SECRET_TOKEN
    );
    // console.log("Generated Token: " + accessToken);

    // user = uname;

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    res.cookie("user", username, { httpOnly: true, secure: true });
    res.json({ message: "Log in successful!" });
    // res.sendStatus(200);
    // res.redirect("/home");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching data from the database.");
  } finally {
    // Close the connection
    if (pool) {
      await pool.close();
      console.log("Connection to the POWERPOS database closed!");
    }
  }
});

// Log out
app.get("/logout", authenticateToken, (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("user");
  // res.redirect("/");
  res.json({ message: "Log out successful!" });
});

// Token Authentication
function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken;

  // console.log("User Token2: " + token);

  if (token == null) return res.redirect("/");

  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    // req.user = user;
    next();
  });
}

// Check validation
function checkAuthentication(req, res, next) {
  const token = req.cookies.accessToken;

  // console.log("User Token: " + token);

  if (token != null) return res.redirect("/dashboard");

  next();
}

// app.listen(3000);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

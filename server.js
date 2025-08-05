const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

// Connecting to SQLite DB
const db = new sqlite3.Database("./database.db", (error)=>{
    if (!error) { console.log("Connected to SQLite DB") }
    else { console.error("SQLite DB connection error:", error.message) }
});

// Create table Users if it doesn't exist
// email  [email , from 6 to 200 symbols long, template: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ]
// login  /^[a-zA-Z0-9@_-]{3,50}$/
// pass is password  /^[a-zA-Z0-9_-]{4,100}$/
// col - Colors on/off  [1 or 0, 1 by default]
// num - Numbers on/off  [1 or 0, 1 by default]
// ssn - Seasons on/off  [1 or 0, 1 by default]
// fday - First day of the week: M - Mon, S - Sun [M by default]
// sid - session ID, template:  /^[a-zA-Z0-9]{10}$/
db.serialize( ()=>{
    db.exec(
        `CREATE TABLE IF NOT EXISTS Users (
            id  INTEGER  PRIMARY KEY  AUTOINCREMENT,
            email  TEXT  NOT NULL,
            login  TEXT  NOT NULL  UNIQUE,
            pass  TEXT  NOT NULL,
            col  INTEGER,
            num  INTEGER,
            ssn  INTEGER,
            fday  TEXT,
            sid  TEXT
    )`);
     // Protect admin account (id=0) from update
    db.exec(
        `CREATE TRIGGER IF NOT EXISTS protect_admin_update
        BEFORE UPDATE ON Users
        WHEN old.id = 0
        BEGIN
            SELECT RAISE(FAIL, 'Cannot modify admin account');
        END;`,
        (err) => {  if (err){ console.error("Error creating update protection trigger:", err.message) }  }
    );
    // Protect admin account (id=0) from delete
    db.exec(
        `CREATE TRIGGER IF NOT EXISTS protect_admin_delete
        BEFORE DELETE ON Users
        WHEN old.id = 0
        BEGIN
            SELECT RAISE(FAIL, 'Cannot delete admin account');
        END;`,
        (err) => {  if (err){ console.error("Error creating delete protection trigger:", err.message) }  }
    );
});

// Create table Events if it doesn't exist
// userid - user id from table Users
// year - event's year [digits from 1900 to 2200]
// month - event's month [digits from 1 to 12]
// day - event's day [digits from 1 to 31]
// color - cell color [0080FF by default, template: /^[a-fA-F0-9]{6}$/ ]
// content  /^.{1,500}$/u
db.serialize( ()=>{
    db.exec(
        `CREATE TABLE IF NOT EXISTS Events (
            id  INTEGER  PRIMARY KEY  AUTOINCREMENT,
            userid  INTEGER  NOT NULL,
            year  INTEGER  NOT NULL,
            month  INTEGER  NOT NULL,
            day  INTEGER  NOT NULL,
            color  TEXT,
            content  TEXT
    )`);
});

// Insert primary data (once)
const adminEmail = "qwe@rty.com";  // replace it with your own
const adminLogin = "imAdmin";  // replace it with your own
const adminPass = "ADFi23jwerk4";  // replace it with your own
db.get(
    "SELECT email FROM Users WHERE id=0",
    (error, row) => {
        if (!error) {
            if (!row) {
                db.run(
                    `INSERT INTO Users (id, email, login, pass, col, num, ssn, fday, sid)
                      VALUES (0, ?, ?, ?, 1, 1, 1, "M", "")`, [adminEmail, adminLogin, adminPass],
                    (err) => {
                        if (!err) { console.log("Primary data inserted successfully") }
                        else { console.error("Error inserting primary data:", err.message) };
                    }
                );
            }
        } else {
            console.error("Database check error:", error.message);
            process.exit(1);    // Terminate the entire script with an error code
        }
    }
);

app.use( express.static(__dirname) );
app.use( express.json() );

// Checking received data
function checkEmail(email){
    if (  !(email.length < 201 && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))  ){
        console.error("Incorrect Email format");
        return response.status(400).json({ error: "Incorrect Email format" });
    }
};
function checkLogin(login){
    if ( !/^[a-zA-Z0-9@_-]{3,50}$/.test(login) ) {
        console.error("Incorrect Login format");
        return response.status(400).json({ error: "Incorrect Login format" });
    }
};
function checkPassw(passw){
    if ( !/^[a-zA-Z0-9_-]{4,100}$/.test(passw) ) {
        console.error("Incorrect Password format");
        return response.status(400).json({ error: "Incorrect Password format" });
    }
};

// Adding a user to the database
app.post( "/newUser",  async (request, response)=>{

    const { email, login, passw } = request.body;
    // Check received data from the registration fields
    checkEmail(email);
    checkLogin(login);
    checkPassw(passw);
    try {    // interrupt all if any returns an reject

        // if the login exists in the database - skip the registration
        await new Promise( (resolve, reject)=> {
            db.get(
                "SELECT id FROM Users WHERE Users.login = ?", [login],
                (error, row) => {
                    if (error) {
                        console.error("Error getting data from the users database! ", error.message);  // to the server console
                        response.status(500).json({error: "Error getting data from the users database"});  // to the browser
                        return reject(error);
                    };
                    if (row) {
                        console.error("This login is already taken!");
                        response.status(400).json({error: "This login is already taken"});
                        return reject( new Error("This login is already taken.") );
                    };
                    resolve();  // the login was not found
                }
            );
        });

        // Register new user in the database
        await new Promise( (resolve, reject)=> {
            db.run(
                `INSERT INTO Users (id, email, login, pass, col, num, ssn, fday, sid)
                    VALUES (null, ?, ?, ?, 1, 1, 1, "M", "")`, [email, login, passw],
                (err) => {
                    if (!err) {
                        console.log("The User is added!");  // to the server console
                        response.json({ message: "The User is added" });  // to the browser
                        return resolve();
                    } else {
                        console.error("Error adding the User to the database! ", err.message);  // to the server console
                        response.status(400).json({ error: "Error adding the User to the database" });  // to the browser
                        return reject(err);
                    };
                }
            );
        });

    } catch (e){return};

}); /// Adding a user


// LogIn a user
app.post( "/user",  async (request, response)=>{

    const { login, passw } = request.body;
    // Check the received data from the LogIn fields
    checkLogin(login);
    checkPassw(passw);

    await new Promise( (resolve, reject)=>{
        db.get(
            "SELECT * FROM Users WHERE Users.login = ?", [login],
            async (error, row) => {
                if (error) {
                    console.error("Error getting data from the users database! ", error.message);  // to the server console
                    response.status(500).json({error: "Error getting data from the users database"});  // to the browser
                    return reject(error);
                };
                if (row) {    // if the login exists
                    // IF THE PASSWORD IS CORRECT
                    if(row.pass === passw){
                        // make the unique session ID
                        let new_sid;
                        while (true) {
                            new_sid = [...Array(10)].map(()=>'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]).join('');
                            const existing_sid = await new Promise( (resolve, reject)=>{
                                db.get( "SELECT * FROM Users WHERE sid = ?", [new_sid],
                                    (err, dt) => { if (err) reject(err); resolve(dt); }
                                );
                            });
                            if (!existing_sid) break;  // if new_sid is not in DB - stop new sid making
                        };
                        // write session ID for the user
                        db.run(
                            `UPDATE Users SET sid = ? WHERE id = ?`, [new_sid, row.id],
                            (err)=>{ if (err){
                                    console.error(`Error inserting session ID ${new_sid} for User id ${row.id} to the Users database! `, err.message);
                                    response.status(500).json({ error: "Session ID Error" });  // to the browser
                                    return reject(err);
                            }}
                        );
                        console.log("The user logged in");  // to the server console
                        // get user's Events data
                        const userEvents = await getUserEvents(row.id);
                        // send the user data to the browser
                        response.json( {
                            uSettings: {sid: new_sid, login: row.login, email: row.email, col: row.col, num: row.num, ssn: row.ssn, fday: row.fday},
                            uEvents: userEvents
                        });
                        return resolve();
                    } else {
                        // IF THE PASSWORD IS INCORRECT
                        console.log("The password is wrong!");  // to the server console
                        response.status(400).json({error: "The password is wrong"});  // to the browser, only this message
                        return reject( new Error("The password is wrong.") );
                    };
                };  /// END if the login exists
                console.log("The login is not exist!");  // to the server console
                response.status(400).json({error: "The login is not exist"});  // to the browser
                return reject( new Error("The login is not exist.") );
            }
        );
    });

}); /// LogIn a user

// Read the User's Events data
async function getUserEvents(userid) {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM Events WHERE Events.userid = ?", [userid],
            (error, rows) => {
                if (!error) {
                    if (rows.length > 0) {
                        return resolve(
                            rows.map( row => ({
                                id: row.id,
                                year: row.year,
                                month: row.month,
                                day: row.day,
                                color: row.color,
                                content: row.content
                            }))
                        );
                    } else {
                        return resolve([]);
                    }
                } else {
                    console.error("Error getting data from the Events database! ", error.message);  // to the server console
                    return reject(error);  // to the parent function
                }
            }
        );
    });
};  /// Read the User's Events data

// Send the forgotten password
app.post( "/sendPassw",  async (request, response)=>{
    const {email} = request.body;
    try {
        checkEmail(email);    // Check the received email
        db.get(
            "SELECT id, pass FROM Users WHERE Users.email = ?", [email],
            async (error, row) => {

                if (error) {
                    console.error("Error getting data from the users database! ", error.message);  // to the server console
                    return response.status(500).json({error: "Error getting data from the users database"});  // to the browser
                };

                if (!row) {
                    return response.status(404).json({ error: "Email not found" });
                };

                if (row.id === 0) {
                    return response.status(403).json({ error: "Admin password cannot be restored" });
                };

                // if id for the email was found and it is not the admin id
                /*
                // Having nodemailer (npm install nodemailer)
                const nodemailer = require('nodemailer');
                async function sendMail(email, password) {
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.example.com', // SMTP сервер (such as: smtp.gmail.com)
                        port: 587, // or 465 for SSL
                        secure: false, // true for port 465
                        auth: {
                            user: 'your_email@example.com',
                            pass: 'your_password'
                        }
                    });
                    let rsp = await transporter.sendMail({
                        from: '"Mailer" <your_email@example.com>',
                        to: email,
                        subject: 'The password from the Kalendar',
                        text: `Your password is ${password}`,
                    });
                    console.log('Message sent: %s', rsp.messageId);
                };
                sendMail(email, row.pass).catch(console.error);
                */

                console.log("Password would be sent to:", email);
                return response.status(200).json({success: true});
            }
        );
    } catch (err) {
        console.error("Server error:", err.message);
        return response.status(500).json({ error: "Server error" });
    };
});

// Save Settings from the Settings Window
app.post( "/saveSettings",  async (request, response)=>{
    const {fday, col, num, ssn, passw, sid} = request.body;
    let reqFields = [ 'fday=?', 'col=?', 'num=?', 'ssn=?' ];
    if(passw){
        // check received data
        try{ checkPassw(passw) } catch(err){
            console.error("Error in proposed password!", err);  // to the server console
            response.status(400).json({ error: "Error in proposed password" });  // to the browser
            return err;
        };
        reqFields.push('pass=?');  // use password in requests
    };
    await new Promise( (resolve, reject)=> {
        db.run(
            `UPDATE Users SET ${reqFields.join(',')} WHERE sid = ?`,
              [fday, col, num, ssn, ...(passw ? [passw] : []), sid],
            (err) => {
                if (!err) {
                    console.log("The Settings are saved!");  // to the server console
                    response.json({ message: "The Settings are saved" });  // to the browser
                    return resolve();
                } else {
                    console.error("Error adding the Settings to the database! ", err.message);  // to the server console
                    response.status(400).json({ error: "Error adding the Settings to the database" });  // to the browser
                    return reject(err);
                };
            }
        );
    });
}); /// Save Settings

// Save Event using the Event Window
app.post( "/saveEvent",  async (request, response)=>{
    const {sid, id, year, month, day, color, content} = request.body;
    // check received data
    if ( !/^[a-zA-Z0-9]{10}$/.test(sid) ) {
        console.error("Incorrect Event data (sid)");
        return response.status(400).json({ error: "Incorrect Event data (sid)" });
    };
    if ( id !== undefined && ( !/^\d{1,}$/.test(id) || +id < 1 ) ) {
        console.error("Incorrect Event data (id)");
        return response.status(400).json({ error: "Incorrect Event data (id)" });
    };
    if(+year < 1900 || +year > 2200) {
        console.error("Incorrect Event data (year)");
        return response.status(400).json({ error: "Incorrect Event data (year)" });
    }
    if(+month < 1 || +month > 12) {
        console.error("Incorrect Event data (month)");
        return response.status(400).json({ error: "Incorrect Event data (month)" });
    }
    if(+day < 1 || +day > 31) {
        console.error("Incorrect Event data (day)");
        return response.status(400).json({ error: "Incorrect Event data (day)" });
    }
    if ( !/^[a-fA-F0-9]{6}$/.test(color) ) {
        console.error("Incorrect Event data (color)");
        return response.status(400).json({ error: "Incorrect Event data (color)" });
    };
    if(content.length > 500) {
        console.error("Incorrect Event data (content.length)");
        return response.status(400).json({ error: "Incorrect Event data (content.length)" });
    };

    // if it's an update of existing event
    if(id) {
        let reqFields = ['year=?', 'month=?', 'day=?', 'color=?', 'content=?'];
        await new Promise( (resolve, reject)=> {
            db.run(
                `UPDATE Events SET ${reqFields.join(',')} WHERE id = ?`,
                  [year, month, day, color, content, id],
                (err) => {
                    if (!err) {
                        console.log("The Event is saved!");  // to the server console
                        response.json({ message: "The Event is saved" });  // to the browser
                        return resolve();
                    } else {
                        console.error("Error adding the Event to the database! ", err.message);  // to the server console
                        response.status(400).json({ error: "Error adding the Event to the database" });  // to the browser
                        return reject(err);
                    };
                }
            );
        });
    } else {    // if it's new event
        // get the user id with sid
        let userID = await new Promise( (resolve, reject) => {
            db.get(
                "SELECT id FROM Users WHERE Users.sid = ?", [sid],
                (error, row) => {
                    if (!error) {
                        resolve(row.id)
                    } else {
                        console.error("Error getting ID from the Users database! ", error.message);  // to the server console
                        reject(error);
                    }
                }
            );
        });
        // write the new event
        await new Promise( (resolve, reject)=> {
            db.run(
                `INSERT INTO Events (id, userid, year, month, day, color, content)
                    VALUES (null, ?, ?, ?, ?, ?, ?)`, [userID, year, month, day, color, content],
                function (err) {
                    if (!err) {
                        console.log("The Event is added!");  // to the server console
                        response.json({ id: this.lastID });  // to the browser
                        return resolve();
                    } else {
                        console.error("Error adding the Event to the database! ", err.message);  // to the server console
                        response.status(400).json({ error: "Error adding the Event to the database" });  // to the browser
                        return reject(err);
                    };
                }
            );
        });
    };
}); /// Save the Event

// Delete Event using the Event Window
app.post( "/deleteEvent",  async (request, response)=>{
    const {id} = request.body;
    // check received data
    if ( !/^\d{1,}$/.test(id) || +id < 1 ) {
        console.error("Incorrect event id:", id);
        return response.status(400).json({ error: `Incorrect event id:${id}` });
    };
    await new Promise( (resolve, reject)=> {
        db.run(
            `DELETE FROM Events WHERE id = ?`, [id],
            (err) => {
                if (!err) {
                    console.log("The Event is deleted!");  // to the server console
                    response.json({ message: "The Event is deleted" });  // to the browser
                    return resolve();
                } else {
                    console.error("Error deleting the Event from the database! ", err.message);  // to the server console
                    response.status(400).json({ error: "Error deleting the Event from the database" });  // to the browser
                    return reject(err);
                };
            }
        );
    });
}); /// Delete the Event

// Stop the server by the programm
app.post( '/shutdown', (req, res)=>{
    res.json( { message: 'The server is shutting down...' } );
    console.log('The server is shutting down...');
    process.exit();
});

// Starting the server
app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
});
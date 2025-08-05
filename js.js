const eBody = document.body;
const eMain = document.querySelector("main");
const eBtnMenu = document.querySelector("#imgMenu");
const eAside = document.querySelector("aside");
const eColored = document.querySelector("#colored");
const eNums = document.querySelector("#nums");
const eSeason = document.querySelector("#season");
const eBtnSettings = document.querySelector("#btnSettings");
const eSettingsWindow = document.querySelector("#settingsWindow");
const eSetWinSaveBtn = document.querySelector("#setWinSaveBtn");
const eSetWinCancelBtn = document.querySelector("#setWinCancelBtn");
const eLoginField = document.querySelector("#loginField");
const eLoginFieldLogin = document.querySelector("#loginField input[name='login']");
const eLoginFieldPassw = document.querySelector("#loginField input[name='passw']");
const eLoginButton = document.querySelector("#loginButton");
const eRegButton = document.querySelector("#regButton");
const eRegWindow = document.querySelector("#regWindow");
const eRegWindowEmail = document.querySelector("#regWindow input[name='email']");
const eEmailError = document.querySelector("#emailError");
const eRegWindowLogin = document.querySelector("#regWindow input[name='login']");
const eLoginError = document.querySelector("#loginError");
const eRegWindowPassw = document.querySelector("#regWindow input[name='passw']");
const ePasswError = document.querySelector("#passwError");
const ePassSwitch = document.querySelector("#passSwitch");
const eRegWindowRegisterButton = document.querySelector("#regWindowRegisterButton");
const eRegWindowCancelButton = document.querySelector("#regWindowCancelButton");
const eWrongPasswWindow = document.querySelector("#wrongPasswWindow");
const eWrongPassWinOkBtn = document.querySelector("#wrPassWinOkBtn");
const eForgotLink = document.querySelector("#forgot");
const eSendPasswWindow = document.querySelector("#sendPasswWindow");
const eSendPasswWinEmail = document.querySelector("#sendPasswWindow input[name='email']");
const eSendPassWinEmailError = document.querySelector("#sendPassWinEmailError");
const eSendPassWinSendBtn = document.querySelector("#sendPassWinSendBtn");
const eSendPassWinCancelBtn = document.querySelector("#sendPassWinCancelBtn");
const eMesWindow = document.querySelector("#messageWindow");
const eMesWindowHeader = eMesWindow.querySelector("h1");
const eMesWindowContent = document.querySelector("#messageWindowContent");
const eMesWindowBtn = document.querySelector("#messageWindowBtn");
const ePasswSwitch = document.querySelector("#passwSwitch");
const ePasswInput = document.querySelector("#passwInput");
let eSwColors = document.querySelector("#swColors");
let eSwNumbers = document.querySelector("#swNumbers");
let eSwSeasons = document.querySelector("#swSeasons");
let eSwFDay = document.querySelector("#swFDay");
let eMenuFDay = document.querySelector("#menuFDay");
let eDisplayDate = document.querySelector("#displayDate");
const eExitBtnField = document.querySelector("#exitBtnField");
const eExitBtn = document.querySelector("#exitBtn");
const eEventWindow = document.querySelector("#eventWindow");
const eEventWindowHeader = eEventWindow.querySelector("h1");
const eEventDate = document.querySelector("#eventDate");
const eEventContent = document.querySelector("#eventContent");
const eEventColor = document.querySelector("#eventColor");
const eEventWinSaveBtn = document.querySelector("#eventWinSaveBtn");
const eEventWinCancelBtn = document.querySelector("#eventWinCancelBtn");
const eBtnPrint = document.querySelector("#btnPrint");
const eShutdownButton = document.querySelector("#shutdownButton");

let eMtNames, eMNumbers, eAlienMM, eCoverLayer, currentYear, eLastSelectedTd, eYearNav, eCalendar, eMnWidth;
const bodyWidth = eBody.clientWidth;
const baseHeight = 930;
let moby = bodyWidth <= 767;
const nowDate = new Date();
const nowYear = nowDate.getFullYear();
const savedYear = +sessionStorage.getItem("currentYear");
currentYear = savedYear ? savedYear : (currentYear ? currentYear : nowYear);
let weekStart = "M";
const yearMM = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const MM = [ yearMM[11], ...yearMM, yearMM[0], yearMM[1] ];

// On load: AutoZoom; Applay settings and events if the user is logged in
window.addEventListener("load", ()=>{
    if (sessionStorage.userSettings) {
        fnLoadAndApplyUSettingsFromSS();
        fnLoadAndApplyUEvents();
    };
    fnContentAutoZoom();
});

// progMode
if(window.location.hash === "#prog") {
    eShutdownButton.classList.add("useThis");
};

// On resize
window.addEventListener("resize", ()=>{
    fnContentAutoZoom();
});

function fnDateStringMaker(year, month, date) {
    const thisDate = new Date(year, month-1, date);
    const thisDateString = thisDate.toString();
    return thisDateString.slice(0,3) +", "+ yearMM[month-1] +" "+ thisDateString.slice(8,10) +", "+ thisDateString.slice(11, 15);
};

eDisplayDate.innerHTML = fnDateStringMaker( nowYear, nowDate.getMonth()+1, nowDate.getDate() );

function fnCalendarMaker(gotYear, weekStart) {

    function fnYearCalculate(workYear, fromMonth, toMonth) {
        let theYear = {};
        for (let m = fromMonth; m < toMonth + 1; m++) {
            let firstDay = new Date(Date.UTC(workYear, m - 1, 1));  // first day of the month
            let firstDayWeek = firstDay.getDay() + 1;   // 1 (Sunday) to 7 (Saturday)
            let firstDayNextM = new Date(Date.UTC(workYear, m, 1));  // first day of the next month
            // last day of the month
            let lastDay = +(new Date(firstDayNextM.setDate(firstDayNextM.getDate() - 1))).toISOString().slice(8, 10);
            theYear[ m ] = { "firstDayWeek": firstDayWeek, "lastDay": lastDay };
        };
        return theYear;
    };

    currentYear = gotYear ? gotYear : currentYear;
    const oldYear = fnYearCalculate(currentYear - 1, 12, 12);
    oldYear[0] = oldYear[12]; delete oldYear[12];
    const thisYear = fnYearCalculate(currentYear, 1, 12);
    const newYear = fnYearCalculate(currentYear + 1, 1, 2);
    newYear[13] = newYear[1]; delete newYear[1]; newYear[14] = newYear[2]; delete newYear[2];
    const allYear = { ...oldYear, ...thisYear, ...newYear };

    eMain.innerHTML = `
    <div id="yearNav">
        <img src="/pic/goLeft.png" id="prevYear">
        <h1 id="yearHeader"></h1>
        <img src="/pic/goRight.png" id="nextYear">
    </div>
    <div id="content"></div>`;

    let calendarHTML = "", alien, N;
    const dayHeaders = weekStart === "S" ?
        "<tr class=\"dName\"><td>SU</td><td>MN</td><td>TU</td><td>WN</td><td>TH</td><td>FR</td><td>SA</td></tr>" :
        "<tr class=\"dName\"><td>MN</td><td>TU</td><td>WN</td><td>TH</td><td>FR</td><td>SA</td><td>SU</td></tr>";

    for (let M = 0; M < 15; M++) {
        (M === 0 || M === 13 || M === 14) ? alien = "alien" : alien = "";
        switch (M) {
            case 0: N = 12; break;
            case 13: N = 1; break;
            case 14: N = 2; break;
            default: N = M;
        };
        calendarHTML += `
        <div class="MtAround"><a><div class="MtName ${alien}" aria-label="${M}"><span class="mName">${M}</span><span class="mNumber">${N}</span></div></a>
        <table class="Month">
        ${dayHeaders}`;
        let emptyDays = allYear[M].firstDayWeek;
        if (weekStart === "S") {
            emptyDays = emptyDays === 7 ? 0 : emptyDays;
        } else {
            emptyDays = emptyDays ? emptyDays - 1 : 6;
        }
        let fullDays = allYear[M].lastDay;
        calendarHTML += "<tr>\n";
        for (let d = 1; d <= emptyDays; d++) {
            calendarHTML += `<td>&nbsp;</td>\n`
        };
        let q = 0; let Q = emptyDays;
        for (let d = 1; d <= fullDays; d++) {
            q++; Q++;
            calendarHTML += "<td>" + q + "</td>\n";
            if (!(Q % 7)) { calendarHTML += "</tr>\n<tr>\n" };
        };
        calendarHTML += "</table>\n</div>";
    };
    const eYearHeader = document.querySelector("#yearHeader");
    const ePrevYear = document.querySelector("#prevYear");
    const eNextYear = document.querySelector("#nextYear");
    eCalendar = document.querySelector("#content");
    eCalendar.innerHTML = calendarHTML;
    eMtNames = document.querySelectorAll(".MtName");
    eMNumbers = document.querySelectorAll(".mNumber");
    eAlienMM = document.querySelectorAll(".alien");
    eYearNav = document.querySelector("#yearNav");

    eMnWidth = document.querySelector(".MtAround");

    eYearHeader.innerHTML = currentYear;

    function yearRunner() {
        if ( sessionStorage.getItem('userEvents') ) {
            fnLoadAndApplyUEvents();
        } else {
            fnCalendarMaker(currentYear, weekStart);
        };
        fnCloseEventWindow();
    };

    // on double click yearHeader
    eYearHeader.addEventListener("dblclick", () => {
        currentYear = nowYear;
        yearRunner();
    });

    // on click prevYear
    ePrevYear.addEventListener("click", () => {
        currentYear = currentYear - 1;
        yearRunner();
    });

    // on click nextYear
    eNextYear.addEventListener("click", () => {
        currentYear = currentYear + 1;
        yearRunner();
    });

    // names of months
    const eMNames = document.querySelectorAll(".mName");
    eMNames.forEach((eMName, index) => {
        eMName.innerHTML = MM[index];
    });

    fnMarkToday("on");  // today highlighting

    fnColorizer();

    fnHighlightWeekEnd(weekStart);

    fnContentAutoZoom();

    sessionStorage.setItem("currentYear", currentYear);  // keep currentYear between pages for working reload

};  // fnCalendarMaker()
fnCalendarMaker(currentYear, weekStart);

// today highlighting
function fnMarkToday(toggle) {
    if (+currentYear === +nowYear) {    // if it's the now year
        const month = nowDate.getMonth() + 1;  // calculate current month
        const today = nowDate.getDate();            // and current day
        const daysRows = document.querySelectorAll(`.MtAround:has(div[aria-label="${month}"]:not(.alien)) table tr:nth-child(n+2)`);
        daysRows.forEach( row => {
            row.querySelectorAll("td").forEach( td => {
                if(+td.innerText === +today) {
                    if(toggle === "on"){ td.classList.add("today") }
                    else { td.classList.remove("today") }
                }
            })
        });
    }
};

function fnHighlightWeekEnd(weekStart) {
    const eRows = document.querySelectorAll(".Month tr");
    eRows.forEach( row => {
        const eCells = row.querySelectorAll("td");
        if (weekStart === "S") {
            if( eCells[0] ){ eCells[0].classList.add("weekend") };
            if( eCells[6] ){ eCells[6].classList.add("weekend") };
        } else {
            if( eCells[5] ){ eCells[5].classList.add("weekend") };
            if( eCells[6] ){ eCells[6].classList.add("weekend") };
        }
    });
};

// on/off color
function fnColorizer() {
    eMtNames.forEach( eMtName => {
        const month = +eMtName.getAttribute("aria-label");
        eMtName.classList.remove("winterBG", "springBG", "summerBG", "fallBG");
        if (eColored.checked) {
            if (month in [1,2,12]) { eMtName.classList.add("winterBG") }
            else if (month > 2 && month < 6) { eMtName.classList.add("springBG") }
            else if (month > 5 && month < 9) { eMtName.classList.add("summerBG") }
            else if (month > 8 && month < 12) { eMtName.classList.add("fallBG") }
        }
    });
};
eColored.addEventListener("click", fnColorizer);

// on/off month numbers
eNums.addEventListener("click", ()=>{
    eMNumbers.forEach( mn => mn.classList.toggle("hide", !eNums.checked) );
});

// on/off seasons
eSeason.addEventListener("click", ()=>{
    eAlienMM.forEach( am => am.parentElement.parentElement.classList.toggle("hide", !eSeason.checked) );
});

// on switch week start in the main menu
eMenuFDay.addEventListener("change", ()=>{
    weekStart = eMenuFDay.value === "Sun" ? "S" : "M";
    if ( sessionStorage.getItem('userEvents') ) {
        fnLoadAndApplyUEvents();
    } else {
        fnCalendarMaker(currentYear, weekStart);
    };
});

// Content auto zoom
function fnContentAutoZoom() {
    if (!moby) {
        const zoom = Math.min( +((window.innerHeight / baseHeight).toFixed(2)) , 1);
        eMain.style.zoom = zoom;
        if ( typeof InstallTrigger !== "undefined" ) {    // Firefox support
            eMain.style.zoom = "";
            eMain.style.transform = `scale(${zoom})`;
            eMain.style.transformOrigin = "top left";
            eMain.style.height = `${baseHeight}px`;
        };
    } else {
        const outWidth = window.innerWidth;
        const innerWidth = eMnWidth.clientWidth * 3 + 60;
        const widthIndex = (outWidth/innerWidth).toFixed(2);
        eCalendar.style.zoom = widthIndex;
    }
};

function fnMessageWindow(header, content, isError=false) {
    eMesWindow.classList.add("use");
    eMesWindowHeader.innerHTML = header;
    eMesWindowContent.innerHTML = content;
    if (isError) {
        eMesWindow.classList.add("errorWindow");
    } else {
        eMesWindow.classList.remove("errorWindow");
    };
    eMesWindowBtn.focus();
};

// Closing the Mesaage Window by Ok button
eMesWindowBtn.addEventListener("click", ()=>{
    eMesWindow.classList.remove("use");         // hide the window
    eMesWindowHeader.innerHTML = "Info";      // reset the values
    eMesWindowContent.innerHTML = "";
    eMesWindowBtn.value = "Ok";
    eMesWindow.classList.remove("errorWindow");  // switch off the error style
});

// Log in
eLoginButton.addEventListener("click", async ()=>{  // on click the LogIn button in the loginField
    const login = eLoginFieldLogin.value;
    const passw = eLoginFieldPassw.value;
    if( !login || !passw) {  // if we have not the Login or Password
        if(!login){
            fnMessageWindow("Login", "You didn't enter your Login", true);
        } else {
            fnMessageWindow("Login", "You didn't enter your Password", true);
        };
        return;
    };
    // if we have the Login and Password
    if(  fnCheckLogLoginField(login) && fnCheckLogPasswField(passw)  ){  // if the Login and Password passed the checks
        // read the User Data with the Login and Password
        try {
            const response = await fetch(
                "/user", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({login, passw})    // the user data are sent
            });

            let jResult;  // received data
            try {
                jResult = await response.json();
            } catch (e) {  throw new Error("The server returned a non-JSON response or an empty response.")  };

            if (response.ok) {
                // on the successful logging in
                fnSaveUSettingsToSS(jResult.uSettings);
                fnSaveUEventsToSS(jResult.uEvents);
                fnApplyUSettings(jResult.uSettings);
                fnLoadAndApplyUEvents();
            } else {
                if(jResult.error === "The password is wrong"){
                    eWrongPasswWindow.classList.add("use");
                    eWrongPassWinOkBtn.focus();
                } else {
                    fnMessageWindow("Login error", `${jResult.error || response.statusText || "Unknown error"}`, true);
                }
            };
        } catch (error) {
            fnMessageWindow("Server error", "Error while log in", true);
        };
    };
});

// login fields checking
function fnCheckLogLoginField(login) {
    const isValid = /^[a-zA-Z0-9@_-]{3,50}$/.test(login);
    if (!isValid) {
        fnMessageWindow("Log in", "A valid Login must contain from 3 to 50 characters from the set: a-z A-Z 0-9 _-", true);
    }
    return isValid ? true : false;
};
function fnCheckLogPasswField(passw) {
    const isValid = /^[a-zA-Z0-9_-]{4,100}$/.test(passw);
    if (!isValid) {
        fnMessageWindow("Log in", "A valid Password must contain from 4 to 100 characters from the set: a-z A-Z 0-9 _-", true);
    }
    return isValid ? true : false;
};

// Closing the eWrongPasswWindow by Ok button
eWrongPassWinOkBtn.addEventListener("click", ()=>{
    eWrongPasswWindow.classList.remove("use");
});

// on click on the Forgot Passw link
eForgotLink.addEventListener("click", ()=>{
    eWrongPassWinOkBtn.click();  // closing the wrongPasswWindow
    eLoginFieldLogin.value = "";    // clear the loginField
    eLoginFieldPassw.value = "";   // clear the loginField
    eSendPasswWindow.classList.add("use");  // open sendPasswWindow
});

// on click Send in the sendPasswWindow
eSendPassWinSendBtn.addEventListener("click", async ()=>{
    eSendPasswWindow.classList.remove("use");   // close the sendPasswWindow
    if( fnCheckEmailField("sendPassw") ){           // if no errors in email:
        // Send password to email
            try {
                const response = await fetch(
                    "/sendPassw", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email: eSendPasswWinEmail.value})
                });
                if (response.ok) {
                    fnMessageWindow("Access restore", "Check your email");
                } else {
                    fnMessageWindow("Access restoring error", "The Email is not found", true);
                };
            } catch (error) {
                fnMessageWindow("Server error", "Error while the access restoring", true);
            };
    } else {
        fnMessageWindow("Error", "A valid login must contain from 3 to 50 characters<br/>from the set: a-z A-Z 0-9 _-", true);
    };
    // clear the email from sendPasswWindow
    eSendPasswWinEmail.value = "";
});
// on every email change in the sendPasswWindow
eSendPasswWinEmail.addEventListener("input", ()=>fnCheckEmailField("sendPassw") );

// on click Cancel in the sendPasswWindow
eSendPassWinCancelBtn.addEventListener("click", ()=>{
    eSendPasswWindow.classList.remove("use");    // hide the window
    eSendPasswWinEmail.value = "";                      // clear the email value
});

// RegWindow
eRegButton.addEventListener("click", ()=>{  // on click Register in the loginField
    eRegWindow.classList.add("use");    // show RegWindow
    // Moving values ​​from the loginField to regWindow if we have those
    if(eLoginFieldLogin.value){
        eRegWindowLogin.value = eLoginFieldLogin.value;
        eLoginFieldLogin.value = "";
    };
    if(eLoginFieldPassw.value){
        eRegWindowPassw.value = eLoginFieldPassw.value;
        eLoginFieldPassw.value = "";
    };
});

// password visability switch
ePassSwitch.addEventListener("click", ()=>{
    if(eRegWindowPassw.type === "password") {
        eRegWindowPassw.type = "text";
        ePassSwitch.src="pic/eye-opened.png";
    } else {
        eRegWindowPassw.type = "password";
        ePassSwitch.src = "pic/eye-closed.png";
    }
});

// registration fields checking

function fnCheckEmailField(type) {
    let email, emailErrorField;
    if(type === "reg"){
        email = eRegWindowEmail.value;
        emailErrorField = eEmailError;
    }
    else if(type === "sendPassw"){
        email = eSendPasswWinEmail.value;
        emailErrorField = eSendPassWinEmailError;
    };
    const isValid = (email.length < 201) && (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email));
    emailErrorField.classList.toggle("error", !isValid);
    emailErrorField.innerHTML = isValid ? "" : "Please enter a valid email";
    return isValid ? true : false;
};

function fnCheckLoginField() {
    const isValid = /^[a-zA-Z0-9@_-]{3,50}$/.test( eRegWindowLogin.value );
    eLoginError.classList.toggle("error", !isValid);
    eLoginError.innerHTML = isValid ? "" : "A valid login must contain from 3 to 50 characters from the set: a-z A-Z 0-9 _-";
    return isValid ? true : false;
};

function fnCheckPasswField() {
    const isValid = /^[a-zA-Z0-9_-]{4,100}$/.test( eRegWindowPassw.value );
    ePasswError.classList.toggle("error", !isValid);
    ePasswError.innerHTML = isValid ? "" : "A valid password must contain from 4 to 100 characters from the set: a-z A-Z 0-9 _-";
    return isValid ? true : false;
};

// on data change
eRegWindowEmail.addEventListener("change", ()=>fnCheckEmailField("reg") );
eRegWindowLogin.addEventListener("change", ()=>fnCheckLoginField() );
eRegWindowPassw.addEventListener("change", ()=>fnCheckPasswField() );

// on click Register in the regWindow
eRegWindowRegisterButton.addEventListener("click", async ()=>{
    if( fnCheckEmailField("reg") && fnCheckLoginField() && fnCheckPasswField() ){    // if no errors in user data:
        // take the data from fields
        let email = eRegWindowEmail.value;    
        let login = eRegWindowLogin.value;
        let passw = eRegWindowPassw.value;
        fnCancelRegWindow();
        // Send data to the Server and handle the answer
        try {
            const response = await fetch(
                "/newUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, login, passw })    // the user data are sent
            });

            let jResult;  // received data
            try {
                jResult = await response.json();
            } catch (e) {  throw new Error("The server returned a non-JSON response or an empty response.")  };

            if (response.ok) {
                fnMessageWindow("Registration success", "You can log in with your</br>login and password.");
            } else {
                fnMessageWindow("Registration error", `${jResult.error || response.statusText || "Unknown error"}`, true);
            };
        } catch (error) {
            fnMessageWindow("Server error", "Error while registration", true);
        };
    }
});

// on click Cancel in the regWindow
eRegWindowCancelButton.addEventListener("click", fnCancelRegWindow);
function fnCancelRegWindow(){
    eRegWindow.classList.remove("use");     // hide the window
    eRegWindowEmail.value = "";                 // clear the values
    eRegWindowLogin.value = "";
    eRegWindowPassw.value = "";
    eEmailError.classList.remove("error");     // switch off the error style
    eLoginError.classList.remove("error");
    ePasswError.classList.remove("error");
    eEmailError.innerHTML = "";                    // clear the error notes
    eLoginError.innerHTML = "";
    ePasswError.innerHTML = "";
};

function fnLoadUSettingsFromSS() {
    const jStoredSettings = sessionStorage.getItem('userSettings');
    if (jStoredSettings) {
        try {
            return JSON.parse(jStoredSettings);
        } catch (e) {
            console.error("Failed to parse user settings from SessionStorage", e);
            return false;
        }
    };
    return false;
};

function fnLoadAndApplyUSettingsFromSS() {
    const settings = fnLoadUSettingsFromSS();
    if (settings) { fnApplyUSettings(settings) };
};

function fnApplyUSettings(settings) {
    // login field: clean and hide
    eLoginFieldLogin.value = "";
    eLoginFieldPassw.value = "";
    eLoginField.classList.add("hideThis");
    // show the settings button
    eBtnSettings.classList.add("useThisFlex");
    eExitBtnField.classList.add("useThisFlex");
    // fday
    let fday = settings.fday;
    if (fday === "S") {eMenuFDay.value = "Sun"}
    else {eMenuFDay.value = "Mon"};
    if (weekStart !== fday) {
        weekStart = fday;
        if ( sessionStorage.getItem('userEvents') ) {
            fnLoadAndApplyUEvents();
        } else {
            fnCalendarMaker(currentYear, weekStart);
        };
    };
    eColored.checked = !settings.col; eColored.click();
    eNums.checked = !settings.num; eNums.click();
    eSeason.checked = !settings.ssn; eSeason.click();
};

function fnSaveUSettingsToSS(settings) {
    const userSettings = {
        sid: settings.sid,
        login: settings.login,
        email: settings.email,
        col: settings.col,
        num: settings.num,
        ssn: settings.ssn,
        fday: settings.fday
    };
    sessionStorage.setItem("userSettings", JSON.stringify(userSettings));
};

// Settings Window
eBtnSettings.addEventListener("click", ()=>{
    eCoverLayer = document.createElement("div");
    eCoverLayer.className = "coverLayer";
    eBody.append(eCoverLayer);
    eSettingsWindow.classList.add("useThis");
    fnFillSettingsWindow();
});

function fnFillSettingsWindow(){
    let settings = fnLoadUSettingsFromSS();
    if (settings) {
        eSwFDay.value = settings.fday === "M" ? "Mon" : "Sun";
        eSwColors.checked = !!settings.col;
        eSwNumbers.checked = !!settings.num;
        eSwSeasons.checked = !!settings.ssn;
    } else {
        console.error("Failed to get user settings from SessionStorage");
    };
};

// switch the password view
ePasswSwitch.addEventListener("click", ()=>{
    ePasswInput.value = "";
    ePasswInput.classList.toggle("on");
});

// on click Cancel button in the Settings Window
eSetWinCancelBtn.addEventListener("click", fnCloseSettingsWindow);

function fnCloseSettingsWindow() {
    ePasswInput.value = "";
    eSettingsWindow.classList.remove("useThis");
    eCoverLayer.remove();
};

// on click Save button in the Settings Window
eSetWinSaveBtn.addEventListener("click", ()=>{
    const storageSettings = fnLoadUSettingsFromSS();
    if (storageSettings) {
        // get Settings from the Settings Window
        const fday = eSwFDay.value === "Mon" ? "M" : "S";
        const col = eSwColors.checked ? 1 : 0;
        const num = eSwNumbers.checked ? 1 : 0;
        const ssn = eSwSeasons.checked ? 1 : 0;
        const passw = ePasswInput.value;
        if (   //  if we have any renewed data in the Settings Window
            fday !== storageSettings.fday ||
            Number(col) !== Number(storageSettings.col) ||
            Number(num) !== Number(storageSettings.num) ||
            Number(ssn) !== Number(storageSettings.ssn) ||
            !!passw
        ) {   // save renewed user data
            const sid = storageSettings.sid;
            const login = storageSettings.login;
            const email = storageSettings.email;
            fnSaveSettings(fday, col, num, ssn, passw, sid);
            fnSaveUSettingsToSS({fday, col, num, ssn, sid, login, email});
            fnApplyUSettings({fday, col, num, ssn});
        } else {
            fnCloseSettingsWindow(); // Close if no changes
        };
    } else {
        console.error("Failed to get user settings from SessionStorage into the Settings Window");
    };
});

async function fnSaveSettings(fday, col, num, ssn, passw, sid) {
    try {
        const response = await fetch(
            "/saveSettings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({fday, col, num, ssn, passw, sid})
        });

        let jResult;  // received data
        try {
            jResult = await response.json();
        } catch (e) {  throw new Error("The server returned a non-JSON response or an empty response.")  };

        if (response.ok) {
            console.log("The Settings are saved!");
        } else {
            fnMessageWindow("Settings saving error", `${jResult.error || response.statusText || "Unknown error"}`, true);
        };
    } catch (error) {
        fnMessageWindow("Server error", "Error while settings saving", true);
    } finally {
        fnCloseSettingsWindow()
    }
};

function fnSaveUEventsToSS(events) {
    sessionStorage.setItem("userEvents", JSON.stringify(events));
};

function fnLoadAndApplyUEvents() {
    const jStoredEvents = sessionStorage.getItem('userEvents');
    if (jStoredEvents) {
        fnCalendarMaker(currentYear, weekStart);

        const settings = fnLoadUSettingsFromSS();
        if (settings) {
            eNums.checked = !!settings.num;
            eSeason.checked = !!settings.ssn;
            eMNumbers.forEach( eMN => eMN.classList.toggle("hide", !eNums.checked) );
            eAlienMM.forEach(eAM => eAM.parentElement.parentElement.classList.toggle("hide", !eSeason.checked));
        };

        const events = JSON.parse(jStoredEvents);
        for(let  event of events) {
            if (+event.year === +currentYear) {    // if the event from the current year
                let month = +event.month;  // event's month
                let day = +event.day;             // event's day
                const eDaysRows = document.querySelectorAll(`.MtAround:has(div[aria-label="${month}"]:not(.alien)) table tr:nth-child(n+2)`);
                eDaysRows.forEach( eRow => {
                    eRow.querySelectorAll("td").forEach( eTD => {
                        if(+eTD.innerText === +day) {
                            eTD.setAttribute("data-event", "true");
                            eTD.style = `background-color: #${event.color};`;
                        }
                    });
                });
            };  /// current event
        };  /// for each event

    };
    fnDayCellsClickListener();
};

// the Event Window
function fnDayCellsClickListener() {
    if (sessionStorage.userEvents) {    // if a user is logged in
        for(let month=1; month<13; month++) {    // for all monthes of the year
            const eDaysRows = document.querySelectorAll(`.MtAround:has(div[aria-label="${month}"]:not(.alien)) table tr:nth-child(n+2)`);
            eDaysRows.forEach( eRow => {
                eRow.querySelectorAll("td").forEach( eTD => {
                    eTD.classList.add("notSelectable");
                    eTD.addEventListener( "click", ()=>fnOnDayClick(eTD, month) );
                    eTD.addEventListener( "dblclick", ()=>fnOnDayClick(eTD, month) );
                });
            });
        }
    };
    function fnOnDayClick(eTD, month) {
        const date = +eTD.innerHTML;
        if(!date) return;  // on empty cell do nothing

        if (eLastSelectedTd) { eLastSelectedTd.classList.remove("selected") };  // remove the border from previous td
        eTD.classList.add("selected");  // set border for current td
        eLastSelectedTd = eTD;  // remember the current td for the border removing

        eEventDate.innerHTML = fnDateStringMaker(currentYear, month, date);  // the date of the cell
        eEventContent.value = "";
        eEventColor.value = "#CDEDFF";
        if ( eTD.hasAttribute("data-event") ) {    // then fill the cell with the event data
            const jStoredEvents = sessionStorage.getItem('userEvents');
            const events = JSON.parse(jStoredEvents);
            for (let  event of events) {
                if (+event.year === +currentYear && +event.month === +month && +event.day === +date) {
                    eEventContent.value = event.content;
                    eEventColor.value = `#${event.color}`;
                }
            };
        };
        eEventWindow.classList.add("useThis");  // show the Event Window
        EventWinDragging(month);
    };
};

// Drag the Event Window in mobile version
function EventWinDragging(month) {
    if(moby) {
        // positioning Event Window after creating
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const eventWinWidth = eEventWindow.offsetWidth;
        const eventWinHeight = eEventWindow.offsetHeight;
        if (month >= 7) {
            eEventWindow.style.top = '10px';
            eEventWindow.style.left = '10px';
            eEventWindow.style.right = 'auto';
            eEventWindow.style.bottom = 'auto';
        } else {
            eEventWindow.style.top = (screenHeight - eventWinHeight - 10) + 'px';
            eEventWindow.style.left = (screenWidth - eventWinWidth - 10) + 'px';
            eEventWindow.style.right = 'auto';
            eEventWindow.style.bottom = 'auto';
        };
    
        // drag ability for Event Window
        eEventWindow.setAttribute("draggable","true"); 
        let isDragging = false;
        let offsetX, offsetY;
        eEventWindowHeader.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {    // if touch by one finger
                isDragging = true;
                const rect = eEventWindow.getBoundingClientRect();
                offsetX = event.touches[0].clientX - rect.left;
                offsetY = event.touches[0].clientY - rect.top;
                event.preventDefault();  // Prevent scrolling while dragging
            }
        });
        eEventWindow.addEventListener('touchmove', (event) => {
            if (isDragging && event.touches.length === 1) {    // if dragging by one finger
                const newX = event.touches[0].clientX - offsetX;
                const newY = event.touches[0].clientY - offsetY;
                const maxX = window.innerWidth - eEventWindow.offsetWidth;
                const maxY = window.innerHeight - eEventWindow.offsetHeight;
                eEventWindow.style.left = Math.min(Math.max(0, newX), maxX) + 'px';
                eEventWindow.style.top = Math.min(Math.max(0, newY), maxY) + 'px';
                event.preventDefault(); // Prevent scrolling while dragging
            }
        });
        eEventWindow.addEventListener('touchend', () => {
            isDragging = false;
        });
    
        // Also keep the mouse events for alternative devices
        eEventWindowHeader.addEventListener('mousedown', (event) => {
            isDragging = true;
            const rect = eEventWindow.getBoundingClientRect();
            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top;
            event.preventDefault();
        });
        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const newX = event.clientX - offsetX;
                const newY = event.clientY - offsetY;
                const maxX = window.innerWidth - eEventWindow.offsetWidth;
                const maxY = window.innerHeight - eEventWindow.offsetHeight;
                eEventWindow.style.left = Math.min(Math.max(0, newX), maxX) + 'px';
                eEventWindow.style.top = Math.min(Math.max(0, newY), maxY) + 'px';
                event.preventDefault();
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    
        eEventWindow.ondragstart = ()=>{ return false }; // for preventing use by browser, i.e. "ghost image"
    };
};

// on click Save button in the Event Window
eEventWinSaveBtn.addEventListener("click", async ()=>{
    // get data from the Event Window
    const date = eEventDate.innerHTML;
    const year = Number( date.slice(-4) );
    const month = Number( yearMM.indexOf( date.split(" ")[1] )+1 );
    const day = Number( date.split(" ")[2].slice(undefined,-1) );
    const content = eEventContent.value.trim();
    const color = (eEventColor.value).slice(1) ;
    if( color === "ffffff" ) {
        fnMessageWindow("Event error", "It's a bad idea to create an event<br/>with a white background", true);
        return;
    };
    // event id (if undefined then it's new event)
    let id;
    let jStoredEvents = sessionStorage.getItem('userEvents');
    let events = JSON.parse(jStoredEvents);
    const foundEvent = events.find( event => +event.year === year && +event.month === month && +event.day === day );
    if (foundEvent) { id = foundEvent.id };
    // if no content
    if( !content ) {
        if(id) {    // for an exist event it means delete the event
            // delete the event from the server
            await fnDeleteEvent(id);
            // save changes to Session Storage
            events = events.filter( event => event.id !== id );
            sessionStorage.setItem( "userEvents", JSON.stringify(events) );
            // apply changes
            fnLoadAndApplyUEvents();
        }
        else {    // for new event
            fnMessageWindow("Saving error", "Nothing to save", true);
        };
        return;
    };
    // sid
    const settings = fnLoadUSettingsFromSS();
    const sid = settings ? settings.sid : null;
    if (sid) {
        // save the event to the server
        const newID = await fnSaveEvent(sid, id, year, month, day, color, content);
        // if it's new event - get its id
        if(!id){id = newID};
        // save changes to Session Storage
        events.push({id, year, month, day, color, content});
        sessionStorage.setItem("userEvents", JSON.stringify(events));
        // apply changes
        fnLoadAndApplyUEvents();
    } else {
        fnMessageWindow("Error", "User not logged in or session ID missing.", true);
    };
});

async function fnSaveEvent(sid, id, year, month, day, color, content) {
    try {
        const response = await fetch(
            "/saveEvent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({sid, id, year, month, day, color, content})
        });

        let jResult;  // received data
        try {
            jResult = await response.json();
        } catch (jsonErr) {  throw new Error("The server returned a non-JSON response or an empty response.")  };

        if (response.ok) {
            fnEventNotice("SAVED");
            return jResult.id;
        } else {
            fnMessageWindow("An error while the Event saving", `${jResult.error || response.statusText || "Unknown error"}`, true);
        };

    } catch (error) {
        fnMessageWindow("Server error", "Error while the event saving", true);
    };
};

function fnEventNotice(text) {
    let eNotice = document.createElement("div");
    eNotice.innerHTML = `<span>${text}</span>`;
    eNotice.classList.add("eventNotice");
    eEventWindow.append(eNotice);
    setTimeout(() => eNotice.remove(), 1000);
};

// on click Cancel button in the Event Window
eEventWinCancelBtn.addEventListener("click", fnCloseEventWindow);

function fnCloseEventWindow() {
    // hide the eventWindow
    eEventWindow.classList.remove("useThis");
    // remove the border from last cell
    if (eLastSelectedTd) {
        eLastSelectedTd.classList.remove("selected");
        eLastSelectedTd = undefined;
    };
};

async function fnDeleteEvent(id) {
    try {
        const response = await fetch(
            "/deleteEvent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id})
        });

        let jResult;  // received data
        try {
            jResult = await response.json();
        } catch (e) {  throw new Error("The server returned a non-JSON response or an empty response.")  };

        if (response.ok) {
            fnEventNotice("DELETED");
        } else {
            fnMessageWindow("An error while the Event deleting", `${jResult.error || response.statusText || "Unknown error"}`, true);
        };

    } catch (error) {
        fnMessageWindow("Server error", "Error while the event deleting", true);
    };
};

eBtnPrint.addEventListener( "click", ()=>{
    fnMarkToday("off");
    eMain.classList.toggle( 'nocolor-mode', !eColored.checked );
    window.print();
    fnMarkToday("on");
} );

// on click the Log_out button
eExitBtn.addEventListener("click", ()=>{
    fnLoggingOut();
    window.location.reload();
});

function fnLoggingOut() {
    sessionStorage.removeItem("userSettings");
    sessionStorage.removeItem("userEvents");
};

// Open/close the mobile menu
eBtnMenu.addEventListener("click", (evnt)=>{
    evnt.stopPropagation();
    eAside.classList.toggle("use");
});

// Close the mobile menu by clicking beyond the menu
if (moby) {
    // The body menu doesn't respond to clicks inside it
    eAside.addEventListener( "click", evnt=>{ evnt.stopPropagation() } );
    // On clicking beyond the open menu - close the menu
    eBody.addEventListener("click", ()=>{
        if (eAside.classList.contains("use")) {
            eAside.classList.remove("use")
        }
    });
};

// Stop the program work
document.getElementById('shutdownButton').addEventListener('click', ()=>{
    fnLoggingOut();
    fetch('/shutdown', {method: 'POST'})
        .then( ()=>window.close() )
        .catch( error => alert('Error: ' + error) );
});
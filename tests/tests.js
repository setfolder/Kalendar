const mochaField = document.createElement("div");
mochaField.id = "mocha";
mochaField.style = `
position:absolute;
top:0; right:0;
z-index:1000;
border: 2px solid violet; border-radius:4px;
background-color:white;
padding: 5px 10px;
font-family:Verdana; font-size:100%;
max-width: 250px;
max-height: 99vh;
overflow: scroll;`;
document.body.append(mochaField);

function MinimalReporter(runner) {
    Mocha.reporters.Base.call(this, runner);
    let passes = 0;
    let failures = 0;
    runner.on('suite', function(suite) {
        const el = document.createElement('div');
        el.style = "text-decoration: underline 1px wavy";
        if (suite.title) {el.textContent = suite.title}
            else if(passes+failures) {el.textContent = "Next section"};    // if not the first
        document.getElementById('mocha').appendChild(el);
    });
    runner.on('pass', function(test) {
        passes++;
        const el = document.createElement('div');
        el.style = "color:green;";
        el.textContent = `✔\xA0${test.title}`;    // not breakeable space
        document.getElementById('mocha').appendChild(el);
    });
    runner.on('fail', function(test, err) {
        failures++;
        const el = document.createElement('div');
        el.style = "color:red;";
        el.textContent = `✘\xA0${test.title}`;
        document.getElementById('mocha').appendChild(el);
    });
    runner.on('end', function() {
        const summary = document.createElement('div');
        summary.innerHTML = `<span style="color:green">${passes} passed</span>,
            <span style="color:red">${failures} failed</span>`;
        summary.style = "font-weight:bold; margin-bottom:10px;";
        document.getElementById('mocha').prepend(summary);
    });
};

mocha.setup({ ui: 'bdd', reporter: MinimalReporter });
let assert = chai.assert;


describe("HTML Elements",()=>{
    it("eBody exists", () => {
        assert.instanceOf(eBody, window.HTMLElement);
    });
    it("eMain exists", () => {
        assert.instanceOf(eMain, window.HTMLElement);
    });
    it("eAside exists", () => {
        assert.instanceOf(eAside, window.HTMLElement);
    });
    it("eColored exists", () => {
        assert.instanceOf(eColored, window.HTMLElement);
    });
    it("eNums exists", () => {
        assert.instanceOf(eNums, window.HTMLElement);
    });
    it("eSeason exists", () => {
        assert.instanceOf(eSeason, window.HTMLElement);
    });
    it("eBtnSettings exists", () => {
        assert.instanceOf(eBtnSettings, window.HTMLElement);
    });
    it("eSetWinSaveBtn exists", () => {
        assert.instanceOf(eSetWinSaveBtn, window.HTMLElement);
    });
    it("eSetWinCancelBtn exists", () => {
        assert.instanceOf(eSetWinCancelBtn, window.HTMLElement);
    });
    it("eLoginField exists", () => {
        assert.instanceOf(eLoginField, window.HTMLElement);
    });
    it("eLoginFieldLogin exists", () => {
        assert.instanceOf(eLoginFieldLogin, window.HTMLElement);
    });
    it("eLoginFieldPassw exists", () => {
        assert.instanceOf(eLoginFieldPassw, window.HTMLElement);
    });
    it("eLoginButton exists", () => {
        assert.instanceOf(eLoginButton, window.HTMLElement);
    });
    it("eRegButton exists", () => {
        assert.instanceOf(eRegButton, window.HTMLElement);
    });
    it("eRegWindow exists", () => {
        assert.instanceOf(eRegWindow, window.HTMLElement);
    });
    it("eRegWindowEmail exists", () => {
        assert.instanceOf(eRegWindowEmail, window.HTMLElement);
    });
    it("eEmailError exists", () => {
        assert.instanceOf(eEmailError, window.HTMLElement);
    });
    it("eRegWindowLogin exists", () => {
        assert.instanceOf(eRegWindowLogin, window.HTMLElement);
    });
    it("eLoginError exists", () => {
        assert.instanceOf(eLoginError, window.HTMLElement);
    });
    it("eRegWindowPassw exists", () => {
        assert.instanceOf(eRegWindowPassw, window.HTMLElement);
    });
    it("ePasswError exists", () => {
        assert.instanceOf(ePasswError, window.HTMLElement);
    });
    it("ePassSwitch exists", () => {
        assert.instanceOf(ePassSwitch, window.HTMLElement);
    });
    it("eRegWindowRegisterButton exists", () => {
        assert.instanceOf(eRegWindowRegisterButton, window.HTMLElement);
    });
    it("eRegWindowCancelButton exists", () => {
        assert.instanceOf(eRegWindowCancelButton, window.HTMLElement);
    });
    it("eWrongPasswWindow exists", () => {
        assert.instanceOf(eWrongPasswWindow, window.HTMLElement);
    });
    it("eWrongPassWinOkBtn exists", () => {
        assert.instanceOf(eWrongPassWinOkBtn, window.HTMLElement);
    });
    it("eForgotLink exists", () => {
        assert.instanceOf(eForgotLink, window.HTMLElement);
    });
    it("eSendPasswWindow exists", () => {
        assert.instanceOf(eSendPasswWindow, window.HTMLElement);
    });
    it("eSendPasswWinEmail exists", () => {
        assert.instanceOf(eSendPasswWinEmail, window.HTMLElement);
    });
    it("eSendPassWinEmailError exists", () => {
        assert.instanceOf(eSendPassWinEmailError, window.HTMLElement);
    });
    it("eSendPassWinSendBtn exists", () => {
        assert.instanceOf(eSendPassWinSendBtn, window.HTMLElement);
    });
    it("eSendPassWinCancelBtn exists", () => {
        assert.instanceOf(eSendPassWinCancelBtn, window.HTMLElement);
    });
    it("eMesWindow exists", () => {
        assert.instanceOf(eMesWindow, window.HTMLElement);
    });
    it("eMesWindowHeader exists", () => {
        assert.instanceOf(eMesWindowHeader, window.HTMLElement);
    });
    it("eMesWindowContent exists", () => {
        assert.instanceOf(eMesWindowContent, window.HTMLElement);
    });
    it("eMesWindowBtn exists", () => {
        assert.instanceOf(eMesWindowBtn, window.HTMLElement);
    });
    it("ePasswSwitch exists", () => {
        assert.instanceOf(ePasswSwitch, window.HTMLElement);
    });
    it("ePasswInput exists", () => {
        assert.instanceOf(ePasswInput, window.HTMLElement);
    });
    it("eSwColors exists", () => {
        assert.instanceOf(eSwColors, window.HTMLElement);
    });
    it("eSwNumbers exists", () => {
        assert.instanceOf(eSwNumbers, window.HTMLElement);
    });
    it("eSwSeasons exists", () => {
        assert.instanceOf(eSwSeasons, window.HTMLElement);
    });
    it("eSwFDay exists", () => {
        assert.instanceOf(eSwFDay, window.HTMLElement);
    });
    it("eMenuFDay exists", () => {
        assert.instanceOf(eMenuFDay, window.HTMLElement);
    });
    it("eDisplayDate exists", () => {
        assert.instanceOf(eDisplayDate, window.HTMLElement);
    });
    it("eExitBtnField exists", () => {
        assert.instanceOf(eExitBtnField, window.HTMLElement);
    });
    it("eExitBtn exists", () => {
        assert.instanceOf(eExitBtn, window.HTMLElement);
    });
    it("eEventWindow exists", () => {
        assert.instanceOf(eEventWindow, window.HTMLElement);
    });
    it("eEventWindowHeader exists", () => {
        assert.instanceOf(eEventWindowHeader, window.HTMLElement);
    });
    it("eEventDate exists", () => {
        assert.instanceOf(eEventDate, window.HTMLElement);
    });
    it("eEventContent exists", () => {
        assert.instanceOf(eEventContent, window.HTMLElement);
    });
    it("eEventColor exists", () => {
        assert.instanceOf(eEventColor, window.HTMLElement);
    });
    it("eEventWinSaveBtn exists", () => {
        assert.instanceOf(eEventWinSaveBtn, window.HTMLElement);
    });
    it("eEventWinCancelBtn exists", () => {
        assert.instanceOf(eEventWinCancelBtn, window.HTMLElement);
    });
    it("eBtnPrint exists", () => {
        assert.instanceOf(eBtnPrint, window.HTMLElement);
    });
    it("eCalendar exists", () => {
        assert.instanceOf(eCalendar, window.HTMLElement);
    });
    it("eYearNav exists", () => {
        assert.instanceOf(eYearNav, window.HTMLElement);
    });
    it("eMnWidth exists", () => {
        assert.instanceOf(eMnWidth, window.HTMLElement);
    });
});

describe("Exist",()=>{
    it("nowYear exists", () => {
        assert.isOk( nowYear );
    });
});

describe("Logical format",()=>{
    it("moby is logical", () => {
        assert.isBoolean(moby);
    });
});

describe("Date type",()=>{
    it("nowDate is a Date", () => {
        assert.instanceOf(nowDate, Date);
    });
});

describe("Array type",()=>{
    it("yearMM is an array", () => {
        assert.isArray( yearMM );
    });
    it("MM is an array", () => {
        assert.isArray( MM );
    });
});

describe("Measuring",()=>{
    it("bodyWidth is OK", () => {
        assert(bodyWidth > 0);
    });
    it("weekStart is M or S", () => {
        assert( weekStart === "M" || weekStart === "S" );
    });
    it("eMain.innerHTML is OK", () => {
        assert.isOk( eMain.innerHTML );
    });
    it("eCalendar.innerHTML is OK", () => {
        assert.isOk( eCalendar.innerHTML );
    });
});

describe("Functions",()=>{
    it("fnDateStringMaker() is OK", () => {
        assert(  fnDateStringMaker(2025, 8, 3) === "Sun, August 03, 2025"  );
    });
    it("fnCalendarMaker() is OK", () => {
        assert( fnCalendarMaker(2025, "M") === undefined );
    });
    it("fnMarkToday() is OK", () => {
        assert( fnMarkToday("on") === undefined );
    });
    it("fnHighlightWeekEnd() is OK", () => {
        assert( fnHighlightWeekEnd(weekStart) === undefined );
    });
    it("fnColorizer() is OK", () => {
        assert( fnColorizer() === undefined );
    });
    it("on/off month numbers is OK", () => {
        const result = eMNumbers.forEach( mn => mn.classList.toggle("hide", !eNums.checked) );
        assert( result === undefined );
    });
    it("on/off seasons is OK", () => {
        const result = eAlienMM.forEach( am => am.parentElement.parentElement.classList.toggle("hide", !eSeason.checked) );
        assert( result === undefined );
    });
    it("fnContentAutoZoom is OK", () => {
        assert( fnContentAutoZoom() === undefined );
    });
    it("fnCheckLogLoginField when correct", () => {
        const result = fnCheckLogLoginField("Ex@ample_123-");
        assert.isBoolean(result);
        assert.isOk(result);
    });
    it("fnCheckLogPasswField when correct", () => {
        const result = fnCheckLogPasswField("Example_123-");
        assert.isBoolean(result);
        assert.isOk(result);
    });
});

describe("fnCheckLogLoginField when incorrect", () => {
    let originalFnMessageWindow;
    before(() => {    // block called error window
        originalFnMessageWindow = window.fnMessageWindow;  // error window - to cash
        window.fnMessageWindow = () => {}; // dummy
    });
    after(() => {
        window.fnMessageWindow = originalFnMessageWindow; // restore the error window
    });
    it("test", () => {
        const result1 = fnCheckLogLoginField("Ex ample_123-");  // space
        const result2 = fnCheckLogLoginField("Ex");                     // short
        const result3 = fnCheckLogLoginField("Exsfssdf!");            // symbol !
        assert.isBoolean(result1);
        assert.isNotOk(result1);
        assert.isBoolean(result2);
        assert.isNotOk(result2);
        assert.isBoolean(result3);
        assert.isNotOk(result3);
    });
});

describe("fnCheckLogPasswField when incorrect", () => {
    let originalFnMessageWindow;
    before(() => {    // block called error window
        originalFnMessageWindow = window.fnMessageWindow;  // error window - to cash
        window.fnMessageWindow = () => {}; // dummy
    });
    after(() => {
        window.fnMessageWindow = originalFnMessageWindow; // restore the error window
    });
    it("test", () => {
        const result1 = fnCheckLogPasswField("Ex ample_123-");   // space
        const result2 = fnCheckLogPasswField("Exe");                    // short
        const result3 = fnCheckLogPasswField("Exsfssdf!");            // symbol !
        assert.isBoolean(result1);
        assert.isNotOk(result1);
        assert.isBoolean(result2);
        assert.isNotOk(result2);
        assert.isBoolean(result3);
        assert.isNotOk(result3);
    });
});

mocha.run();
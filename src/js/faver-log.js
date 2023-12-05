let userName = "guest";
let refConsoleLog;

function initRefsForFaverLog(ConsoleLog) {
	refConsoleLog = ConsoleLog;
}

function setUserName(name) {
	userName = name;
}

function faverLog(info, cmd) {
	if (!cmd) cmd = "";

	let logColor = "";

	if (info.includes("E:") || info.includes("denied")) logColor = "style='color: #822'";

	if (info.includes("W:")) logColor = "style='color: #882'";

	if (info.includes("allowed")) logColor = "style='color: #282'";

	let logInfo = `
		<span ${logColor}>${info}</span>
	`;

	const newLog = document.createElement("li");

	newLog.innerHTML = `
		<b style="color: #358">${userName}@faver</b>:~$ <b style="color: #883">${cmd}</b>
		<br/>
		${logInfo}
		<br/><br/>
	`;

	refConsoleLog.append(newLog);

	refConsoleLog.scrollTop = refConsoleLog.scrollHeight;

	console.log(`\x1b[01;36m${userName}@faver\x1b[0m:~$ \x1b[33m${cmd}\x1b[0m\n\n${info}\n\n`);
}

export { faverLog, setUserName, initRefsForFaverLog };

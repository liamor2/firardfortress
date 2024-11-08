function logToConsole(type, origin, message, data = null, color = "default") {
  const error = new Error();
  const stack = error.stack || "";

  const stackLines = stack.split("\n");
  const callerLine = stackLines[2];

  const callerInfo = callerLine.match(/at\s+(?:.*\()?(.*\/scripts\/.*:\d+):\d+\)?/);
  const fileLineInfo = callerInfo ? `${callerInfo[1]}` : "Unknown";

  const currentTime = new Date().toLocaleTimeString();
  const formattedMessage = `%cFirard Fortress System | ${origin} | ${message}\n${fileLineInfo} | ${currentTime}`;
  const style = `color: ${color}`;
  
  if (data === null) {
    data = "";
  }

  switch (type) {
    case "debug":
      console.log(formattedMessage, style, data);
      break;
    case "error":
      console.error(formattedMessage, style, data);
      break;
    case "warn":
      console.warn(formattedMessage, style, data);
      break;
    default:
      console.log(formattedMessage, style, data);
      break;
  }
}

export {
  logToConsole
};

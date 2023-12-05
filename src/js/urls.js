let SERVER = "https://script.google.com/macros/s/AKfycbywPWqsIIIRrXgy3vo1VtW8OHqOjGNtX1FSUQcpq8tGKXdvy6AaApZbArvcCV8Lw2hkNg/exec";
let DATABASE = "";

function getServerURL() {
	return SERVER;
}

function getDatabaseURL() {
	return DATABASE;
}

function setDatabaseURL(url) {
	DATABASE = url;
}

export { getServerURL, getDatabaseURL, setDatabaseURL };

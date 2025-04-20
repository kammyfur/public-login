try {

const crypto = require('crypto');
const fs = require('fs');

id = crypto.randomBytes(48).toString("hex");

console.log("========================================");
console.log("");
console.log("Welcome!");
console.log("");
console.log("Please open the following URL in your web browser to log in with your Minteck Account:");
console.log("    https://minteck.org/mwspub/?_=" + id);
console.log("");
fs.writeFileSync("./temp/" + id, "==WAITING==");
require('child_process').exec("chmod 777 ./temp/" + id);
process.stdout.write("Waiting for connection approval");

global.login = setInterval(() => {
    process.stdout.write(".");
    if (fs.readFileSync("./temp/" + id).toString() !== "==WAITING==") {
        clearInterval(login);
        data = JSON.parse(fs.readFileSync("./temp/" + id).toString());
        uid = data.id.split("-").join("");
        console.log(`\nLogged in as ${data.name} (${data.profile.email.email}) as ${uid}@mws-public`);
        try { require('child_process').execSync("bash -c \"docker exec mws-public useradd -m " + uid + " &>/dev/null\""); } catch (e) {}
        require('child_process').execSync("docker exec -ti mws-public su " + uid + " -c bash", { stdio: 'inherit' });
    }
}, 2000)

} catch (e) {

require('fs').writeFileSync("./crash.log", e.stack);
console.log(" == Sorry, something went wrong. Please try again later == ")

}

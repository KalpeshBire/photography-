require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

// Mask password for display
const maskedUri = uri ? uri.replace(/:([^:@]+)@/, ":****@") : "undefined";

console.log("---------------------------------------------------");
console.log("Checking MongoDB Connection...");
console.log(`URI Found: ${maskedUri}`);
console.log("---------------------------------------------------");

if (!uri) {
    console.error("❌ ERROR: MONGO_URI is missing in .env file!");
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log("✅ SUCCESS! Connected to MongoDB.");
        console.log("The credentials in .env are correct.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ CONNECTION FAILED");
        console.error(`Error Code: ${err.code}`);
        console.error(`Error Name: ${err.codeName}`);
        console.error(`Message: ${err.message}`);
        
        if (err.code === 8000) {
            console.log("\n⚠️  DIAGNOSIS: Authentication Failed");
            console.log("The username or password in your .env file is incorrect.");
            console.log("Please check for:");
            console.log("1. Extra spaces in the password.");
            console.log("2. Special characters that need URL encoding.");
            console.log("3. Copying the wrong string from Atlas.");
        }
        process.exit(1);
    });

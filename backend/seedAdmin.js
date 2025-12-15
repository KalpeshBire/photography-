const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const User = require("./models/User");
require("./db/connection"); // Connect using existing connection logic

const seedAdmin = async () => {
    // Wait for connection to be ready (if not handled by require)
    // Actually connection.js connects immediately.
    
    // Give it a moment to connect
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const email = "admin@example.com";
        const password = "newpassword123"; // Strong password
        
        console.log(`Checking for admin user: ${email}`);

        let user = await User.findOne({ email });
        
        if (user) {
            console.log("Admin user exists. Updating password...");
            user.password = password; // Will be hashed by pre-save hook
            await user.save();
            console.log("✅ Admin password updated.");
        } else {
            console.log("Creating new admin user...");
            user = new User({ 
                username: "SuperAdmin", 
                email, 
                password, 
                role: "admin" 
            });
            await user.save();
            console.log("✅ Admin user created.");
        }
        
        console.log(`\ncredentials:\nEmail: ${email}\nPassword: ${password}\n`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed error name:", error.name);
        console.error("❌ Seed error message:", error.message);
        // console.error("❌ Seed error stack:", error.stack);
        process.exit(1);
    }
};

seedAdmin();

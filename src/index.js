import dns from  "dns";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";
dotenv.config();
dns.setServers(["1.1.1.1" , "8.8.8.8"]);

const startServer = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
};


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}\n`);
});
startServer();

export default app;
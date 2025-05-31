const mongoose = require('mongoose');

const connectionWithRetry = async (retryCount = 3, delayMs = 2000) => {
    let attempt = 0;

    const connect = async() => {
        try {
            await mongoose.connect(process.env.MONGO_URI,{
                // newUrlParser: true,
                // useUnifiedTopology: true
            });

            console.log("DB Connected successfully!");
        } catch (err) {
            attempt++;

            console.log(`Mongo connection failed (attempts ${attempt}): `, err.message);

            if(attempt < retryCount){
                console.log(`Retrying MongoDB connection in ${delayMs / 1000} seconds...`);
                setTimeout(connect, delayMs);
            }else{
                console.log("MongoDB connection failed after 3 attempts");
                process.exit(1)
            }
        }
    }
    connect();
}

module.exports = connectionWithRetry;
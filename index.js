
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import { jwtVerify, createRemoteJWKSet } from "jose";

dotenv.config();

const app = express();
const port = process.env.PORT;
const uri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());


//MONGO CONNECTION
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


//JWT SETUP
const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
);

//VERIFY JWT 
const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    console.log(payload);
    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    return res.status(403).json({ message: "Access Forbidden" });
  }
};


async function run() {

}


//ROOT ENDPOINT
app.get("/", (req, res) => {
  res.send("IT WORKS MARTY!");
});


app.listen(port, () => {
  console.log(`Actively listening: port ${port}`);
});
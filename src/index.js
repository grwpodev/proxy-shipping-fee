"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
require("dotenv/config");
const app = (0, fastify_1.default)();
const CORS = {
    origin: "*",
    methods: ["GET", "POST"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    exposedHeaders: "Authorization",
};
app.register(cors_1.default, CORS);
const calculateShipping = async (request, reply) => {
    const apiUrl = "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate";
    try {
        const apiResponse = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accepts: "application/json",
                Authorization: `Bearer ${process.env.MELHOR_ENVIO_AUTH_TOKEN}`,
                "User-Agent": "Aplicação bruno@woley.com",
            },
            body: JSON.stringify(request.body),
        });
        const data = await apiResponse.json();
        reply.send(data);
    }
    catch (error) {
        console.log(error);
        reply.status(500).send({ error });
    }
};
app.post("/proxy/shipment/calculate", calculateShipping);
app.listen({ port: 3000 }, (err, address) => {
    if (err)
        console.error(err);
    console.log(`app listening at ${address}`);
});

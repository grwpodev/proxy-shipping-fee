import fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";

const app = fastify();

const CORS = {
  origin: "*",
  methods: ["GET", "POST"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  exposedHeaders: "Authorization",
};

app.register(cors, CORS);

const calculateShipping = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const apiUrl =
    "https://melhorenvio.com.br/api/v2/me/shipment/calculate";

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
  } catch (error) {
    console.log(error);
    reply.status(500).send({ error });
  }
};

app.post("/proxy/shipment/calculate", calculateShipping);

app.listen({ port: 3000 }, (err, address) => {
  if (err) console.error(err);
  console.log(`app listening at ${address}`);
});

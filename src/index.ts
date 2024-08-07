import fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";

const port = Number(process.env.PORT) || 3000;
const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;

const app = fastify();

const CORS = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  optionsSuccessStatus: 204,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "User-Agent",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
  exposedHeaders: "Authorization",
  "Access-Control-Allow-Origin": "*",
};

app.register(cors, CORS);

const calculateShipping = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const apiUrl = "https://melhorenvio.com.br/api/v2/me/shipment/calculate";

  try {
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.MELHOR_ENVIO_AUTH_TOKEN}`,
        "User-Agent": "Aplicação bruno@woley.com",
      },
      body: JSON.stringify(request.body),
    });

    if (!apiResponse.ok) {
      throw new Error(`API response not ok: ${apiResponse.statusText}`);
    }

    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Credentials", "true");
    reply.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    reply.header(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    reply.header("Accept", "application/json");
    reply.header("Origin", "*");

    const data = await apiResponse.json();
    reply.send(data);
  } catch (error) {
    console.log(error);
    reply.status(500).send({ error });
  }
};

app.post("/proxy/shipment/calculate", calculateShipping);

app.listen({ port, host }, (err, address) => {
  if (err) {
    console.error(err);
    app.log.error(err);
    process.exit(1);
  }
  console.log(`app listening at ${address}`);
});

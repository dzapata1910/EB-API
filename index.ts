import { obtenerPropiedades } from "./easybroker.ts";

const FRONTEND_ORIGIN = "http://localhost:3051";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const server = Bun.serve({
  port: 3055,

  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (url.pathname === "/" && req.method === "GET") {
      return Response.json(
        {
          mensaje: "API de EasyBroker funcionando",
          endpoints: {
            propiedades: "/api/properties?page=1&limit=3",
          },
        },
        { headers: corsHeaders },
      );
    }

    if (url.pathname === "/api/properties" && req.method === "GET") {
      try {
        const page = Math.max(
          1,
          Number(url.searchParams.get("page")) || 1,
        );

        const requestedLimit =
          Number(url.searchParams.get("limit")) || 20;

        const limit = Math.min(50, Math.max(1, requestedLimit));

        const resultado = await obtenerPropiedades(page, limit);

        return Response.json(resultado, {
          headers: corsHeaders,
        });
      } catch (error) {
        console.error(
          "Error consultando EasyBroker:",
          error instanceof Error ? error.message : error,
        );

        return Response.json(
          { error: "No se pudieron consultar las propiedades" },
          {
            status: 502,
            headers: corsHeaders,
          },
        );
      }
    }

    return Response.json(
      { error: "Endpoint no encontrado" },
      {
        status: 404,
        headers: corsHeaders,
      },
    );
  },
});

console.log(`Servidor activo en ${server.url}`);
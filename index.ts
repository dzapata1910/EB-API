import { obtenerPropiedades } from "./easybroker.ts";

const server = Bun.serve({
  port: 3055,

  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/" && req.method === "GET") {
  return Response.json({
    mensaje: "API de EasyBroker funcionando",
    endpoints: {
      propiedades: "/api/properties?page=1&limit=3",
    },
  });
}

    if (url.pathname === "/api/properties" && req.method === "GET") {
      try {
        const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
        const requestedLimit = Number(url.searchParams.get("limit")) || 20;
const limit = Math.min(50, Math.max(1, requestedLimit));
const resultado = await obtenerPropiedades(page, limit);

        return new Response(JSON.stringify(resultado, null, 2), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
      } catch (error) {
        console.error(
  "Error consultando EasyBroker:",
  error instanceof Error ? error.message : error,
);

        return Response.json(
          { error: "No se pudieron consultar las propiedades" },
          { status: 502 },
        );
      }
    }

    return Response.json(
      { error: "Endpoint no encontrado" },
      { status: 404 },
    );
  },
});

console.log(`Servidor activo en ${server.url}`);
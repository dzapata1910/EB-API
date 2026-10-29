const apikey = process.env.EASYBROKER_API_KEY;

if (!apikey) {
  throw new Error("Falta configurar la variable de entorno EASYBROKER_API_KEY");
}

const headers = {
  "X-Authorization": apikey,
  "Accept": "application/json",
};

const limit = 50;
let pagina = 1;
let total = 0;
let contador = 0;

while (true) {
  const response = await fetch(
    `https://api.easybroker.com/v1/properties?page=${pagina}&limit=${limit}`,
    { method: "GET", headers },
  );

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} en la página ${pagina}`);
  }

  const data = await response.json();

  total = data.pagination.total;

  console.log(`Página ${pagina}: ${data.content.length} propiedades`);

  for (const propiedad of data.content) {
    console.log("----------------------------");
    console.log("ID:", propiedad.public_id);
    console.log("Título:", propiedad.title);
    console.log("Ubicación:", propiedad.location);
    console.log("Tipo:", propiedad.property_type);

    for (const operacion of propiedad.operations) {
      console.log(operacion.type, operacion.formatted_amount);
    }

    contador++;
  }

  if (data.content.length === 0 || contador >= total) {
    break;
  }

  pagina++;
}

console.log("----------------------------");
console.log("Total reportado por EasyBroker:", total);
console.log("Propiedades procesadas:", contador);
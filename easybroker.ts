const API_URL = "https://api.easybroker.com/v1/properties";

const apiKey = process.env.EASYBROKER_API_KEY;

if (!apiKey) {
  throw new Error("Falta configurar EASYBROKER_API_KEY");
}

export async function obtenerPropiedades(
  page = 1,
  limit = 20,
) {
  const response = await fetch(
    `${API_URL}?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "X-Authorization": apiKey,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`EasyBroker respondió HTTP ${response.status}`);
  }

  const data = await response.json();

  return {
    pagination: data.pagination,
    cantidad: data.content.length,
    propiedades: data.content,
  };
}
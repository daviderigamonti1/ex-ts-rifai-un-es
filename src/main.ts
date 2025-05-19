// Scegli un esercizio tra Il compleanno dello chef e Dashboard della città del Modulo 1 – Advanced JavaScript e riscrivilo utilizzando TypeScript.
// Tipizza tutte le variabili, funzioni e strutture dati in modo esplicito, e verifica che il comportamento finale sia identico alla versione in JavaScript.
// ✨ Puoi partire da un nuovo progetto Vite oppure aggiungere TypeScript a un progetto esistente.

import dayjs from "dayjs";

type Recipe = {
  id: number,
  name: string,
  userId: number
}

function isRecipe(data: unknown): data is Recipe {
  return (
    typeof data === "object" && data !== null &&
    "id" in data && typeof data.id === "number" &&
    "name" in data && typeof data.name === "string" &&
    "userId" in data && typeof data.userId === "number"
  )
}

type Chef = {
  id: number,
  firstName: string,
  lastName: string,
  birthDate: string
}

function isChef(data: unknown): data is Chef {
  return (
    typeof data === "object" && data !== null &&
    "id" in data && typeof data.id === "number" &&
    "firstName" in data && typeof data.firstName === "string" &&
    "lastName" in data && typeof data.lastName === "string" &&
    "birthDate" in data && typeof data.birthDate === "string"
  )
}

async function getChefBirthday(id: number): Promise<string | null> {
  let ricetta: Recipe;
  try {
    const recipeJson = await fetch(`https://dummyjson.com/recipes/${id}`);
    if (!recipeJson.ok) {
      throw new Error(`Errore HTTP ${recipeJson.status}: ${recipeJson.statusText}`)
    }
    const recipeData = await recipeJson.json();

    if (!isRecipe(recipeData)) {
      throw new Error("Formato dei dati della ricetta non valido");
    }
    ricetta = recipeData;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore durante il recupero della ricetta:", err.message);
    } else {
      console.error("Errore sconosciuto:", err);
    }
    return null;
  }

  let chef: Chef;
  try {
    const chefJson = await fetch(`https://dummyjson.com/users/${ricetta.userId}`);
    if (!chefJson.ok) {
      throw new Error(`Errore HTTP ${chefJson.status}: ${chefJson.statusText}`)
    }
    const chefData = await chefJson.json();

    if (!isChef(chefData)) {
      throw new Error("Formato dei dati dello chef non valido");
    }
    chef = chefData;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Impossibile recuperare lo chef con id ${ricetta.userId}:`, err.message);
    } else {
      console.error("Errore sconosciuto:", err);
    }
    return null;
  }
  const dataFormattata = dayjs(chef.birthDate).format("DD-MM-YYYY");
  return dataFormattata;
}


(async () => {
  try {
    const birthday = await getChefBirthday(1);
    console.log("Data di nascita dello chef:", birthday);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore:", err.message);
    } else {
      console.error("Errore sconosciuto:", err);
    }
  }
})();
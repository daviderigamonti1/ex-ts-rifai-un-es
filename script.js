// In questo esercizio, utilizzerai async/await per creare la funzione getChefBirthday(id). Questa funzione accetta un id di una ricetta e deve:
// Recuperare la ricetta da https://dummyjson.com/recipes/{id}
// Estrarre la proprietà userId dalla ricetta
// Usare userId per ottenere le informazioni dello chef da https://dummyjson.com/users/{userId}
// Restituire la data di nascita dello chef
// Note del docente
// Scrivi la funzione getChefBirthday(id), che deve:
// Essere asincrona (async).
// Utilizzare await per chiamare le API.
// Restituire una Promise con la data di nascita dello chef.
// Gestire gli errori con try/catch

async function getChefBirthday(id) {
    let ricetta;
    try {
        const ricettaJson = await fetch(`https://dummyjson.com/recipes/${id}`)
        ricetta = await ricettaJson.json();
    } catch (err) {
        throw new Error(`Impossibile recuperare ricetta con id ${id}`);
    }
    if (ricetta.message) {
        throw new Error(ricetta.message);
    }

    const userId = ricetta.userId;

    let chef;
    try {
        const chefJson = await fetch(`https://dummyjson.com/users/${userId}`)
        chef = await chefJson.json();
    } catch (err) {
        console.error(err);
        throw new Error(`Impossibile recuperare lo chef con id ${userId}`)
    }
    if (chef.message) {
        throw new Error(chef.message);
    }
    const dataFormattata = dayjs(chef.birthDate).format("DD-MM-YYYY");
    return dataFormattata;
}


(async () => {
    try {
        const birthday = await getChefBirthday(1);
        console.log("Data di nascita dello chef:", birthday);
    } catch (err) {
        console.error("Errore:", err.message);
    }
})();

// Bonus 1
// Attualmente, se la prima richiesta non trova una ricetta, la seconda richiesta potrebbe comunque essere eseguita causando errori a cascata.

// Modifica getChefBirthday(id) per intercettare eventuali errori prima di fare la seconda richiesta.
// Bonus 2
//Utilizza la libreria dayjs per formattare la data di nascita nel formato giorno/mese/anno.
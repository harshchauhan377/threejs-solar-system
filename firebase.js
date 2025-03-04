import { db } from "./firebaseConfig.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

async function saveConfig() {
    try {
        await addDoc(collection(db, "solarSystem"), {
            size: document.getElementById('size').value,
            speed: document.getElementById('speed').value,
            distance: document.getElementById('distance').value
        });
        alert('Configuration Saved!');
    } catch (error) {
        console.error("Error saving configuration:", error);
    }
}

async function loadConfig() {
    try {
        const querySnapshot = await getDocs(collection(db, "solarSystem"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            document.getElementById('size').value = data.size;
            document.getElementById('speed').value = data.speed;
            document.getElementById('distance').value = data.distance;
        });
    } catch (error) {
        console.error("Error loading configuration:", error);
    }
}

document.getElementById('save').addEventListener('click', saveConfig);
document.getElementById('load').addEventListener('click', loadConfig);

import ws from "k6/ws";
import { sleep } from "k6";
import { Trend, Counter } from "k6/metrics";

// 🔹 Métricas personalizadas
const latency = new Trend("ws_latency");
const successfulConnections = new Counter("ws_successful_connections");

export const options = {
    vus: 10, // 10 usuarios virtuales simultáneos
    duration: "30s", // Prueba de carga de 30 segundos
};

export default function () {
    const url = "ws://localhost:3000/api/socket/io/?EIO=4&transport=websocket";
    const startTime = new Date().getTime();

    ws.connect(url, function (socket) {
        socket.on("open", function () {
            const responseTime = new Date().getTime() - startTime;
            latency.add(responseTime);
            successfulConnections.add(1);
            console.log(`✅ Conectado! Latencia: ${responseTime} ms`);

            // Envía un mensaje de prueba
            socket.send(JSON.stringify({ type: "test", message: "Hola, servidor!" }));
        });

        socket.on("message", function (message) {
            console.log(`📩 Mensaje recibido: ${message}`);
        });
    });

    // Espera un segundo antes de la siguiente iteración
    sleep(1);
}

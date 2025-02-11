document.getElementById('validateBtn').addEventListener('click', async () => {
    const xmlInput = document.getElementById('xmlInput').value;
    const xsdInput = document.getElementById('xsdInput').value;

    try {
        const response = await fetch('http://localhost:3000/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Cambia a application/json
            },
            body: JSON.stringify({ xml: xmlInput, xsd: xsdInput }) // Envía como JSON
        });

        const result = await response.json();
        const output = document.getElementById('output');
        output.textContent = result.valid ? 'XML es válido: ' + result.message : 'XML no es válido: ' + result.message;
    } catch (error) {
        console.error('Error:', error);
        const output = document.getElementById('output');
        output.textContent = 'Error de conexión: ' + error.message;
    }
});

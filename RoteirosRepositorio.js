const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"});

class RoteirosRepositorio {
    static async gerarRoteiro(cidades, res) {
        if (cidades.length > 10)
            throw new Error('O número máximo de cidades é 10');
        const texto = `Gere um roteiro de viagem de 5 dias começando na primeira cidade do array JSON a seguir e podendo conter as localidades restantes (considere também o clima de cada dia):\n ${JSON.stringify(cidades, null, 4)}`

        const result = await model.generateContentStream(texto);
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            res.write(chunkText);
        }

        res.status(200).end();
    }
}

module.exports = RoteirosRepositorio;


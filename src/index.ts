import express, { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = process.env.PORT || 8080;

const prisma = new PrismaClient();

// compatibilidade
app.use(express.json());

const Produto = z.object({
    name: z.string().min(4, 'o medicamento precisa ter + de 4 caracteres.'),
    price: z.number().multipleOf(0.01).min(0),
    category: z.enum(["Analgésico", "Diurético", "Antibiótico"]),
    stock: z.number().int().min(0)
})

const ReserveSchema = z.object({
    client: z.string().min(4),
    quantity: z.number().min(1)
})

type Medicamento = z.infer<typeof Produto> & { id: number };

app.post('/medicamentos', async (req: Request<{}, {}, z.infer<typeof Produto>>, res: Response) => {

    try {

        const result = Produto.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: 'Dados inválidos.', errors: result.error.flatten() });
            return;
        }

        const existenteMedicamento = await prisma.medicamento.findUnique({ where: { name: req.body.name } });   
        if (existenteMedicamento) {
            res.status(400).json({ message: 'Medicamento já existente no sistema.', data: existenteMedicamento });
            return;
        }

        const novoMedicamento: Medicamento = await prisma.medicamento.create({
            data: result.data,
        });

        res.status(201).json({ message: 'Medicamento adicionado a farmácia!', data: novoMedicamento });

    } catch (err) {
        res.status(500).json({ message: 'Erro, tente novamente mais tarde.', error: err });
    }
});

app.get('/medicamentos', async (req: Request, res: Response) => {

    try {

        const medicamentos = await prisma.medicamento.findMany();
        if (medicamentos.length === 0) {
            res.status(200).json({ message: 'Nenhum medicamento no sistema.', data: [] });
        }

        res.status(200).json({ message: 'Todos os medicamentos da farmácia!', data: medicamentos });

    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor.', err });
    }
})

app.put('/medicamentos/:id', async (req: Request, res: Response) => {

    try {
        const { id } = req.params;
        const { name, price, category, stock } = req.body;
        const idInt = parseInt(id);

        const result = Produto.safeParse({ name, price, category, stock });
        if (!result.success) {
            res.status(400).json({ message: 'Dados inválidos', errors: result.error.flatten() });
            return;
        }

        // medicamento existe?
        const existenteMedicamento = await prisma.medicamento.findFirst({where: {id: idInt}});
        if(!existenteMedicamento){
            res.status(404).json({ message: 'Medicamento não encontrado no sistema.' });
            return;
        }
        
        const atualizarMedicamento: Medicamento = await prisma.medicamento.update({ where: { id: idInt }, data: result.data });

        res.status(200).json({ message: 'Medicamento atualizado!', data: atualizarMedicamento });

    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor.', err });
    }

})

app.delete('/medicamentos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const idInt = parseInt(id);
    try {

        await prisma.medicamento.delete({ where: { id: idInt } });
        res.status(204).send();

    } catch (err) {
        if(err.code === 'P2025'){
            res.status(404).json({ message: 'Medicamento não encontrado.' })
        }
        res.status(500).json({ message: 'Erro no servidor.', err });
    }
});

app.post('/medicamentos/:id/reserve', async (req: Request, res: Response) => {
    const { id } = req.params;
    const idInt = parseInt(id);
    const { client, quantity } = req.body;

    try {

        const result = ReserveSchema.safeParse({ client, quantity });
        if (!result.success) {
            res.status(400).json({ message: 'Dados inválidos.' });
            return;
        }

        // medicamento já reservado
        const reservadoCliente = await prisma.reservedBy.findFirst({where: client}) 
        if (reservadoCliente) {
            res.status(400).json({ message: 'Você já fez uma reserva.' });
            return;
        }

        const medicamento = await prisma.medicamento.findFirst({ where: { id: idInt } });
        if (!medicamento) {
            res.status(400).json({ message: 'Não foi possível encontrar o medicamento.' });
            return;
        }

        const estoqueAtual = Number(medicamento?.stock) - quantity;

        if(estoqueAtual < 0){
            res.status(200).json({ message: 'Estoque esgotado.' })
            return;
        }
        const reservarMedicamento = await prisma.medicamento.update({ where: { id: idInt }, data: { stock: estoqueAtual } });

        const reservado = await prisma.reservedBy.create({ data: { client, quantity } });

        res.status(200).json({ message: `Medicamento reservado por ${client}.`, estoque: estoqueAtual });

    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor.', err });
    }
})


app.listen(port, () => {
    console.log('server: on-line');
})


import { conexion } from '../db/db.js';
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: '*'}));

app.get('/getLog/:action', async (req, res) =>{

    try {

         const { action } = req.params
         const [rows] = await conexion.query('CALL listStock(?)', [action]);

         return res.status(200).json({ message: 'Log obtenido correctamente', status: 200, data: rows[0] });
        
    } catch (error) {

        return res.status(300).json({ message: 'Ocurrió un error al obtener el log ' + error });
        
    }

});

app.post('/addProduct', async (req, res) => {

    try {

        const { code, name, stock_minimum } = req.body;
        const [rows] = await conexion.query('CALL newItem(?, ?, ?)', [code, name, stock_minimum]);

        return res.status(200).json({ message: 'Producto agregado correctamente', status: 200});

    } catch (error) {

        return res.status(300).json({ message: 'Ocurrió un error al agregar al producto' + error });

    }
});

app.post('/updateStock', async (req, res) => {

    try {

        const { action, id, stock } = req.body;
        const [rows] = await conexion.query('CALL itemAction(?, ?, ?)', [action, id, stock]);

        return res.status(200).json({ message: rows[0][0].message, status: rows[0][0].code_request });

    } catch (error) {

        
        return res.status(300).json({ message: 'Ocurrió un error al agregar el stock', status: 300 });

    }
});

app.post('/deleteItem', async (req, res) => {

    try {

        const { id, action } = req.body;
        const [rows] = await conexion.query('CALL deleteItem(?, ?)', [id, action]);

        return res.status(200).json({ message: rows[0][0].message, status: rows[0][0].code_request });

    } catch (error) {

        
        return res.status(300).json({ message: 'Ocurrió un error al agregar el stock', status: 300 });

    }
});



export default app;
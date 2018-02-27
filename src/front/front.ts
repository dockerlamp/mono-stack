import * as express from 'express';
import { Request, Response } from 'express';
import * as morgan from 'morgan';

let app = express();
app.use(morgan('tiny'));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Front app listening on port 3000!');
});
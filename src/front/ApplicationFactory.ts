import { Express } from 'express';
import * as express from 'express';
import * as session from 'express-session';
import * as morgan from 'morgan';
import * as passport from 'passport';

export class ApplicationFactory {
    public createApplication(): Express {
        let app = express();
        app.use(morgan('tiny'));
        // @TODO passport jako globalny obiekt - czy jest mozliwosc zdefiniowania osobnej
        // instancji np passAuth = new Passport(...)
        app.use(passport.initialize());
        // @TODO do weryfikacji czym jest sesja passport, czy ma jakies powiazanie z sessja expressa
        // czy takie rozwiazanie jest skalowalne (dotyczy loadbalncerow)
        app.use(passport.session());
        app.use(session({
            secret: 'mono-stack',
        }));

        return app;
    }
}
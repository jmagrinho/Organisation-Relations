import Koa from 'koa';
import organisationRouter from "./routes"
import { AppLogger } from './utils/logger';
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');

export const app = new Koa();

AppLogger.ConfigureLogger()
app.use(koaBody())
app.use(bodyParser())
app.use(organisationRouter.routes());
app.use(organisationRouter.allowedMethods());




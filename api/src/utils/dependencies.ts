import express = require("express");
import { Container } from "inversify";

import { IMainService } from "../services/ImainService";
import { MainService } from "../services/mainService";
import { mainController } from "../controllers/mainController";

const container = new Container();

// Bind interfaces to their implementations

container.bind<IMainService>("IMainService").to(MainService);

const app = express();

const mainControllerMap = new mainController(container.get<IMainService>("IMainService"));

export { container, mainControllerMap };

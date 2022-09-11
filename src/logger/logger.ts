import { createLogger, transports, Logger, format } from "winston";
import path = require("path")
import fs = require("fs")

export class AppLogger {
    private static logger: Logger;
    private static logDirectory = path.join(process.cwd(), "logs")
    
    private static CreateLogFolderIfNotExists() {
        if(!fs.existsSync(this.logDirectory)){
            fs.mkdirSync(this.logDirectory)
        }
    }

    private static SetLogger() {
        const logFormat = format.printf(({level, timestamp, message}) => {
            return `${timestamp} - ${level}: ${message}`
        });

        this.logger = createLogger({
            format: format.combine(format.json(), format.timestamp(), logFormat),
            transports: [
                new transports.Console(),
                new transports.File({
                    filename: path.join(AppLogger.logDirectory,`log_pipedrivetask_${new Date().toISOString()}.log`),
                    level: "verbose"
                    
                })
            ],
            exitOnError: false
        });
    }

    public static ConfigureLogger() {
        this.CreateLogFolderIfNotExists();
        this.SetLogger();
    }

    private static GetValue(name:String, value:any){
        if(typeof name === "string"){
            return value;
        } else {
            return JSON.stringify(value);
        }
    }

    public static info(name: string, value: any) {
        this.logger.log("info", this.GetValue(name, value))
    }

    public static error(name: string, value: any) {
        this.logger.error("error", this.GetValue(name, value))
    }
}
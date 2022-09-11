import Router from 'koa-router';
import { OrganisationController } from '../controllers';
import { tryParseJSONObjectRequest } from '../utils/jsonValidation';
import { AppLogger } from '../utils/logger';
import { createRelationFeedbackJSON, showRelationsJSON } from '../utils/types';

const organisationRouter = new Router();
const organisationController = new OrganisationController();


organisationRouter.get('/:organisationName/:page', async (ctx) => {
    try {
        AppLogger.info("info", `Called endpoint 1 - Organisation name: ${ctx.params.organisationName}; page:${ctx.params.page}`)

        ctx.type="json"
        const organisationName = ctx.params.organisationName
        const page = ctx.params.page
        if(+page < 0){
            ctx.status = 400
            ctx.message = "Page number is invalid."
            ctx.throw(ctx.status,ctx.message)
        } 

        const resultList = await organisationController.findRelations({organisationName,page})
        
        
        
        const nextPage = +page + 1
        const prevPage = +page > 0 ? +page - 1 : -1 
        const nextURL = ctx.URL.origin + "/" + encodeURI(organisationName) + "/" + nextPage
        const prevURL = prevPage != -1 ? ctx.URL.origin + "/" + encodeURI(organisationName) + "/" + prevPage : "None"

        ctx.status = 200
        ctx.message = "OK"
        
        const resultJSON: showRelationsJSON = {
            status_code:ctx.status,
            status_message:ctx.message,
            results: resultList,
            results_count: resultList.length,
            next_page: nextURL,
            prev_page: prevURL
        }

        ctx.body = resultJSON
    } catch(e) {
        AppLogger.error("error",e)

        const resultJSON: showRelationsJSON = {
            status_code:ctx.status,
            status_message:ctx.message,
            results: [],
            results_count: 0,
            next_page: "None",
            prev_page: "None"
        }

        ctx.body = resultJSON
    }
    
    
});

organisationRouter.post('/', async (ctx) => {
    try{
        AppLogger.info("info", `Called endpoint 1 - body: ${JSON.stringify(ctx.request.body)}`)
        ctx.type="json"
        const param = ctx.request.body
        if(tryParseJSONObjectRequest(param)){
            await organisationController.createRelations(param.org_name, param.daughters)
            
        } else {
            ctx.status = 400
            ctx.message = "JSON is not in the correct format."
            ctx.throw(ctx.status,ctx.message)
        }

        ctx.status = 200
        ctx.message = "OK"
        const resultJSON: createRelationFeedbackJSON = {
            status_code: ctx.status,
            status_message: ctx.message
        }
        ctx.body = resultJSON
    } catch(e){
        AppLogger.error("error",e)
        
        const resultJSON: createRelationFeedbackJSON = {
            status_code: ctx.status,
            status_message: ctx.message
        }
        ctx.body = resultJSON
    }
});


export default organisationRouter
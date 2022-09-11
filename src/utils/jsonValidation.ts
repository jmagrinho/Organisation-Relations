const Ajv = require("ajv")
const ajv = new Ajv()

const jsonSchemaRequest = {
    type: "object",
    properties: {
        org_name: { type: "string" },
        daughters: {
            type: "array",
            items: { $ref: "#" }
        }
    }, 
    required: [ "org_name" ]
}

const validateRequest = ajv.compile(jsonSchemaRequest)

export function tryParseJSONObjectRequest (jsonString){
    
    const valid = validateRequest(jsonString)

    if(!valid){
        return false;
    }
    return true;
};

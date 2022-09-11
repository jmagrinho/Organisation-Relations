import { Prisma } from '@prisma/client';
import { db } from '../database/db.server';
import { AppLogger } from '../logger/logger';
import { Organisation, OrganisationRelationsList } from '../types/types';
import { ROWS_LIMIT } from '../utils/variables';



export class OrganisationService {


    // Finds one unique organisation by name
    public async getOrganisation(organisationName): Promise<Organisation> {
        try {
            const result = await db.organisation.findUnique({ where : { Name: organisationName}})
            return result
        } catch (e) {
            AppLogger.error("error",e)
        }
    }

    public async createOrganisation(organisationName): Promise<Organisation> {
        try {
            let new_organisation: Prisma.OrganisationCreateInput
            new_organisation = {
                Name: organisationName
            }
        
            const result = await db.organisation.create({data: new_organisation})
            return result
        } catch(e) {
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                if(e.code === "P2002"){
                    AppLogger.info("error","There is a unique constraint violation, a new Organisation cannot be created with this name: " + organisationName)
                }
            } else {
                AppLogger.error("error",e)
            }
        }
        
        return;
    }

    public async createRelation(idOrganisationA: number, idOrganisationB:number, idRelationType: number): Promise<void>  {
        try { 
 
            await db.organisationRelation.create({
                data: {
                    IDOrganisationA: idOrganisationA ,
                    IDOrganisationB: idOrganisationB,
                    Type: idRelationType
                }
            })

        } catch(e) {
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                if(e.code === "P2002"){
                    AppLogger.info("error","There is a unique constraint violation, a new relation cannot be created between organisations with IdA=" + idOrganisationA +" and IdB=" + idOrganisationB)
                }
            } else {
                AppLogger.error("error",e)
            }
            
        }
    }



    public async getOrganisationRelations(idOrganisation, page): Promise<Array<OrganisationRelationsList>> {
        const organisationRelationsList = await 
        db.organisationRelation.findMany({
            where: {
                IDOrganisationB: idOrganisation
            },
            select: {
                IDOrganisationA:false,
                IDOrganisationB:false,
                Type:false,
                FKOrganisationA_OrganisationRelation_Organisation: {
                    select: {
                        Id: false,
                        Name: true
                    },
                },
                FKType_OrganisationRelation_Relation : {
                    select: {
                        Id: false,
                        Name: true
                    }
                }     
            },
            orderBy: {
                FKOrganisationA_OrganisationRelation_Organisation : {
                    Name: 'asc'
                }
            },
            take: ROWS_LIMIT,
            skip: page * ROWS_LIMIT
        }) 

        let resultList = new Array<OrganisationRelationsList>();
        
        organisationRelationsList.forEach(element => {
            let new_item: OrganisationRelationsList = {
                org_name: element.FKOrganisationA_OrganisationRelation_Organisation.Name,
                relationship_type: element.FKType_OrganisationRelation_Relation.Name
            }

            resultList.push(new_item)
        });
        
        return resultList
    }
}





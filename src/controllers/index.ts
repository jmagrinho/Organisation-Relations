import { OrganisationService } from "../services";
import { RelationType } from "../enums/enums";
import { AppLogger } from "../logger/logger";
import { Organisation } from "../types/types";

export class OrganisationController {
  
  _organisationService: OrganisationService;

  constructor(){
    this._organisationService = new OrganisationService()

  }

    public async findRelations(obj) {
      if(await this.organisationExists(obj.organisationName)) {
        const organisationId = await this.getOrganisationId(obj.organisationName);
        const serviceResult = this._organisationService.getOrganisationRelations(organisationId, obj.page)

        return serviceResult
      }
      return [];
    }

    public async createRelations(parentName, daughtersList): Promise<void>{
      
      let parent = await this.createOrganisation(parentName);

      let new_daughter_list= new Array<Organisation>();

      if (!(daughtersList === undefined || daughtersList.length == 0)) {
        for await (let tempDaughter of daughtersList) {

          let daughter = await this.createOrganisation(tempDaughter.org_name);
          new_daughter_list.push(daughter)

          this.createParentDaughterRelation(parent.Id, daughter.Id);
          await this.createRelations(daughter.Name, tempDaughter.daughters)
        };

        if(new_daughter_list.length > 0){
          await this.createSisterRelation(new_daughter_list);
        }
      }

    }

    // Checks if organisation exists in database
    // Returns true if it exists, otherwise return false
    private async organisationExists(organisationName): Promise<boolean>{
      const serviceResult = await this._organisationService.getOrganisation(organisationName)
      if(serviceResult){
        return true
      }
      AppLogger.info("info",`Found no organisation with name ${organisationName}`)
      return false
    }


    private async getOrganisationId(organisationName): Promise<number> {
      const serviceResult = await this._organisationService.getOrganisation(organisationName)
      return serviceResult.Id
    }

    private async createOrganisation(organisationName): Promise<Organisation> {
      const organisationExists = await this.organisationExists(organisationName)
      if (!organisationExists) {
        return await this._organisationService.createOrganisation(organisationName);
      } 
      return await this._organisationService.getOrganisation(organisationName);
    }

    private async createParentDaughterRelation(parentId, daughterId): Promise<void> {
      if(parentId != daughterId) {
        
        //Creates Parent <-> Daughter relation
        await this._organisationService.createRelation(parentId, daughterId, RelationType.Parent);
        //Creates Daughter <-> Parent relation
        await this._organisationService.createRelation(daughterId, parentId, RelationType.Daughter);
               
      }
    }


    private async createSisterRelation(daughtersList): Promise<void>{
      for(let i = 0; i < daughtersList.length - 1; i++) {
        for(let j=i + 1; j < daughtersList.length; j++) {

        //Creates both Sister <-> Sister relation
        this._organisationService.createRelation(daughtersList[i].Id, daughtersList[j].Id, RelationType.Sister);
        this._organisationService.createRelation(daughtersList[j].Id, daughtersList[i].Id, RelationType.Sister);
        }
      }
    }

    
}
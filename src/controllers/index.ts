import { OrganisationService } from "../services";
import { RelationType } from "../utils/enums";
import { Organisation } from "../utils/types";

export class OrganisationController {
  
  _organisationService: OrganisationService;

  constructor(){
    this._organisationService = new OrganisationService()

  }

    public async findRelations(obj) {
      if(this.organisationExists(obj.organisationName)) {
        const organisationId = await this.getOrganisationId(obj.organisationName);
        const serviceResult = this._organisationService.getOrganisationRelations(organisationId, obj.page)

        return serviceResult
      }
      const result = "{}"
      return JSON.parse(result);
    }



    public async createRelations(parent, daughtersList): Promise<void>{
      
      await this.createOrganisation(parent);
      let new_sis_list= new Array<Organisation>();

      if (!(daughtersList === undefined || daughtersList.length == 0)) {
          for await (let daughter of daughtersList) {

          let new_sis = await this.createOrganisation(daughter.org_name);
          new_sis_list.push(new_sis)

          this.createParentDaughterRelation(parent, daughter.org_name);
          this.createRelations(daughter.org_name, daughter.daughters)
        };

      this.createSisterRelation(new_sis_list);
      }

    }

    // Checks if organisation exists in database
    // Returns true if it exists, otherwise return false
    private async organisationExists(organisationName): Promise<boolean>{
      const serviceResult = await this._organisationService.getOrganisation(organisationName)
      if(serviceResult){
        return true
      }
      return false
    }


    private async getOrganisationId(organisationName): Promise<number> {
      const serviceResult = await this._organisationService.getOrganisation(organisationName)
      return serviceResult.Id
    }


    // Creates a new organisation if there is none with the same "organisationName"
    private async createOrganisation(organisationName): Promise<Organisation> {
      const organisationExists = await this.organisationExists(organisationName)
      if (!organisationExists) {
        return await this._organisationService.createOrganisation(organisationName);
      }
      return null;
    }

    private async createParentDaughterRelation(parent, daughter): Promise<void> {
      if(parent != daughter) {
        const parentId = await this.getOrganisationId(parent);
        const daughterId = await this.getOrganisationId(daughter);
        
        //Creates Parent <-> Daughter relation
        this._organisationService.createRelation(parentId, daughterId, RelationType.Parent);
        //Creates Daughter <-> Parent relation
        this._organisationService.createRelation(daughterId, parentId, RelationType.Daughter);
               
      }
    }

    private createSisterRelation(daughtersList): void{
      for(let i = 0, j=i+1; i < daughtersList.length - 1 && j < daughtersList.length; i++, j++) {      
        
        //Creates both Sister <-> Sister relation
        this._organisationService.createRelation(daughtersList[i].Id, daughtersList[j].Id, RelationType.Sister);
        this._organisationService.createRelation(daughtersList[j].Id, daughtersList[i].Id, RelationType.Sister);

      }
    }

    
}